// Hero background: soft and subtle. White, with slow-drifting baby-blue light
// and a set of fine lines that gently rise to the right (a quiet nod to growth).

export default function HeroBackground() {
  const lines = Array.from({ length: 9 }, (_, i) => {
    const y = 560 + i * 34;
    return `M -40 ${y} C 380 ${y + 10}, 760 ${y - 40 - i * 4}, 1060 ${y - 170 - i * 6} S 1380 ${y - 430 - i * 4}, 1500 ${y - 520 - i * 2}`;
  });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-white">
      <div className="aura aura-1" />
      <div className="aura aura-2" />
      <div className="aura aura-3" />

      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="hero-lines absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="lineFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3a9ad9" stopOpacity="0" />
            <stop offset="0.45" stopColor="#3a9ad9" stopOpacity="0.22" />
            <stop offset="1" stopColor="#3a9ad9" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {lines.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="url(#lineFade)" strokeWidth={i === 4 ? 1.6 : 1} />
        ))}
      </svg>

      {/* soft grain-free fade so the bottom meets the page cleanly */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
    </div>
  );
}
