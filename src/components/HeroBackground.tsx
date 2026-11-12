// Hero background: a soft baby-blue sky melting into warm cream, with layered
// fluffy clouds drifting at different speeds. Pure CSS/SVG.

function Cloud({ className, style }: { className: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 400 180" className={`sky-cloud ${className}`} style={style} aria-hidden>
      <defs>
        <linearGradient id="cloudFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f3e9d8" />
        </linearGradient>
      </defs>
      <g fill="url(#cloudFill)">
        <ellipse cx="200" cy="135" rx="185" ry="40" />
        <circle cx="120" cy="110" r="52" />
        <circle cx="190" cy="80" r="70" />
        <circle cx="265" cy="100" r="55" />
        <circle cx="320" cy="122" r="36" />
        <circle cx="70" cy="128" r="32" />
      </g>
    </svg>
  );
}

export default function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#a9dbf5_0%,#cdeafa_35%,#ecf3f2_65%,#f7f0e3_100%)]">
      {/* sun glow */}
      <div className="absolute -top-40 right-[8%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(255,250,235,.95)_0%,rgba(255,245,220,.5)_35%,transparent_70%)]" />

      {/* far clouds: small, soft, slow */}
      <Cloud className="sky-far" style={{ top: "8%", width: 260, animationDuration: "140s", animationDelay: "-20s" }} />
      <Cloud className="sky-far" style={{ top: "22%", width: 200, animationDuration: "160s", animationDelay: "-95s" }} />
      <Cloud className="sky-far" style={{ top: "40%", width: 240, animationDuration: "150s", animationDelay: "-60s" }} />

      {/* mid clouds */}
      <Cloud className="sky-mid" style={{ top: "12%", width: 420, animationDuration: "95s", animationDelay: "-10s" }} />
      <Cloud className="sky-mid" style={{ top: "48%", width: 380, animationDuration: "110s", animationDelay: "-70s" }} />

      {/* near clouds: big, along the bottom like a cloud bank */}
      <Cloud className="sky-near" style={{ bottom: "-6%", width: 760, animationDuration: "70s", animationDelay: "-5s" }} />
      <Cloud className="sky-near" style={{ bottom: "-10%", width: 900, animationDuration: "85s", animationDelay: "-45s" }} />
      <Cloud className="sky-near" style={{ bottom: "-4%", width: 640, animationDuration: "75s", animationDelay: "-30s" }} />

      <div className="hero-spot" />

      {/* keep the headline crisp */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_28%_48%,rgba(255,255,255,.55)_0%,rgba(255,255,255,.2)_50%,transparent_75%)]" />
    </div>
  );
}
