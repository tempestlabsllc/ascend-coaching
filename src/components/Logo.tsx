// Ascend Coaching logo: a "rank-up" chevron badge plus a wordmark whose A is a
// custom peak letterform (no crossbar, with a blue summit wedge at its base).
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="markBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b2533" />
          <stop offset="1" stopColor="#0a0f17" />
        </linearGradient>
        <linearGradient id="markTop" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3a9ad9" />
          <stop offset="1" stopColor="#89cff0" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#markBg)" />
      {/* three stacked chevrons: rank up / level up */}
      <path d="M13 37 L24 29 L35 37" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 28.5 L24 20.5 L35 28.5" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 20 L24 11 L35 20" fill="none" stroke="url(#markTop)" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Stylised capital A: a sharp peak with no crossbar and a blue wedge rising inside.
function PeakA() {
  return (
    <svg viewBox="0 0 26 24" className="mr-[0.02em] inline-block h-[0.74em] w-auto -translate-y-[0.01em] align-baseline" aria-hidden>
      <path d="M0 24 L10 0 L16 0 L26 24 L19.2 24 L13 8.6 L6.8 24 Z" fill="currentColor" />
      <path d="M9.4 24 L13 15 L16.6 24 Z" fill="#3a9ad9" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="group flex items-center gap-2.5">
      <LogoMark className="h-10 w-10 rounded-[13px] shadow-[0_6px_16px_-6px_rgba(10,15,23,.6)] transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.35rem] font-black uppercase tracking-tight text-ink" aria-label="Ascend">
          <PeakA />SCEND
        </span>
        <span className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.42em] text-brand">Coaching</span>
      </span>
    </span>
  );
}
