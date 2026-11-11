import { tiers, formatPrice, type Tier } from "@/config/site";
import BuyButton from "./BuyButton";

const styles: Record<Tier["color"], { band: string; name: string; check: string; button: string; ring: string }> = {
  grey: {
    band: "bg-gradient-to-r from-gray-400 to-gray-500",
    name: "text-gray-300",
    check: "text-gray-400",
    button: "btn w-full bg-gray-500 text-white hover:bg-gray-600",
    ring: "border-gray-600",
  },
  gold: {
    band: "tier-gold",
    name: "text-gold",
    check: "text-amber-500",
    button: "btn w-full tier-gold text-ink hover:opacity-90",
    ring: "border-transparent",
  },
  rainbow: {
    band: "tier-rainbow",
    name: "text-rainbow",
    check: "text-brand",
    button: "btn w-full tier-rainbow text-white [text-shadow:0_1px_3px_rgba(0,0,0,.6)] hover:opacity-90",
    ring: "border-transparent",
  },
};

export default function TierCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {tiers.map((t) => {
        const s = styles[t.color];
        const card = (
          <div className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm ${t.color === "grey" ? s.ring : "border-0"}`}>
            <div className={`h-3 ${s.band}`} />
            <div className="flex flex-1 flex-col p-6">
              {t.highlighted && <span className="mb-3 w-fit rounded-full tier-gold px-3 py-1 text-xs font-bold text-ink">MOST POPULAR</span>}
              <h3 className={`text-2xl font-extrabold ${s.name}`}>{t.name}</h3>
              <p className="mt-1 text-sm text-white/60">{t.blurb}</p>
              <p className="mt-4 text-4xl font-extrabold">
                {formatPrice(t.priceCents)}
                {t.interval === "month" && <span className="text-base font-medium text-white/50">/month</span>}
              </p>
              <ul className="mt-6 flex-1 space-y-2 text-sm">
                {t.features.map((f) => <li key={f} className="flex gap-2"><span className={s.check}>✓</span>{f}</li>)}
              </ul>
              <div className="mt-6"><BuyButton kind="tier" id={t.id} label={`Choose ${t.name}`} className={s.button} /></div>
            </div>
          </div>
        );
        // Gold and rainbow tiers get a moving gradient border by wrapping them in an animated frame.
        return t.color === "grey"
          ? <div key={t.id}>{card}</div>
          : <div key={t.id} className={`${t.color === "gold" ? "tier-gold" : "tier-rainbow"} rounded-2xl p-[3px]`}>{card}</div>;
      })}
    </div>
  );
}
