// Site-wide live background. Sits behind every page: soft brand-colour glows that
// drift slowly and shift with scroll (parallax via --sy, set in LiveEffects), plus
// a few faint chevrons rising up the page, echoing the logo. Pure CSS transforms,
// no blur filters, so it stays smooth on phones. Off for prefers-reduced-motion.
const chevrons = [
  { left: "6%", size: 22, delay: "0s", dur: "26s", speed: 0.05 },
  { left: "18%", size: 14, delay: "-9s", dur: "32s", speed: 0.12 },
  { left: "33%", size: 18, delay: "-17s", dur: "29s", speed: 0.08 },
  { left: "52%", size: 12, delay: "-4s", dur: "35s", speed: 0.14 },
  { left: "67%", size: 20, delay: "-21s", dur: "27s", speed: 0.06 },
  { left: "81%", size: 15, delay: "-12s", dur: "31s", speed: 0.1 },
  { left: "93%", size: 24, delay: "-6s", dur: "24s", speed: 0.04 },
];

export default function PageBackground() {
  return (
    <div aria-hidden className="page-bg">
      <div className="page-glow page-glow-1" />
      <div className="page-glow page-glow-2" />
      <div className="page-glow page-glow-3" />
      {chevrons.map((c, i) => (
        <span key={i} className="page-chev-wrap" style={{ left: c.left, ["--k" as string]: c.speed }}>
          <svg className="page-chev" width={c.size} height={c.size} viewBox="0 0 24 24" style={{ animationDelay: c.delay, animationDuration: c.dur }}>
            <path d="M4 15l8-7 8 7" fill="none" stroke="#3a9ad9" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ))}
    </div>
  );
}
