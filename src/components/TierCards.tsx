"use client";
import { tiers, formatPrice, type Tier } from "@/config/site";
import BuyButton from "./BuyButton";

const styles: Record<Tier["color"], { band: string; name: string; check: string; button: string; ring: string; label: string }> = {
  grey: {
    band: "bg-gradient-to-r from-gray-400 to-gray-500",
    name: "text-gray-600",
    check: "text-gray-500",
    button: "btn w-full bg-gray-500 text-white hover:bg-gray-600",
    ring: "border-gray-300",
    label: "text-gray-600",
  },
  gold: {
    band: "tier-gold",
    name: "text-gold",
    check: "text-amber-600",
    button: "btn w-full tier-gold text-ink hover:opacity-90",
    ring: "border-transparent",
    label: "text-amber-700",
  },
  rainbow: {
    band: "tier-rainbow",
    name: "text-rainbow",
    check: "text-brand",
    button: "btn w-full tier-rainbow text-white [text-shadow:0_1px_3px_rgba(0,0,0,.6)] hover:opacity-90",
    ring: "border-transparent",
    label: "text-brand",
  },
};

function TierCard({ t }: { t: Tier }) {
  const s = styles[t.color];

  const card = (
    <div className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm ${t.color === "grey" ? s.ring : "border-0"}`}>
      <div className={`h-3 ${s.band}`} />
      <div className="flex flex-1 flex-col p-6">
        {t.highlighted && <span className="tier-gold mb-3 w-fit rounded-full px-3 py-1 text-xs font-bold text-ink">MOST POPULAR</span>}
        <h3 className={`text-2xl font-extrabold ${s.name}`}>{t.name}</h3>
        <p className="mt-1 text-sm text-black/60">{t.blurb}</p>
        <p className="mt-4 text-4xl font-extrabold">
          {formatPrice(t.priceCents)}
          {t.interval === "month" && <span className="text-base font-medium text-black/50">/month</span>}
        </p>
        <ul className="mt-6 space-y-2 text-sm">
          {t.features.map((f) => (
            <li key={f} className="flex gap-2"><span className={s.check}>✓</span>{f}</li>
          ))}
        </ul>

        <div className="flex-1" />
        <div className="mt-6"><BuyButton kind="tier" id={t.id} label={`Choose ${t.name}`} className={s.button} /></div>
      </div>
    </div>
  );

  const frame = t.color === "grey" ? "" : `${t.color === "gold" ? "tier-gold" : "tier-rainbow"} rounded-2xl p-[3px]`;
  return (
    <div className={`h-full ${frame}`}>
      {card}
    </div>
  );
}

export default function TierCards() {
  return (
    <div>
      <div className="grid items-stretch gap-6 md:grid-cols-3">
        {tiers.map((t) => <TierCard key={t.id} t={t} />)}
      </div>
      <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-brand/20 bg-mist px-6 py-5 text-center sm:flex-row sm:text-left">
        <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z" /></svg>
        </span>
        <p className="text-black/75">
          <strong className="text-ink">Every plan: 1:1 contact with your coach on Trainerize or WhatsApp</strong>, whichever you prefer.
          After you buy, I&apos;ll reach out within 24 hours to review everything with you.
        </p>
      </div>
    </div>
  );
}
