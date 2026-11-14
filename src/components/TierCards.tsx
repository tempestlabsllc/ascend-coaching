"use client";
import { useState } from "react";
import { tiers, formatPrice, threeMonth, threeMonthTotalCents, type Tier } from "@/config/site";
import BuyButton from "./BuyButton";

type Look = { head: string; name: string; sub: string; price: string; muted: string; badge: string; badgeText: string; check: string; button: string; frame: string; glow: string };
const looks: Record<Tier["color"], Look> = {
  grey: {
    head: "bg-gradient-to-br from-[#eef2f5] to-[#dfe5ea]",
    name: "text-ink",
    sub: "text-black/60",
    price: "text-ink",
    muted: "text-black/50",
    badge: "bg-ink/10 text-ink/70",
    badgeText: "Essentials",
    check: "bg-gray-500",
    button: "btn w-full bg-ink text-white hover:bg-black",
    frame: "bg-gradient-to-b from-gray-300 to-gray-200",
    glow: "",
  },
  gold: {
    head: "tier-gold",
    name: "text-ink",
    sub: "text-ink/75",
    price: "text-ink",
    muted: "text-ink/60",
    badge: "bg-ink text-white",
    badgeText: "Most popular",
    check: "bg-amber-500",
    button: "btn w-full tier-gold text-ink hover:opacity-90",
    frame: "tier-gold",
    glow: "shadow-[0_30px_60px_-25px_rgba(214,160,0,.65)]",
  },
  rainbow: {
    head: "bg-ink",
    name: "text-rainbow",
    sub: "text-white/70",
    price: "text-white",
    muted: "text-white/55",
    badge: "tier-rainbow text-white [text-shadow:0_1px_2px_rgba(0,0,0,.5)]",
    badgeText: "All-in",
    check: "bg-brand",
    button: "btn w-full tier-rainbow text-white [text-shadow:0_1px_3px_rgba(0,0,0,.6)] hover:opacity-90",
    frame: "tier-rainbow",
    glow: "shadow-[0_30px_60px_-25px_rgba(58,154,217,.6)]",
  },
};

function TierCard({ t, term }: { t: Tier; term: "monthly" | "3month" }) {
  const is3 = term === "3month";
  const s = looks[t.color];
  const [first, ...rest] = t.features;
  const inherits = /^Everything in /i.test(first);
  const list = inherits ? rest : t.features;
  const monthly = is3 ? threeMonthTotalCents(t.priceCents) / threeMonth.months : t.priceCents;

  return (
    <div className={`lift h-full rounded-[1.4rem] p-[3px] ${s.frame} ${s.glow}`}>
      <div className="flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-card">
        <div className={`relative px-6 pb-6 pt-5 ${s.head}`}>
          <div className="flex items-center justify-between gap-3">
            <h3 className={`text-3xl font-extrabold tracking-tight ${s.name}`}>{t.name}</h3>
            <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${s.badge}`}>
              {t.spotsRemaining != null ? `Only ${t.spotsRemaining} spots left` : s.badgeText}
            </span>
          </div>
          <p className={`mt-1 min-h-[2.5rem] text-sm leading-5 ${s.sub}`}>{t.blurb}</p>
          <p className={`mt-4 text-5xl font-extrabold tracking-tight ${s.price}`}>
            {formatPrice(monthly)}
            <span className={`ml-1 text-base font-medium ${s.muted}`}>/month</span>
          </p>
          <p className={`mt-1 min-h-5 text-sm ${s.muted}`}>
            {is3 ? (
              <><span className="line-through">{formatPrice(t.priceCents * threeMonth.months)}</span>{" "}
              <strong className={s.price}>{formatPrice(threeMonthTotalCents(t.priceCents))}</strong> billed every {threeMonth.months} months</>
            ) : (
              "Billed monthly. Cancel anytime."
            )}
          </p>
        </div>

        <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/45">
            {inherits ? `${first}, plus:` : "What's included"}
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-5 text-black/80">
            {list.map((f) => (
              <li key={f} className="flex gap-3">
                <span aria-hidden className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${s.check}`}>
                  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="flex-1" />
          <div className="mt-7"><BuyButton kind="tier" id={t.id} term={term} label={`Choose ${t.name}`} className={s.button} /></div>
        </div>
      </div>
    </div>
  );
}

export default function TierCards() {
  const [term, setTerm] = useState<"monthly" | "3month">("monthly");
  const opt = (v: "monthly" | "3month", label: React.ReactNode) => (
    <button
      type="button"
      onClick={() => setTerm(v)}
      aria-pressed={term === v}
      className={`rounded-full px-5 py-2 text-sm font-bold transition ${term === v ? "bg-brand text-white shadow" : "text-black/60 hover:text-ink"}`}
    >
      {label}
    </button>
  );
  return (
    <div>
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-card p-1">
          {opt("monthly", "Monthly")}
          {opt("3month", <>3 months <span className={`ml-1 rounded-full px-2 py-0.5 text-xs ${term === "3month" ? "bg-white/25" : "bg-brand/15 text-brand-dark"}`}>Save {threeMonth.discountPercent}%</span></>)}
        </div>
      </div>
      <div className="grid items-stretch gap-6 md:grid-cols-3">
        {tiers.map((t) => <TierCard key={t.id} t={t} term={term} />)}
      </div>
      <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-brand/20 bg-mist px-6 py-5 text-center sm:flex-row sm:text-left">
        <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>
        </span>
        <p className="text-black/75"><strong className="text-ink">Every plan starts with a 1:1 kickoff call or text</strong> to map your struggles and goals, so your plan is built around where you are and where you want to be.</p>
      </div>
    </div>
  );
}
