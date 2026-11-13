// Ascend Coaching logo: a faceted ruby "top rank" emblem plus a wordmark whose A
// has a rising ruby slash instead of a flat crossbar.
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="rubyWing" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff5a6e" />
          <stop offset="1" stopColor="#8e0b22" />
        </linearGradient>
        <radialGradient id="rubyGlow" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0" stopColor="#ff3b55" stopOpacity=".55" />
          <stop offset="1" stopColor="#ff3b55" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* side wings: swept chevrons */}
      <path d="M11 17 L3 13 L6 24 L3 33 L12 29 Z" fill="url(#rubyWing)" opacity=".85" />
      <path d="M37 17 L45 13 L42 24 L45 33 L36 29 Z" fill="url(#rubyWing)" opacity=".85" />
      {/* faceted gem */}
      <g stroke="#5c0716" strokeWidth=".8" strokeLinejoin="round">
        <path d="M24 4 L36 14 L24 18 Z" fill="#ff6b7d" />
        <path d="M24 4 L12 14 L24 18 Z" fill="#e0213c" />
        <path d="M12 14 L24 18 L24 44 Z" fill="#a80d27" />
        <path d="M36 14 L24 18 L24 44 Z" fill="#d1132f" />
        <path d="M12 14 L8 24 L24 44 Z" fill="#7a0618" />
        <path d="M36 14 L40 24 L24 44 Z" fill="#b30e2a" />
      </g>
      {/* glints */}
      <path d="M24 7 L30 12 L24 14 Z" fill="#fff" opacity=".55" />
      <circle cx="33" cy="9" r="1.6" fill="#fff" />
      <path d="M33 5.5 L33.6 8.4 L36.5 9 L33.6 9.6 L33 12.5 L32.4 9.6 L29.5 9 L32.4 8.4 Z" fill="#fff" opacity=".9" />
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
      <LogoMark className="h-11 w-11 drop-shadow-[0_4px_8px_rgba(168,13,39,.35)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.35rem] font-black uppercase tracking-tight text-ink" aria-label="Ascend">
          <GemA />SCEND
        </span>
        <span className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.42em] text-brand">Coaching</span>
      </span>
    </span>
  );
}
