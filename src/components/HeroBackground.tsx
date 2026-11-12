// Hero background: a dark "gym floor" with stacks of weight plates that grow
// left to right like a progress chart, a glowing PR line across their tops,
// and a spotlight that follows the cursor. Pure CSS/SVG (cursor via LiveEffects).

const stacks = [2, 3, 3, 4, 5, 5, 6, 7, 9]; // plates per stack: steady progress
const labels = ["135", "155", "165", "185", "205", "215", "245", "275", "315"];

export default function HeroBackground() {
  const W = 1440, H = 900, floor = 820, plateH = 30, gap = 8, colW = 104, step = 160, x0 = 60;
  const tops = stacks.map((n, i) => ({ x: x0 + i * step + colW / 2, y: floor - n * (plateH + gap) - 20 }));
  const line = tops.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ");
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_70%_10%,#123a5c_0%,#0a2238_45%,#061523_100%)]">
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />

      {/* cursor spotlight */}
      <div className="hero-spot" />

      {/* moving gym-floor grid */}
      <div className="hero-floor" />

      {/* plate stacks + PR line */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#89cff0" stopOpacity="0.55" />
            <stop offset="1" stopColor="#3a9ad9" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="prLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#89cff0" stopOpacity="0.1" />
            <stop offset="1" stopColor="#bfe9ff" stopOpacity="1" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {stacks.map((n, i) => {
          const x = x0 + i * step;
          const fade = 0.35 + (i / (stacks.length - 1)) * 0.65;
          return (
            <g key={i} opacity={fade}>
              {/* bar sleeve */}
              <rect x={x + colW / 2 - 5} y={floor - n * (plateH + gap) - 14} width="10" height={n * (plateH + gap) + 14} rx="3" fill="#89cff0" opacity="0.25" />
              {Array.from({ length: n }).map((_, k) => {
                const w = colW - (k === n - 1 && n > 2 ? 16 : 0);
                return (
                  <rect
                    key={k}
                    className="plate"
                    style={{ animationDelay: `${0.25 + i * 0.12 + k * 0.06}s` }}
                    x={x + (colW - w) / 2}
                    y={floor - (k + 1) * (plateH + gap)}
                    width={w}
                    height={plateH}
                    rx="8"
                    fill="url(#plate)"
                    stroke="#89cff0"
                    strokeOpacity="0.5"
                  />
                );
              })}
              <text x={x + colW / 2} y={floor + 34} textAnchor="middle" className="plate-label" fill="#89cff0" fillOpacity="0.55" fontSize="18" fontWeight="800">{labels[i]}</text>
            </g>
          );
        })}

        <path d={line} pathLength={1} fill="none" stroke="url(#prLine)" strokeWidth="4" strokeLinejoin="round" filter="url(#glow)" className="pr-line" />
        {tops.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === tops.length - 1 ? 9 : 5} fill="#bfe9ff" className="pr-dot" style={{ animationDelay: `${1.4 + i * 0.12}s` }} filter="url(#glow)" />
        ))}
        <g className="pr-dot" style={{ animationDelay: "2.6s" }}>
          <rect x={tops[8].x - 46} y={tops[8].y - 62} width="92" height="36" rx="18" fill="#89cff0" />
          <text x={tops[8].x} y={tops[8].y - 38} textAnchor="middle" fill="#061523" fontSize="18" fontWeight="900">NEW PR</text>
        </g>
      </svg>

      {/* keep the headline side readable, then blend into the page */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,21,35,.92)_0%,rgba(6,21,35,.7)_40%,rgba(6,21,35,.1)_70%,transparent_100%)]" />
      
    </div>
  );
}
