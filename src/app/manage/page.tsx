import { site, tiers, formatPrice, threeMonth, threeMonthTotalCents } from "@/config/site";
import { stripe } from "@/lib";
import { CANCEL_NOTE, validManageKey } from "@/manage-link";
import { day, liveSub, pendingOf, planLabel, renewalOf } from "@/plan-change";
import ManageForm from "./ManageForm";
import SwitchForm from "./SwitchForm";

export const metadata = { title: "Change or Cancel Your Plan" };
export const dynamic = "force-dynamic";

export default async function ManagePage({ searchParams }: { searchParams: Promise<{ error?: string; done?: string; c?: string; k?: string }> }) {
  const { error, done, c, k } = await searchParams;
  const signed = !!c && !!k && validManageKey(c, k);
  const sub = signed && stripe ? await liveSub(c!).catch(() => null) : null;
  const customer = sub && stripe ? await stripe.customers.retrieve(c!).catch(() => null) : null;
  const name = customer && !customer.deleted ? customer.name?.split(" ")[0] : "";
  const pending = sub ? pendingOf(sub) : null;
  const options = tiers.map((t) => ({
    id: t.id,
    name: t.name,
    monthly: `${formatPrice(t.priceCents)}/month`,
    threeMonth: `${formatPrice(threeMonthTotalCents(t.priceCents))} every ${threeMonth.months} months`,
  }));

  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <h1 className="text-4xl font-extrabold">Change or Cancel Your Plan</h1>
      {done && <p className="mt-6 rounded-2xl border border-brand/30 bg-mist p-4 text-black/80">All set. Any changes you made are saved, and you&apos;ll get an email from Stripe confirming them.</p>}
      {(error || (c && !signed)) && <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">{error === "portal" ? "We couldn't open your billing settings just now." : "That link isn't valid."} Request a new link below, or email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a> and I&apos;ll sort it out.</p>}

      {signed && sub ? (
        <>
          <div className="mt-6 rounded-3xl bg-ink p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-[#89cff0]">{name ? `Hi ${name}, your plan` : "Your plan"}</p>
            <p className="mt-1 text-2xl font-extrabold">{planLabel(sub.metadata?.tier, sub.metadata?.term)}</p>
            <p className="mt-1 text-sm text-white/70">{sub.cancel_at_period_end ? "Ends" : "Next billing date"}: {day(renewalOf(sub))}</p>
          </div>
          <SwitchForm c={c!} k={k!} options={options} currentTier={sub.metadata?.tier} currentTerm={sub.metadata?.term}
            cancelling={sub.cancel_at_period_end} pending={pending ? `You're switching to ${pending.label} on ${day(pending.at)}.` : null} />
          <p className="mt-6 text-center text-sm text-black/60">
            Need to update your card or download invoices? <a className="font-semibold text-brand-dark underline" href={`/api/manage?c=${encodeURIComponent(c!)}&k=${encodeURIComponent(k!)}`}>Open Billing Settings</a>
          </p>
        </>
      ) : signed ? (
        <p className="mt-6 rounded-2xl border border-black/10 bg-white p-4 text-black/70">We couldn&apos;t find an active plan on this link. If you think that&apos;s wrong, email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      ) : (
        <>
          <p className="mt-4 text-black/70">Enter the email or phone number you used at checkout. We&apos;ll find your plan and email you a secure link, where you can switch plans or cancel in a couple of taps.</p>
          <ManageForm />
        </>
      )}

      <div className="mt-8 rounded-2xl bg-ink p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-[#89cff0]">Good to Know</p>
        <p className="mt-1 text-white/85">{CANCEL_NOTE}</p>
        <p className="mt-2 text-sm text-white/60">3-month plans are paid up front, so cancelling stops the plan from renewing. See <a className="underline" href="/refunds">Refunds &amp; Cancellations</a>.</p>
      </div>
    </div>
  );
}
