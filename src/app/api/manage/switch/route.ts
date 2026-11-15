import { NextResponse } from "next/server";
import { stripe } from "@/lib";
import { site, tiers, threeMonth, threeMonthTotalCents, formatPrice } from "@/config/site";
import { sendEmail, emailLayout, esc } from "@/email";
import { logActivity } from "@/activity";
import { validManageKey } from "@/manage-link";

// A client asks to switch plans from their signed manage link. The switch takes effect
// from their next billing date: the coach gets an alert and the client a confirmation.
export async function POST(req: Request) {
  const { c, k, tier: tierId, term } = await req.json().catch(() => ({}));
  if (!stripe || !validManageKey(c, k)) return NextResponse.json({ ok: false, message: "This link isn't valid. Request a new one below." }, { status: 400 });
  const tier = tiers.find((t) => t.id === tierId);
  const is3 = term === "3month";
  if (!tier) return NextResponse.json({ ok: false, message: "Pick a plan." }, { status: 400 });

  const customer = await stripe.customers.retrieve(c).catch(() => null);
  const subs = await stripe.subscriptions.list({ customer: c, status: "active", limit: 5 }).catch(() => null);
  const sub = subs?.data[0];
  if (!customer || customer.deleted || !sub) return NextResponse.json({ ok: false, message: "We couldn't find an active plan. Email " + site.email + " and I'll sort it out." }, { status: 404 });

  const current = tiers.find((t) => t.id === sub.metadata?.tier);
  const curLabel = `${current?.name ?? "Current plan"}${sub.metadata?.term === "3month" ? " (3-month)" : " (monthly)"}`;
  const newLabel = `${tier.name}${is3 ? " (3-month)" : " (monthly)"}`;
  const price = is3 ? `${formatPrice(threeMonthTotalCents(tier.priceCents))} every ${threeMonth.months} months` : `${formatPrice(tier.priceCents)}/month`;
  const end = Math.min(...sub.items.data.map((it) => it.current_period_end));
  const date = new Date(end * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const who = customer.name || customer.email || c;

  await stripe.subscriptions.update(sub.id, { metadata: { ...sub.metadata, requested_change: `${tier.id}:${is3 ? "3month" : "monthly"}` } }).catch(() => {});
  await logActivity("plan-change", `Plan change request: ${who}`,
    `${who} (${customer.email ?? "no email"}) wants to switch from ${curLabel} to ${newLabel} at ${price}, starting their next billing date (${date}). Update their subscription in Stripe before then.`,
    { alert: true, key: `plan-change:${sub.id}:${tier.id}:${is3}:${end}` });
  if (customer.email) {
    await sendEmail(customer.email, "Your plan change request", emailLayout("Plan Change Received", `<p style="margin:0 0 14px">Got it. You asked to switch from <strong>${esc(curLabel)}</strong> to <strong>${esc(newLabel)}</strong> at ${esc(price)}.</p>
<p style="margin:0 0 14px">The change starts on your next billing date, <strong>${esc(date)}</strong>. Until then you stay on your current plan, and you won't be charged anything extra.</p>
<p style="margin:0;color:#6b7280;font-size:14px">Changed your mind? Just reply to this email before ${esc(date)}.</p>`)).catch(() => false);
  }
  return NextResponse.json({ ok: true, message: `Done. Your switch to ${newLabel} starts on your next billing date, ${date}. A confirmation is on its way to your email.` });
}
