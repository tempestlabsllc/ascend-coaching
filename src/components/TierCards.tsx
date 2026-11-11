"use client";
import { useState } from "react";
import { tiers, formatPrice, type Tier } from "@/config/site";
import BuyButton from "./BuyButton";

const styles: Record<Tier["color"], { band: string; name: string; check: string; button: string; ring: string; label: string }> = {
  grey: {
    band: "bg-gradient-to-r from-gray-400 to-gray-500",
    name: "text-gray-300",
    check: "text-gray-400",
    button: "btn w-full bg-gray-500 text-white hover:bg-gray-600",
    ring: "border-gray-600",
    label: "text-gray-300",
  },
  gold: {
    band: "tier-gold",
    name: "text-gold",
    check: "text-amber-500",
    button: "btn w-full tier-gold text-ink hover:opacity-90",
    ring: "border-transparent",
    label: "text-amber-400",
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
  const [open, setOpen] = useState(false);
  const s = styles[t.color];
  // Hover opens the details on devices with a mouse; tapping the toggle works everywhere.
  const hover = (v: boolean) => () => {
    if (window.matchMedia("(hover: hover)").matches) setOpen(v);
  };

  const card = (
    <div className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm ${t.color === "grey" ? s.ring : "border-0"}`}>
      <div className={`h-3 ${s.band}`} />
      <div className="flex flex-1 flex-col p-6">
        {t.highlighted && <span className="tier-gold mb-3 w-fit rounded-full px-3 py-1 text-xs font-bold text-ink">MOST POPULAR</span>}
        <h3 className={`text-2xl font-extrabold ${s.name}`}>{t.name}</h3>
        <p className="mt-1 text-sm text-white/60">{t.blurb}</p>
        <p className="mt-4 text-4xl font-extrabold">
          {formatPrice(t.priceCents)}
          {t.interval === "month" && <span className="text-base font-medium text-white/50">/month</span>}
        </p>
        <ul className="mt-6 space-y-2 text-sm">
          {t.features.map((f) => (
            <li key={f} className="flex gap-2"><span className={s.check}>✓</span>{f}</li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`mt-5 flex w-fit items-center gap-1 text-sm font-semibold ${s.label}`}
        >
          {open ? "Hide details" : "See full details"}
          <span className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>▾</span>
        </button>

        <div className={`grid transition-all duration-300 ease-out ${open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
          <div className="overflow-hidden">
            <div className="rounded-xl border border-white/10 bg-paper/60 p-4 text-sm">
              <p className="text-white/80"><span className={`font-semibold ${s.label}`}>Best for: </span>{t.bestFor}</p>
              <dl className="mt-3 space-y-2.5">
                {t.details.map((d) => (
                  <div key={d.label}>
                    <dt className="text-xs font-bold uppercase tracking-wider text-white/50">{d.label}</dt>
                    <dd className="text-white/85">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="flex-1" />
        <div className="mt-6"><BuyButton kind="tier" id={t.id} label={`Choose ${t.name}`} className={s.button} /></div>
      </div>
    </div>
  );

  const frame = t.color === "grey" ? "" : `${t.color === "gold" ? "tier-gold" : "tier-rainbow"} rounded-2xl p-[3px]`;
  return (
    <div onMouseEnter={hover(true)} onMouseLeave={hover(false)} className={`transition-transform duration-300 ${open ? "md:-translate-y-1" : ""} ${frame}`}>
      {card}
    </div>
  );
}

export default function TierCards() {
  return (
    <div className="grid items-start gap-6 md:grid-cols-3">
      {tiers.map((t) => <TierCard key={t.id} t={t} />)}
    </div>
  );
}
