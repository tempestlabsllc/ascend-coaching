import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { isAdmin } from "@/admin/auth";
import { stripe, getRevenue, getSubscriptions, getRecentPurchases, getPromoCodes, couponOf, describeCoupon } from "@/admin/data";
import { formatPrice, threeMonth } from "@/config/site";
import { logout, saveDiscount, setDiscountActive } from "./actions";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const money = (cents: number) => formatPrice(Math.round(cents));
const day = (t: number) => new Date(t * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-card p-5">
      <p className="text-sm font-medium text-black/60">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums">{value}</p>
      {note && <p className="mt-1 text-xs text-black/50">{note}</p>}
    </div>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ msg?: string; err?: string; edit?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { msg, err, edit } = await searchParams;

  if (!stripe) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-extrabold">Admin</h1>
        <p className="mt-4 text-black/70">Stripe isn't connected yet. Add STRIPE_SECRET_KEY in Vercel to see revenue and discounts.</p>
      </div>
    );
  }

  let loadError = "";
  const [rev, subs, recent, promos] = await Promise.all([
    getRevenue(stripe), getSubscriptions(stripe), getRecentPurchases(stripe), getPromoCodes(stripe),
  ]).catch((e) => {
    loadError = e?.message ?? "Couldn't reach Stripe.";
    return [null, null, null, [] as Stripe.PromotionCode[]] as const;
  });
  const editing = edit ? promos.find((p) => p.id === edit) : undefined;
  const ec = editing ? couponOf(editing) : null;
  const active = promos.filter((p) => p.active);
  const inactive = promos.filter((p) => !p.active);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">Admin</h1>
        <form action={logout}><button className="text-sm font-medium underline">Log out</button></form>
      </div>
      {loadError && <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">Stripe error: {loadError}</p>}

      {/* Revenue */}
      {rev && subs && (
        <section className="mt-8">
          <h2 className="text-xl font-bold">Revenue</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Total revenue" value={money(rev.total)} note={rev.refunds ? `after ${money(rev.refunds)} in refunds` : "all time, after refunds"} />
            <Stat label="This month" value={money(rev.month)} note={`last month ${money(rev.prev)}`} />
            <Stat label="Monthly recurring" value={money(subs.mrr)} note="from active plans, before discounts" />
            <Stat label="Active clients" value={String(subs.active)} note="active coaching plans" />
          </div>
          <p className="mt-2 text-xs text-black/50">Amounts are before Stripe fees. Months follow UTC time.</p>

          {subs.plans.length > 0 && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-black/10">
              {subs.plans.map((p) => (
                <div key={p.name} className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-3 last:border-0">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-black/60">{p.monthly} monthly · {p.threeMonth} on {threeMonth.months}-month</p>
                  </div>
                  <p className="font-semibold tabular-nums">{money(p.mrr)}/mo</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Recent purchases */}
      {recent && (
        <section className="mt-10">
          <h2 className="text-xl font-bold">Recent purchases</h2>
          {recent.length === 0 ? <p className="mt-3 text-black/60">No purchases yet.</p> : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
              {recent.map((r) => (
                <div key={r.id} className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-3 last:border-0">
                  <div className="min-w-0">
                    <p className="font-semibold">{r.item}</p>
                    <p className="truncate text-sm text-black/60">{r.email} · {day(r.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold tabular-nums">{money(r.amount)}</p>
                    {r.discount > 0 && <p className="text-xs text-black/50">{money(r.discount)} discount</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Discounts */}
      <section id="discounts" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-bold">Discount codes</h2>
        <p className="mt-1 text-sm text-black/60">Customers type these at checkout. They work on every plan and guide.</p>
        {msg && <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-800">{msg}</p>}
        {err && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}

        <h3 className="mt-6 font-semibold">Active ({active.length})</h3>
        {active.length === 0 ? <p className="mt-2 text-sm text-black/60">No active codes.</p> : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">{active.map((p) => <PromoCard key={p.id} p={p} />)}</div>
        )}

        <form action={saveDiscount} className="mt-8 grid gap-4 rounded-2xl border border-black/10 bg-card p-6 sm:grid-cols-2">
          <h3 className="font-semibold sm:col-span-2">{editing ? (editing.active ? `Change ${editing.code}` : `New code from ${editing.code}`) : "New discount code"}</h3>
          {editing && (
            <p className="text-sm text-black/60 sm:col-span-2">
              {editing.active
                ? `Saving turns off the current ${editing.code} and replaces it with these settings. People who already used it keep their discount.`
                : "Saving makes a new code with these settings."}
              {" "}<a className="underline" href="/admin#discounts">Cancel</a>
            </p>
          )}
          <input type="hidden" name="replace" value={editing?.id ?? ""} />
          <label><span className="label">Code</span>
            <input className="field uppercase" name="code" required pattern="[A-Za-z0-9\-]{3,30}" placeholder="SUMMER20" defaultValue={editing?.code} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label><span className="label">Type</span>
              <select className="field" name="kind" defaultValue={ec?.amount_off ? "amount" : "percent"}>
                <option value="percent">% off</option><option value="amount">$ off</option>
              </select></label>
            <label><span className="label">Amount</span>
              <input className="field" name="value" type="number" min="0.01" step="any" required placeholder="20"
                defaultValue={ec ? (ec.percent_off ?? (ec.amount_off ?? 0) / 100) : undefined} /></label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label><span className="label">Lasts</span>
              <select className="field" name="duration" defaultValue={ec?.duration ?? "once"}>
                <option value="once">First payment</option>
                <option value="repeating">Set number of months</option>
                <option value="forever">Every payment</option>
              </select></label>
            <label><span className="label">Months (if set)</span>
              <input className="field" name="months" type="number" min="1" max="36" placeholder="3" defaultValue={ec?.duration_in_months ?? undefined} /></label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label><span className="label">Max uses (optional)</span>
              <input className="field" name="max" type="number" min="1" placeholder="No limit" defaultValue={editing?.max_redemptions ?? undefined} /></label>
            <label><span className="label">Ends (optional)</span>
              <input className="field" name="expires" type="date"
                defaultValue={editing?.expires_at ? new Date(editing.expires_at * 1000).toISOString().slice(0, 10) : undefined} /></label>
          </div>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" name="first_time" defaultChecked={!!editing?.restrictions?.first_time_transaction} /> New customers only
          </label>
          <button className="btn-primary sm:col-span-2 sm:w-fit">{editing ? "Save changes" : "Create code"}</button>
        </form>

        {inactive.length > 0 && (
          <details className="mt-8">
            <summary className="cursor-pointer font-semibold">Turned off or expired ({inactive.length})</summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">{inactive.map((p) => <PromoCard key={p.id} p={p} />)}</div>
          </details>
        )}
      </section>
    </div>
  );
}

function PromoCard({ p }: { p: Stripe.PromotionCode }) {
  const c = couponOf(p);
  const expired = p.expires_at != null && p.expires_at < Date.now() / 1000;
  const usedUp = p.max_redemptions != null && p.times_redeemed >= p.max_redemptions;
  const canTurnOn = !p.active && !expired && !usedUp && c?.valid !== false;
  return (
    <div className={`rounded-2xl border border-black/10 p-4 ${p.active ? "bg-white" : "bg-black/[0.03] text-black/60"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-lg font-bold">{p.code}</p>
          <p className="text-sm">{describeCoupon(c, money)}</p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.active ? "bg-green-100 text-green-800" : "bg-black/10"}`}>
          {p.active ? "On" : expired ? "Expired" : usedUp ? "Used up" : "Off"}
        </span>
      </div>
      <p className="mt-2 text-xs text-black/50">
        Used {p.times_redeemed}{p.max_redemptions ? ` of ${p.max_redemptions}` : ""} times
        {p.expires_at ? ` · ends ${day(p.expires_at)}` : ""}
        {p.restrictions?.first_time_transaction ? " · new customers only" : ""}
      </p>
      <div className="mt-3 flex gap-2">
        {(p.active || canTurnOn) && (
          <form action={setDiscountActive}>
            <input type="hidden" name="id" value={p.id} />
            <input type="hidden" name="active" value={String(!p.active)} />
            <button className="rounded-full border border-black/20 px-3 py-1 text-sm font-medium hover:bg-black/5">{p.active ? "Turn off" : "Turn on"}</button>
          </form>
        )}
        <a href={`/admin?edit=${p.id}#discounts`} className="rounded-full border border-black/20 px-3 py-1 text-sm font-medium hover:bg-black/5">
          {p.active ? "Change" : "Copy settings"}
        </a>
      </div>
    </div>
  );
}
