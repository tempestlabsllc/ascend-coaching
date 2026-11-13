// Ascend Coaching logo: a black "rank up" badge whose three blue chevrons light
// up bottom to top on a loop (a live, levelling-up mark), plus a wordmark whose
// A is an athletic italic with blue speed lines.
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

// Stylised capital A: athletic italic with blue speed lines trailing off the crossbar.
// (Other options drawn for Alex: bold geometric, split, stencil; see previews/logo-a-options.png.)
function SpeedA() {
  return (
    <svg viewBox="-6 0 32 24" className="mr-[0.03em] inline-block h-[0.74em] w-auto align-baseline" aria-hidden>
      <g transform="skewX(-14) translate(5 0)">
        <path d="M0 24 L10 0 L16 0 L26 24 L19.6 24 L13 7.8 L6.4 24 Z" fill="currentColor" />
        <path d="M8.6 14.4 L18 14.4 L19.4 17.8 L7.2 17.8 Z" fill="currentColor" />
      </g>
      <path d="M-4 16.1 L6 16.1" stroke="#3a9ad9" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M-1 19.6 L5 19.6" stroke="#3a9ad9" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="group flex items-center gap-2.5">
      <LogoMark className="h-10 w-10 rounded-[13px] shadow-[0_6px_16px_-6px_rgba(0,0,0,.6)] transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.35rem] font-black uppercase tracking-tight text-ink" aria-label="Ascend">
          <SpeedA />SCEND
        </span>
        <span className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.42em] text-brand">Coaching</span>
      </span>
    </span>
  );
}
