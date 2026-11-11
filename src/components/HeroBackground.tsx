// Animated hero background: drifting clouds behind a growth-chart arrow
// that draws itself upward, on a faint moving grid. Pure CSS/SVG, no JS.

function Cloud({ className }: { className: string }) {
  // A soft cloud built from overlapping circles, blurred slightly.
  return (
    <svg viewBox="0 0 320 140" className={`cloud ${className}`} aria-hidden>
      <g fill="currentColor">
        <ellipse cx="160" cy="100" rx="150" ry="38" />
        <circle cx="105" cy="78" r="46" />
        <circle cx="170" cy="58" r="60" />
        <circle cx="235" cy="82" r="40" />
      </g>
    </svg>
  );
}

export default function HeroBackground() {
  // Rising zig-zag like a stock chart going up, ending in an arrowhead.
  const path = "M -20 560 L 140 470 L 250 510 L 400 380 L 520 420 L 700 270 L 820 310 L 960 170 L 1080 200 L 1230 60";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-grid" />

      {/* back clouds */}
      <Cloud className="cloud-a" />
      <Cloud className="cloud-b" />
      <Cloud className="cloud-c" />

      {/* growth arrow */}
      <svg viewBox="0 0 1280 600" preserveAspectRatio="xMaxYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="arrowGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#e0115f" stopOpacity="0.15" />
            <stop offset="1" stopColor="#ff4d8d" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e0115f" stopOpacity="0.22" />
            <stop offset="1" stopColor="#e0115f" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g className="growth">
          <path d={`${path} L 1230 620 L -20 620 Z`} fill="url(#areaGrad)" className="growth-area" />
          <path d={path} pathLength={1} fill="none" stroke="url(#arrowGrad)" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" filter="url(#glow)" className="growth-line" />
          <g className="growth-head">
            <path d="M 1230 60 L 1188 74 L 1213 101 Z" fill="#ff4d8d" filter="url(#glow)" />
          </g>
        </g>
      </svg>

      {/* front clouds, drifting over the arrow */}
      <Cloud className="cloud-d" />
      <Cloud className="cloud-e" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.7)_0%,rgba(255,255,255,.25)_55%,transparent_75%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
    </div>
  );
}
