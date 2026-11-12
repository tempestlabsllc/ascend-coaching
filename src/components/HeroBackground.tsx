// Hero background: clean white with a single growth curve. It runs flat along
// the bottom, then sweeps up steeply behind the plan card into an arrow, with
// milestone dots and small "+" marks floating upward. Pure CSS/SVG.

const plus = [
  { l: "62%", d: "0s", s: 18 }, { l: "70%", d: "-3s", s: 14 }, { l: "78%", d: "-6s", s: 20 },
  { l: "86%", d: "-1.5s", s: 12 }, { l: "92%", d: "-4.5s", s: 16 }, { l: "74%", d: "-7.5s", s: 10 },
];

export default function HeroBackground() {
  // exponential-style curve in a 1440x800 box
  const curve = "M -20 770 C 500 770, 900 750, 1150 690 S 1325 430, 1360 140";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-white">
      <div className="hero-dots" />
      <div className="hero-spot" />

      <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="gLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#89cff0" stopOpacity="0.15" />
            <stop offset="0.6" stopColor="#3a9ad9" stopOpacity="0.8" />
            <stop offset="1" stopColor="#2378b5" />
          </linearGradient>
          <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#89cff0" stopOpacity="0.28" />
            <stop offset="1" stopColor="#89cff0" stopOpacity="0" />
          </linearGradient>
          <filter id="gGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={curve} pathLength={1} fill="none" stroke="url(#gLine)" strokeWidth="5" strokeLinecap="round" filter="url(#gGlow)" className="pr-line" />
        {[[724, 749], [1027, 714], [1330, 529], [1349, 303]].map(([x, y], i) => (
          <g key={i} className="pr-dot" style={{ animationDelay: `${1.6 + i * 0.25}s` }}>
            <circle cx={x} cy={y} r="14" fill="#89cff0" opacity="0.25" />
            <circle cx={x} cy={y} r="6" fill="#3a9ad9" />
          </g>
        ))}
        <path d="M 1363 118 L 1375 150 L 1343 146 Z" fill="#2378b5" className="pr-dot" style={{ animationDelay: "2.9s" }} />
      </svg>

      {/* little + marks floating upward */}
      {plus.map((p, i) => (
        <span key={i} className="grow-plus" style={{ left: p.l, animationDelay: p.d, fontSize: p.s }}>+</span>
      ))}
    </div>
  );
}
