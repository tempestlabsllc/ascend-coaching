import { site, tiers, formatPrice, threeMonth, threeMonthTotalCents } from "@/config/site";
import { CANCEL_NOTE, validManageKey } from "@/manage-link";
import ManageForm from "./ManageForm";
import SwitchForm from "./SwitchForm";

export const metadata = { title: "Change or Cancel Your Plan" };

export default async function ManagePage({ searchParams }: { searchParams: Promise<{ error?: string; done?: string; c?: string; k?: string }> }) {
  const { error, done, c, k } = await searchParams;
  const signed = !!c && !!k && validManageKey(c, k);
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
      {(error || (c && !signed)) && <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">{error === "portal" ? "We couldn't open your plan settings just now." : "That link isn't valid."} Request a new link below, or email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a> and I&apos;ll sort it out.</p>}

      {signed ? (
        <>
          <section className="mt-8 rounded-3xl border border-black/10 bg-white p-6">
            <h2 className="text-xl font-bold">Switch Plans</h2>
            <p className="mt-1 text-sm text-black/60">Pick your new plan. The switch starts on your next billing date, and you stay on your current plan until then.</p>
            <SwitchForm c={c!} k={k!} options={options} />
          </section>
          <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6">
            <h2 className="text-xl font-bold">Cancel, Update Card or Get Invoices</h2>
            <p className="mt-1 text-sm text-black/60">Opens your secure billing page, run by Stripe.</p>
            <a href={`/api/manage?c=${encodeURIComponent(c!)}&k=${encodeURIComponent(k!)}`} className="btn-outline mt-4 inline-flex">Open Billing Settings</a>
          </section>
        </>
      ) : (
        <>
          <p className="mt-4 text-black/70">Enter the email you used at checkout and we&apos;ll send you a secure link. From there you can switch plans, cancel, update your card or download invoices.</p>
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
