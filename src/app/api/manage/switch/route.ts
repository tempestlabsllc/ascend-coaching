import { NextResponse } from "next/server";
import { stripe } from "@/lib";
import { site, tiers } from "@/config/site";
import { sendEmail, emailLayout, esc } from "@/email";
import { logActivity } from "@/activity";
import { validManageKey } from "@/manage-link";
import { cancelAtEnd, cancelPendingSwitch, day, liveSub, planLabel, priceLabel, renewalOf, scheduleSwitch, undoCancel, who } from "@/plan-change";

// Plan actions from a client's signed manage link. Everything is done in Stripe right
// away; the coach gets an alert (name, email, phone, plans) and the client a confirmation.
export async function POST(req: Request) {
  const { c, k, action = "switch", tier: tierId, term } = await req.json().catch(() => ({}));
  if (!stripe || !validManageKey(c, k)) return NextResponse.json({ ok: false, message: "This link isn't valid. Request a new one below." }, { status: 400 });
  const customer = await stripe.customers.retrieve(c).catch(() => null);
  const sub = customer && !customer.deleted ? await liveSub(c) : null;
  if (!customer || customer.deleted || !sub) return NextResponse.json({ ok: false, message: `We couldn't find an active plan. Email ${site.email} and I'll sort it out.` }, { status: 404 });

  const current = planLabel(sub.metadata?.tier, sub.metadata?.term);
  const client = who(customer);
  const mail = (subject: string, title: string, body: string) =>
    customer.email ? sendEmail(customer.email, subject, emailLayout(title, `${body}<p style="margin:14px 0 0;color:#6b7280;font-size:14px">Changed your mind? Use the same link again, or reply to this email.</p>`)).catch(() => false) : Promise.resolve(false);
  const fail = (e: unknown, what: string) => {
    console.error(what, e);
    return logActivity("plan-change", `Needs attention: ${what} for ${customer.name || customer.email}`, `${client} tried to ${what} (current plan: ${current}) but Stripe returned an error. Please do it in Stripe.`, { alert: true })
      .then(() => NextResponse.json({ ok: true, message: `Got it. Your request is in and I'll confirm by email shortly.` }));
  };

  if (action === "switch") {
    const t = tiers.find((x) => x.id === tierId);
    if (!t) return NextResponse.json({ ok: false, message: "Pick a plan." }, { status: 400 });
    const is3 = term === "3month";
    const next = planLabel(t.id, is3 ? "3month" : "monthly");
    if (next === current) return NextResponse.json({ ok: false, message: "You're already on that plan." }, { status: 400 });
    try {
      const at = await scheduleSwitch(sub, t, is3);
      await logActivity("plan-change", `Plan switch: ${customer.name || customer.email} → ${t.name}`,
        `${client} switched from ${current} to ${next} at ${priceLabel(t, is3)}. Done automatically in Stripe; starts ${day(at)}.`, { alert: true });
      await mail("Your plan change is confirmed", "Plan Change Confirmed", `<p style="margin:0 0 14px">You're switching from <strong>${esc(current)}</strong> to <strong>${esc(next)}</strong> at ${esc(priceLabel(t, is3))}.</p>
<p style="margin:0">The new plan starts on your next billing date, <strong>${esc(day(at))}</strong>. Until then you stay on your current plan, with nothing extra to pay.</p>`);
      return NextResponse.json({ ok: true, message: `Done. You're switching to ${next} from ${day(at)}. A confirmation is on its way to your email.` });
    } catch (e) { return fail(e, `switch to ${next}`); }
  }

  if (action === "cancel") {
    try {
      const at = await cancelAtEnd(sub);
      await logActivity("cancel", `Cancellation: ${customer.name || customer.email} (${current})`,
        `${client} cancelled their ${current} plan. Done automatically in Stripe; coaching continues until ${day(at)} and they won't be charged again.`, { alert: true, link: "/admin?tab=clients" });
      await mail("Your plan has been cancelled", "Cancellation Confirmed", `<p style="margin:0 0 14px">Your <strong>${esc(current)}</strong> plan is cancelled. You won't be charged again.</p>
<p style="margin:0">Your coaching continues until <strong>${esc(day(at))}</strong>, the end of the period you've paid for. Thanks for training with me, and you're welcome back any time.</p>`);
      return NextResponse.json({ ok: true, message: `Done. Your plan is cancelled and you won't be charged again. Coaching continues until ${day(at)}.` });
    } catch (e) { return fail(e, "cancel"); }
  }

  if (action === "undo-cancel") {
    try {
      await undoCancel(sub);
      await logActivity("plan-change", `Cancellation undone: ${customer.name || customer.email}`, `${client} undid their cancellation. ${current} renews on ${day(renewalOf(sub))}.`, { alert: true });
      return NextResponse.json({ ok: true, message: `Done. Your plan stays active and renews on ${day(renewalOf(sub))}.` });
    } catch (e) { return fail(e, "undo their cancellation"); }
  }

  if (action === "undo-switch") {
    try {
      await cancelPendingSwitch(sub);
      await logActivity("plan-change", `Plan switch undone: ${customer.name || customer.email}`, `${client} undid their pending plan switch and stays on ${current}.`, { alert: true });
      return NextResponse.json({ ok: true, message: `Done. You'll stay on ${current}.` });
    } catch (e) { return fail(e, "undo their plan switch"); }
  }

  return NextResponse.json({ ok: false, message: "Unknown action." }, { status: 400 });
}
