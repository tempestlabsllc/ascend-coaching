// Ascend Coaching logo: a peak/upward-chevron mark plus a stacked wordmark.
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="logoBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#89cff0" />
          <stop offset="1" stopColor="#2378b5" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#logoBg)" />
      {/* mountain "A": two peaks, the taller one rising right */}
      <path d="M9 36 L20 20 L25 27 L31 15 L40 36" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {/* summit spark */}
      <circle cx="31" cy="9" r="2.4" fill="#fff" />
    </svg>
  );
}

export default function Logo() {
  return (
    <span className="group flex items-center gap-2.5">
      <LogoMark className="h-10 w-10 shadow-[0_6px_16px_-6px_rgba(35,120,181,.7)] rounded-[13px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.35rem] font-black uppercase tracking-tight text-ink">Ascend</span>
        <span className="mt-0.5 text-[0.62rem] font-bold uppercase tracking-[0.42em] text-brand">Coaching</span>
      </span>
    </span>
  );
}
