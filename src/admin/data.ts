import type Stripe from "stripe";
import { stripe } from "@/lib";
import { tiers, guides } from "@/config/site";

const CAP = 10000; // plenty for a coaching business; keeps the page fast

function monthStart(offset = 0) {
  const d = new Date();
  return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + offset, 1) / 1000);
}

export async function getRevenue(s: Stripe) {
  const thisMonth = monthStart(0), lastMonth = monthStart(-1);
  let total = 0, month = 0, prev = 0, refunds = 0, count = 0;
  for await (const c of s.charges.list({ limit: 100 })) {
    if (++count > CAP) break;
    if (c.status !== "succeeded" || !c.paid) continue;
    const net = c.amount - c.amount_refunded;
    refunds += c.amount_refunded;
    total += net;
    if (c.created >= thisMonth) month += net;
    else if (c.created >= lastMonth) prev += net;
  }
  return { total, month, prev, refunds };
}

export async function getSubscriptions(s: Stripe) {
  const byPlan = new Map<string, { name: string; monthly: number; threeMonth: number; mrr: number }>();
  let mrr = 0, n = 0;
  for await (const sub of s.subscriptions.list({ status: "active", limit: 100 })) {
    if (++n > CAP) break;
    const tierId = sub.metadata?.tier ?? "other";
    const name = tiers.find((t) => t.id === tierId)?.name ?? "Other";
    const row = byPlan.get(tierId) ?? { name, monthly: 0, threeMonth: 0, mrr: 0 };
    const perMonth = sub.items.data.reduce((sum, it) => {
      const p = it.price;
      const months = p.recurring?.interval === "year" ? 12 * (p.recurring.interval_count ?? 1) : (p.recurring?.interval_count ?? 1);
      return sum + ((p.unit_amount ?? 0) * (it.quantity ?? 1)) / months;
    }, 0);
    if (sub.metadata?.term === "3month") row.threeMonth++; else row.monthly++;
    row.mrr += perMonth;
    mrr += perMonth;
    byPlan.set(tierId, row);
  }
  const order = [...tiers.map((t) => t.id), "other"];
  const plans = [...byPlan.entries()].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0])).map(([, v]) => v);
  return { plans, mrr: Math.round(mrr), active: Math.min(n, CAP) };
}

export async function getRecentPurchases(s: Stripe) {
  const res = await s.checkout.sessions.list({ status: "complete", limit: 15 });
  return res.data.map((cs) => {
    const m = cs.metadata ?? {};
    const item =
      m.kind === "tier"
        ? `${tiers.find((t) => t.id === m.id)?.name ?? m.id} coaching${m.term === "3month" ? " (3-month)" : ""}`
        : m.kind === "guide"
          ? (guides.find((g) => g.id === m.id)?.title ?? "Guide")
          : "Purchase";
    return {
      id: cs.id,
      date: cs.created,
      email: cs.customer_details?.email ?? "",
      item,
      amount: cs.amount_total ?? 0,
      discount: cs.total_details?.amount_discount ?? 0,
    };
  });
}

export async function getPromoCodes(s: Stripe) {
  const out: Stripe.PromotionCode[] = [];
  for await (const p of s.promotionCodes.list({ limit: 100, expand: ["data.promotion.coupon"] })) {
    out.push(p);
    if (out.length >= 500) break;
  }
  return out.sort((a, b) => Number(b.active) - Number(a.active) || b.created - a.created);
}

export function couponOf(p: Stripe.PromotionCode) {
  const c = p.promotion.coupon;
  return c && typeof c === "object" ? c : null;
}

export function describeCoupon(c: Stripe.Coupon | null, fmt: (cents: number) => string) {
  if (!c) return "Discount";
  const off = c.percent_off != null ? `${c.percent_off}% off` : `${fmt(c.amount_off ?? 0)} off`;
  const how =
    c.duration === "forever" ? "every payment" : c.duration === "repeating" ? `for ${c.duration_in_months} months` : "first payment only";
  return `${off}, ${how}`;
}

export { stripe };

const tierName = (id?: string) => tiers.find((t) => t.id === id)?.name ?? "Other";
const custOf = (c: string | Stripe.Customer | Stripe.DeletedCustomer | null) =>
  c && typeof c === "object" && !("deleted" in c && c.deleted) ? (c as Stripe.Customer) : null;
const renewalOf = (sub: Stripe.Subscription) =>
  sub.items.data.reduce((min, it) => Math.min(min, it.current_period_end), Infinity);

// Everyone on a plan right now (active, trial, or behind on payment).
export async function getClients(s: Stripe) {
  const out = [];
  for await (const sub of s.subscriptions.list({ limit: 100, expand: ["data.customer"] })) {
    if (out.length >= 2000) break;
    if (!["active", "trialing", "past_due", "unpaid"].includes(sub.status)) continue;
    const c = custOf(sub.customer);
    out.push({
      id: sub.id,
      customerId: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
      name: c?.name ?? "",
      email: c?.email ?? "",
      phone: c?.phone ?? "",
      plan: tierName(sub.metadata?.tier),
      term: sub.metadata?.term === "3month" ? "3-month" : "Monthly",
      start: sub.start_date,
      renews: Number.isFinite(renewalOf(sub)) ? renewalOf(sub) : null,
      status: sub.status,
      cancelling: sub.cancel_at_period_end || !!sub.cancel_at,
    });
  }
  return out.sort((a, b) => b.start - a.start);
}

// Cancellations, plans ending soon, and payment problems.
export async function getChurn(s: Stripe) {
  const [canceled, open, charges] = await Promise.all([
    s.subscriptions.list({ status: "canceled", limit: 50, expand: ["data.customer"] }),
    s.subscriptions.list({ limit: 100, expand: ["data.customer"] }),
    s.charges.list({ limit: 100, created: { gte: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 60 } }),
  ]);
  const who = (sub: Stripe.Subscription) => {
    const c = custOf(sub.customer);
    return { name: c?.name ?? "", email: c?.email ?? "", plan: tierName(sub.metadata?.tier) };
  };
  return {
    canceled: canceled.data.map((sub) => ({
      id: sub.id, ...who(sub),
      date: sub.ended_at ?? sub.canceled_at ?? sub.created,
      reason: [sub.cancellation_details?.feedback, sub.cancellation_details?.comment].filter(Boolean).join(": ").replace(/_/g, " "),
    })),
    ending: open.data.filter((sub) => sub.cancel_at_period_end || sub.cancel_at).map((sub) => ({
      id: sub.id, ...who(sub), date: sub.cancel_at ?? renewalOf(sub),
    })),
    pastDue: open.data.filter((sub) => ["past_due", "unpaid", "incomplete"].includes(sub.status)).map((sub) => ({
      id: sub.id, ...who(sub), status: sub.status.replace("_", " "),
    })),
    failed: charges.data.filter((c) => c.status === "failed").map((c) => ({
      id: c.id, email: c.billing_details?.email ?? c.receipt_email ?? "", amount: c.amount, date: c.created,
      reason: c.outcome?.seller_message ?? c.failure_message ?? "Declined",
    })),
  };
}

// Paid guide sales from Stripe, plus free downloads from stored signups.
export async function getGuideSales(s: Stripe, leads: Record<string, unknown>[]) {
  const sales = new Map<string, { count: number; revenue: number }>();
  let n = 0;
  for await (const cs of s.checkout.sessions.list({ status: "complete", limit: 100 })) {
    if (++n > CAP) break;
    if (cs.metadata?.kind !== "guide" || !cs.metadata.id) continue;
    const row = sales.get(cs.metadata.id) ?? { count: 0, revenue: 0 };
    row.count++;
    row.revenue += cs.amount_total ?? 0;
    sales.set(cs.metadata.id, row);
  }
  const free = new Map<string, number>();
  for (const l of leads) if (typeof l.guide === "string") free.set(l.guide, (free.get(l.guide) ?? 0) + 1);
  return guides
    .map((g) => ({ id: g.id, title: g.title, price: g.priceCents, comingSoon: !!g.comingSoon, sold: sales.get(g.id)?.count ?? 0, revenue: sales.get(g.id)?.revenue ?? 0, free: free.get(g.id) ?? 0 }))
    .sort((a, b) => b.revenue - a.revenue || b.free + b.sold - (a.free + a.sold));
}
