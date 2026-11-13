// Ascend Coaching logo: a black "rank up" badge with ruby chevrons, plus a
// wordmark whose A is a crossbar-free peak crowned with a small ruby gem.
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="markBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a1a1a" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <linearGradient id="markTop" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#d1132f" />
          <stop offset="1" stopColor="#ff5a6e" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#markBg)" />
      {/* three stacked chevrons: rank up / level up */}
      <path d="M13 37 L24 29 L35 37" fill="none" stroke="#7a0618" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 28.5 L24 20.5 L35 28.5" fill="none" stroke="#b30e2a" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 20 L24 11 L35 20" fill="none" stroke="url(#markTop)" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Stylised capital A: a crossbar-free peak crowned with a small ruby gem.
function GemA() {
  return (
    <svg viewBox="0 0 26 26" className="mr-[0.03em] inline-block h-[1.0em] w-auto align-baseline" aria-hidden>
      <path d="M0 26 L10.2 7.5 L15.8 7.5 L26 26 L19.4 26 L13 13.6 L6.6 26 Z" fill="currentColor" />
      <path d="M13 0 L16.4 3.2 L13 6.6 L9.6 3.2 Z" fill="#d1132f" />
      <path d="M13 0 L16.4 3.2 L13 3.2 Z" fill="#ff6b7d" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="group flex items-center gap-2.5">
      <LogoMark className="h-10 w-10 rounded-[13px] shadow-[0_6px_16px_-6px_rgba(0,0,0,.6)] transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.35rem] font-black uppercase tracking-tight text-ink" aria-label="Ascend">
          <GemA />SCEND
        </span>
        <span className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.42em] text-brand">Coaching</span>
      </span>
    </span>
  );
}
