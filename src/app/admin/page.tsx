import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { isAdmin } from "@/admin/auth";
import {
  stripe, getRevenue, getSubscriptions, getRecentPurchases, getPromoCodes, couponOf, describeCoupon,
  getClients, getChurn, getGuideSales,
} from "@/admin/data";
import { formatPrice, threeMonth, guides } from "@/config/site";
import { readRecords, storeConfigured, type Stored } from "@/store";
import { logout, saveDiscount, setDiscountActive } from "./actions";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const money = (cents: number) => formatPrice(Math.round(cents));
const day = (t: number) => new Date(t * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const isoDay = (s: unknown) => (typeof s === "string" ? day(Date.parse(s) / 1000) : "");
const waLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "")}`;

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-card p-5">
      <p className="text-sm font-medium text-black/60">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums">{value}</p>
      {note && <p className="mt-1 text-xs text-black/50">{note}</p>}
    </div>
  );
}
const Rows = ({ children }: { children: React.ReactNode }) => <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">{children}</div>;
const Row = ({ children }: { children: React.ReactNode }) => <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-3 last:border-0">{children}</div>;
const Empty = ({ children }: { children: React.ReactNode }) => <p className="mt-3 text-sm text-black/60">{children}</p>;
const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="mt-10 text-xl font-bold first:mt-0">{children}</h2>;
const NeedsStore = () => (
  <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
    Storage isn't set up yet, so nothing is saved here. In Vercel, open Storage, add <strong>Upstash (Redis)</strong>, connect it to this project, then redeploy.
    New submissions show up after that; earlier ones stay in your email.
  </p>
);

const TABS = [
  ["overview", "Overview"], ["clients", "Clients"], ["forms", "Intake & check-ins"], ["guides", "Guides"],
  ["churn", "Cancellations"], ["leads", "Leads"], ["discounts", "Discounts"],
] as const;
type Tab = (typeof TABS)[number][0];
type Params = { tab?: string; msg?: string; err?: string; edit?: string; q?: string; type?: string };

export default async function AdminPage({ searchParams }: { searchParams: Promise<Params> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const sp = await searchParams;
  const tab: Tab = (TABS.find(([id]) => id === sp.tab)?.[0] ?? (sp.edit || sp.msg || sp.err ? "discounts" : "overview"));

  let body: React.ReactNode;
  try {
    if (!stripe && ["overview", "clients", "guides", "churn", "discounts"].includes(tab)) {
      body = <p className="text-black/70">Stripe isn't connected yet. Add STRIPE_SECRET_KEY in Vercel.</p>;
    } else {
      body = await {
        overview: () => Overview(stripe!),
        clients: () => Clients(stripe!),
        forms: () => Forms(sp),
        guides: () => Guides(stripe!),
        churn: () => Churn(stripe!),
        leads: () => Leads(),
        discounts: () => Discounts(stripe!, sp),
      }[tab]();
    }
  } catch (e) {
    body = <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">Couldn't load this: {(e as Error)?.message ?? "unknown error"}</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">Admin</h1>
        <form action={logout}><button className="text-sm font-medium underline">Log out</button></form>
      </div>
      <nav className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2">
        {TABS.map(([id, label]) => (
          <a key={id} href={`/admin?tab=${id}`}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${id === tab ? "bg-ink text-white" : "border border-black/15 hover:bg-black/5"}`}>{label}</a>
        ))}
      </nav>
      <div className="mt-6">{body}</div>
    </div>
  );
}

async function Overview(s: Stripe) {
  const [rev, subs, recent] = await Promise.all([getRevenue(s), getSubscriptions(s), getRecentPurchases(s)]);
  return (
    <>
      <H2>Revenue</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total revenue" value={money(rev.total)} note={rev.refunds ? `after ${money(rev.refunds)} in refunds` : "all time, after refunds"} />
        <Stat label="This month" value={money(rev.month)} note={`last month ${money(rev.prev)}`} />
        <Stat label="Monthly recurring" value={money(subs.mrr)} note="from active plans, before discounts" />
        <Stat label="Active clients" value={String(subs.active)} note="active coaching plans" />
      </div>
      <p className="mt-2 text-xs text-black/50">Amounts are before Stripe fees. Months follow UTC time.</p>
      {subs.plans.length > 0 && (
        <Rows>{subs.plans.map((p) => (
          <Row key={p.name}>
            <div><p className="font-semibold">{p.name}</p><p className="text-sm text-black/60">{p.monthly} monthly · {p.threeMonth} on {threeMonth.months}-month</p></div>
            <p className="font-semibold tabular-nums">{money(p.mrr)}/mo</p>
          </Row>
        ))}</Rows>
      )}
      <H2>Recent purchases</H2>
      {recent.length === 0 ? <Empty>No purchases yet.</Empty> : (
        <Rows>{recent.map((r) => (
          <Row key={r.id}>
            <div className="min-w-0"><p className="font-semibold">{r.item}</p><p className="truncate text-sm text-black/60">{r.email} · {day(r.date)}</p></div>
            <div className="text-right"><p className="font-semibold tabular-nums">{money(r.amount)}</p>{r.discount > 0 && <p className="text-xs text-black/50">{money(r.discount)} discount</p>}</div>
          </Row>
        ))}</Rows>
      )}
    </>
  );
}

async function Clients(s: Stripe) {
  const [clients, forms] = await Promise.all([getClients(s), storeConfigured() ? readRecords("forms") : Promise.resolve([] as Stored[])]);
  const intakeBy = new Map<string, Stored>();
  for (const f of forms) if (f.form === "intake" && typeof f.email === "string") {
    const k = f.email.toLowerCase(); if (!intakeBy.has(k)) intakeBy.set(k, f);
  }
  return (
    <>
      <H2>Clients ({clients.length})</H2>
      <p className="mt-1 text-sm text-black/60">Everyone on a coaching plan, newest first.</p>
      {clients.length === 0 ? <Empty>No clients yet.</Empty> : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {clients.map((c) => {
            const intake = c.email ? intakeBy.get(c.email.toLowerCase()) : undefined;
            const phone = c.phone || (typeof intake?.phone === "string" ? intake.phone : "");
            const name = c.name || (typeof intake?.name === "string" ? intake.name : "") || c.email;
            return (
              <div key={c.id} className="rounded-2xl border border-black/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="truncate font-semibold">{name}</p><p className="text-sm">{c.plan} · {c.term}</p></div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${c.status === "active" && !c.cancelling ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-900"}`}>
                    {c.cancelling ? "Cancelling" : c.status === "active" ? "Active" : c.status.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-xs text-black/60">Started {day(c.start)}{c.renews ? ` · ${c.cancelling ? "ends" : "renews"} ${day(c.renews)}` : ""}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  {c.email && <a className="rounded-full border border-black/20 px-3 py-1" href={`mailto:${c.email}`}>Email</a>}
                  {phone && <a className="rounded-full border border-black/20 px-3 py-1" href={`tel:${phone}`}>Call</a>}
                  {phone && <a className="rounded-full border border-black/20 px-3 py-1" href={waLink(phone)} target="_blank" rel="noopener">WhatsApp</a>}
                  {c.email && <a className="rounded-full border border-black/20 px-3 py-1" href={`/admin?tab=forms&q=${encodeURIComponent(c.email)}`}>{intake ? "Intake & check-ins" : "Forms"}</a>}
                </div>
                {c.email && <p className="mt-2 truncate text-xs text-black/50">{c.email}{phone ? ` · ${phone}` : ""}</p>}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

const HIDE = new Set(["form", "savedAt", "submittedAt", "waiver"]);
const label = (k: string) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

async function Forms(sp: Params) {
  if (!storeConfigured()) return <><H2>Intake & check-ins</H2><NeedsStore /></>;
  const all = await readRecords("forms");
  const q = (sp.q ?? "").trim().toLowerCase();
  const type = sp.type === "intake" || sp.type === "check-in" ? sp.type : "";
  const list = all.filter((f) => (!type || f.form === type) && (!q || [f.name, f.email].some((v) => typeof v === "string" && v.toLowerCase().includes(q))));
  const pill = (t: string, l: string) => (
    <a href={`/admin?tab=forms${t ? `&type=${t}` : ""}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
      className={`rounded-full px-3 py-1 text-sm font-medium ${type === t ? "bg-brand text-white" : "border border-black/15"}`}>{l}</a>
  );
  return (
    <>
      <H2>Intake & check-ins</H2>
      <form className="mt-4 flex gap-2" action="/admin">
        <input type="hidden" name="tab" value="forms" />{type && <input type="hidden" name="type" value={type} />}
        <input className="field" name="q" defaultValue={sp.q} placeholder="Search name or email" />
        <button className="btn-primary !px-4 !py-2">Search</button>
      </form>
      <div className="mt-3 flex gap-2">{pill("", "All")}{pill("intake", "Intake")}{pill("check-in", "Check-ins")}</div>
      {list.length === 0 ? <Empty>Nothing here yet.</Empty> : (
        <div className="mt-4 space-y-3">
          {list.slice(0, 200).map((f, i) => (
            <details key={i} className="rounded-2xl border border-black/10 p-4">
              <summary className="cursor-pointer">
                <span className="font-semibold">{String(f.name ?? f.email ?? "Unknown")}</span>
                <span className="text-sm text-black/60"> · {f.form === "check-in" ? "Check-in" : "Intake"} · {isoDay(f.savedAt)}</span>
              </summary>
              <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                {Object.entries(f).filter(([k, v]) => !HIDE.has(k) && v !== "" && v != null).map(([k, v]) => (
                  <div key={k} className={String(v).length > 60 ? "sm:col-span-2" : ""}>
                    <dt className="text-xs font-medium text-black/50">{label(k)}</dt>
                    <dd className="whitespace-pre-wrap break-words">{Array.isArray(v) ? v.join(", ") : String(v)}</dd>
                  </div>
                ))}
              </dl>
            </details>
          ))}
        </div>
      )}
    </>
  );
}

async function Guides(s: Stripe) {
  const leads = storeConfigured() ? await readRecords("leads") : [];
  const rows = await getGuideSales(s, leads);
  const total = rows.reduce((t, r) => t + r.revenue, 0);
  return (
    <>
      <H2>Guides</H2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Stat label="Guide revenue" value={money(total)} note="all time, paid guides" />
        <Stat label="Paid sales" value={String(rows.reduce((t, r) => t + r.sold, 0))} />
        <Stat label="Free downloads" value={String(rows.reduce((t, r) => t + r.free, 0))} note={storeConfigured() ? "email signups" : "needs storage set up"} />
      </div>
      <Rows>{rows.map((r) => (
        <Row key={r.id}>
          <div className="min-w-0">
            <p className="font-semibold">{r.title}</p>
            <p className="text-sm text-black/60">{r.comingSoon ? "Coming soon" : r.price ? money(r.price) : "Free"} · {r.sold} sold · {r.free} free downloads</p>
          </div>
          <p className="font-semibold tabular-nums">{money(r.revenue)}</p>
        </Row>
      ))}</Rows>
      {!storeConfigured() && <NeedsStore />}
    </>
  );
}

async function Churn(s: Stripe) {
  const c = await getChurn(s);
  const who = (x: { name: string; email: string }) => x.name || x.email || "Unknown";
  return (
    <>
      <H2>Payment problems ({c.pastDue.length})</H2>
      <p className="mt-1 text-sm text-black/60">Card failed and Stripe is retrying. Reach out before they drop off.</p>
      {c.pastDue.length === 0 ? <Empty>None right now.</Empty> : (
        <Rows>{c.pastDue.map((x) => (
          <Row key={x.id}><div className="min-w-0"><p className="font-semibold">{who(x)}</p><p className="truncate text-sm text-black/60">{x.plan} · {x.email}</p></div>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold capitalize text-red-800">{x.status}</span></Row>
        ))}</Rows>
      )}
      <H2>Ending soon ({c.ending.length})</H2>
      <p className="mt-1 text-sm text-black/60">Cancelled, but still active until the end of what they paid for.</p>
      {c.ending.length === 0 ? <Empty>None right now.</Empty> : (
        <Rows>{c.ending.map((x) => (
          <Row key={x.id}><div className="min-w-0"><p className="font-semibold">{who(x)}</p><p className="truncate text-sm text-black/60">{x.plan} · {x.email}</p></div>
            <p className="shrink-0 text-sm">ends {day(x.date)}</p></Row>
        ))}</Rows>
      )}
      <H2>Failed payments, last 60 days ({c.failed.length})</H2>
      {c.failed.length === 0 ? <Empty>None.</Empty> : (
        <Rows>{c.failed.map((x) => (
          <Row key={x.id}><div className="min-w-0"><p className="truncate font-semibold">{x.email || "Unknown"}</p><p className="text-sm text-black/60">{x.reason} · {day(x.date)}</p></div>
            <p className="font-semibold tabular-nums">{money(x.amount)}</p></Row>
        ))}</Rows>
      )}
      <H2>Cancelled ({c.canceled.length})</H2>
      {c.canceled.length === 0 ? <Empty>No cancellations.</Empty> : (
        <Rows>{c.canceled.map((x) => (
          <Row key={x.id}><div className="min-w-0"><p className="font-semibold">{who(x)}</p><p className="truncate text-sm text-black/60">{x.plan}{x.reason ? ` · ${x.reason}` : ""}</p></div>
            <p className="shrink-0 text-sm">{day(x.date)}</p></Row>
        ))}</Rows>
      )}
    </>
  );
}

async function Leads() {
  if (!storeConfigured()) return <><H2>Leads</H2><NeedsStore /></>;
  const leads = await readRecords("leads");
  const byEmail = new Map<string, { email: string; first: string; guides: Set<string> }>();
  for (const l of [...leads].reverse()) {
    if (typeof l.email !== "string") continue;
    const row = byEmail.get(l.email) ?? { email: l.email, first: l.savedAt, guides: new Set<string>() };
    if (typeof l.guide === "string") row.guides.add(guides.find((g) => g.id === l.guide)?.title ?? l.guide);
    byEmail.set(l.email, row);
  }
  const list = [...byEmail.values()].reverse();
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <H2>Leads ({list.length})</H2>
        {list.length > 0 && <a className="btn-outline !px-4 !py-2 text-sm" href="/admin/leads.csv">Download CSV</a>}
      </div>
      <p className="mt-1 text-sm text-black/60">Emails from free guide signups. All agreed to marketing emails.</p>
      {list.length === 0 ? <Empty>No signups saved yet.</Empty> : (
        <Rows>{list.map((l) => (
          <Row key={l.email}><div className="min-w-0"><p className="truncate font-semibold">{l.email}</p><p className="text-sm text-black/60">{[...l.guides].join(", ")}</p></div>
            <p className="shrink-0 text-sm">{isoDay(l.first)}</p></Row>
        ))}</Rows>
      )}
    </>
  );
}

async function Discounts(s: Stripe, { msg, err, edit }: Params) {
  const promos = await getPromoCodes(s);
  const editing = edit ? promos.find((p) => p.id === edit) : undefined;
  const ec = editing ? couponOf(editing) : null;
  const active = promos.filter((p) => p.active);
  const inactive = promos.filter((p) => !p.active);
  return (
    <>
      {/* Discounts */}
      <section id="discounts">
        <H2>Discount codes</H2>
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
              {" "}<a className="underline" href="/admin?tab=discounts">Cancel</a>
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
    </>
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
        <a href={`/admin?tab=discounts&edit=${p.id}`} className="rounded-full border border-black/20 px-3 py-1 text-sm font-medium hover:bg-black/5">
          {p.active ? "Change" : "Copy settings"}
        </a>
      </div>
    </div>
  );
}
