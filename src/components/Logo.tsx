// Ascend Coaching logo: a black "rank up" badge whose three blue chevrons light
// up bottom to top on a loop (a live, levelling-up mark), plus the ASCEND
// wordmark set in Russo One.
export function LogoMark({ className = "h-10 w-10", live = true }: { className?: string; live?: boolean }) {
  const chev = ["M13 37 L24 29 L35 37", "M13 28.5 L24 20.5 L35 28.5", "M13 20 L24 11 L35 20"];
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="markBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a1d22" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="chevBlue" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3a9ad9" />
          <stop offset="1" stopColor="#bfe9ff" />
        </linearGradient>
        <filter id="chevGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#markBg)" />
      {/* dim base chevrons */}
      {chev.map((d) => (
        <path key={d} d={d} fill="none" stroke="#3a9ad9" strokeOpacity=".15" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {/* lit chevrons, charging up one after another */}
      {chev.map((d, i) => (
        <path
          key={`lit-${d}`}
          d={d}
          className={live ? "chev-lit" : undefined}
          style={live ? { animationDelay: `${i * 0.35}s` } : undefined}
          fill="none"
          stroke="url(#chevBlue)"
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#chevGlow)"
        />
      ))}
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="group flex items-center gap-2.5">
      <LogoMark className="h-10 w-10 rounded-[13px] shadow-[0_6px_16px_-6px_rgba(0,0,0,.6)] transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="flex flex-col leading-none">
        <span className="font-logo text-[1.45rem] uppercase tracking-[0.01em] text-ink">Ascend</span>
        <span className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.42em] text-brand">Coaching</span>
      </span>
    </span>
  );
}
