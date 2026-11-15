import type Stripe from "stripe";
import { stripe } from "@/lib";
import { site, tiers, threeMonth, threeMonthTotalCents, formatPrice, type Tier } from "@/config/site";

// Self-serve plan changes: find a client's plan, switch it from their next billing date
// (via a Stripe subscription schedule), or cancel it at the end of the paid period.

const LIVE = ["active", "trialing", "past_due", "unpaid"];
export const termLabel = (term?: string) => (term === "3month" ? "3-month" : "monthly");
export const planLabel = (tierId?: string, term?: string) => `${tiers.find((t) => t.id === tierId)?.name ?? "Coaching"} (${termLabel(term)})`;
export const priceLabel = (t: Tier, is3: boolean) =>
  is3 ? `${formatPrice(threeMonthTotalCents(t.priceCents))} every ${threeMonth.months} months` : `${formatPrice(t.priceCents)}/month`;
export const renewalOf = (sub: Stripe.Subscription) => Math.min(...sub.items.data.map((it) => it.current_period_end));
export const day = (ts: number) => new Date(ts * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });

/** Phone numbers as Stripe stores them (E.164). US numbers may be typed without +1. */
export function normalizePhone(raw: string) {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return `+1${d}`;
  return d.length >= 11 ? `+${d}` : "";
}

/** Find a client with a live plan by email or phone. */
export async function findClient(contact: string) {
  if (!stripe) return null;
  const v = contact.trim();
  let customers: Stripe.Customer[] = [];
  if (v.includes("@")) {
    customers = (await stripe.customers.list({ email: v, limit: 10 }).catch(() => null))?.data ?? [];
  } else {
    const p = normalizePhone(v);
    if (!p) return null;
    customers = (await stripe.customers.search({ query: `phone:'${p}'`, limit: 10 }).catch(() => null))?.data ?? [];
  }
  for (const c of customers) {
    const sub = await liveSub(c.id);
    if (sub) return { customer: c, sub };
  }
  return null;
}

export async function liveSub(customerId: string) {
  const subs = await stripe!.subscriptions.list({ customer: customerId, status: "all", limit: 10 }).catch(() => null);
  return subs?.data.find((s) => LIVE.includes(s.status)) ?? null;
}

/** "Jane Doe · jane@x.com · +1555…" for coach alerts. */
export function who(c: Stripe.Customer) {
  return [c.name || "(no name)", c.email, c.phone].filter(Boolean).join(" · ");
}

// One Stripe product per plan, created the first time it's needed.
const productCache = new Map<string, string>();
async function productFor(t: Tier) {
  const hit = productCache.get(t.id);
  if (hit) return hit;
  for await (const p of stripe!.products.list({ active: true, limit: 100 })) {
    if (p.metadata?.ascend_tier === t.id) { productCache.set(t.id, p.id); return p.id; }
  }
  const p = await stripe!.products.create({ name: `${t.name} Coaching`, tax_code: "txcd_10000000", metadata: { ascend_tier: t.id } });
  productCache.set(t.id, p.id);
  return p.id;
}

const tax = process.env.STRIPE_AUTOMATIC_TAX === "true";
const priceId = (p: string | Stripe.Price | Stripe.DeletedPrice) => (typeof p === "string" ? p : p.id);

/**
 * Switch a plan from the next billing date. Until then the client stays on (and keeps
 * paying for) their current plan; then the new plan and price start, with no proration.
 */
export async function scheduleSwitch(sub: Stripe.Subscription, t: Tier, is3: boolean) {
  const s = stripe!;
  if (sub.cancel_at_period_end) sub = await s.subscriptions.update(sub.id, { cancel_at_period_end: false });
  const schedId = typeof sub.schedule === "string" ? sub.schedule : sub.schedule?.id;
  const sched = schedId ? await s.subscriptionSchedules.retrieve(schedId) : await s.subscriptionSchedules.create({ from_subscription: sub.id });
  const curStart = sched.current_phase?.start_date;
  const cur = sched.phases.find((p) => p.start_date === curStart) ?? sched.phases[0];
  const product = await productFor(t);
  const meta = { ...sub.metadata, tier: t.id, term: is3 ? "3month" : "monthly" };
  delete (meta as Record<string, string>).pending_change;
  const nextPhase: Stripe.SubscriptionScheduleUpdateParams.Phase = {
    items: [{
      quantity: 1,
      price_data: {
        currency: site.currency,
        product,
        unit_amount: is3 ? threeMonthTotalCents(t.priceCents) : t.priceCents,
        recurring: { interval: "month", interval_count: is3 ? threeMonth.months : 1 },
        ...(tax ? { tax_behavior: "exclusive" as const } : {}),
      },
    }],
    metadata: meta,
    proration_behavior: "none",
    duration: { interval: "month", interval_count: is3 ? threeMonth.months : 1 },
    ...(tax ? { automatic_tax: { enabled: true } } : {}),
  };
  const curPhase = (items: Stripe.SubscriptionScheduleUpdateParams.Phase["items"]): Stripe.SubscriptionScheduleUpdateParams.Phase => ({
    items,
    start_date: cur.start_date,
    end_date: cur.end_date,
    proration_behavior: "none",
    ...(cur.metadata && Object.keys(cur.metadata).length ? { metadata: cur.metadata } : {}),
  });
  const keepItems = cur.items.map((i) => ({ price: priceId(i.price), quantity: i.quantity ?? 1 }));
  try {
    await s.subscriptionSchedules.update(sched.id, { end_behavior: "release", proration_behavior: "none", phases: [curPhase(keepItems), nextPhase] });
  } catch {
    // Checkout prices are one-off; if Stripe won't reuse one, restate it with the same amount.
    const restated = await Promise.all(cur.items.map(async (i) => {
      const p = await s.prices.retrieve(priceId(i.price));
      return {
        quantity: i.quantity ?? 1,
        price_data: {
          currency: p.currency,
          product: typeof p.product === "string" ? p.product : p.product.id,
          unit_amount: p.unit_amount ?? 0,
          recurring: { interval: p.recurring!.interval, interval_count: p.recurring!.interval_count },
          ...(p.tax_behavior && p.tax_behavior !== "unspecified" ? { tax_behavior: p.tax_behavior } : {}),
        },
      };
    }));
    await s.subscriptionSchedules.update(sched.id, { end_behavior: "release", proration_behavior: "none", phases: [curPhase(restated), nextPhase] });
  }
  const when = cur.end_date;
  await s.subscriptions.update(sub.id, { metadata: { pending_change: `${t.id}:${is3 ? "3month" : "monthly"}:${when}` } }).catch(() => {});
  return when;
}

/** Drop any pending switch so the plan just renews as it is. */
async function releaseSchedule(sub: Stripe.Subscription) {
  const schedId = typeof sub.schedule === "string" ? sub.schedule : sub.schedule?.id;
  if (schedId) await stripe!.subscriptionSchedules.release(schedId).catch(() => {});
  if (sub.metadata?.pending_change) await stripe!.subscriptions.update(sub.id, { metadata: { pending_change: "" } }).catch(() => {});
}

/** Cancel at the end of the period already paid for. */
export async function cancelAtEnd(sub: Stripe.Subscription) {
  await releaseSchedule(sub);
  const updated = await stripe!.subscriptions.update(sub.id, { cancel_at_period_end: true });
  return renewalOf(updated);
}

export async function undoCancel(sub: Stripe.Subscription) {
  await stripe!.subscriptions.update(sub.id, { cancel_at_period_end: false });
}

export async function cancelPendingSwitch(sub: Stripe.Subscription) {
  await releaseSchedule(sub);
}

/** "pro:monthly:1767225600" → readable pending switch, if any. */
export function pendingOf(sub: Stripe.Subscription) {
  const [tier, term, at] = (sub.metadata?.pending_change ?? "").split(":");
  if (!tier || !at) return null;
  return { tier, term, at: Number(at), label: planLabel(tier, term) };
}
