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
