// Site-wide live background. Sits behind every page: soft brand-colour glows that
// drift slowly and shift with scroll (parallax via --sy, set in LiveEffects), plus
// soft glowing particles drifting up the page. Pure CSS transforms,
// no blur filters, so it stays smooth on phones. Off for prefers-reduced-motion.
// 64 particles from a fixed seed, so server and browser render the same set.
let seed = 11;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const particles = Array.from({ length: 64 }, () => ({
  left: `${(rnd() * 98 + 1).toFixed(1)}%`,
  size: +(4 + rnd() * 7).toFixed(1),
  delay: `-${Math.round(rnd() * 36)}s`,
  dur: `${Math.round(18 + rnd() * 20)}s`,
  speed: +(0.03 + rnd() * 0.14).toFixed(2),
  drift: `${Math.round(rnd() * 90 - 45)}px`,
  deep: rnd() < 0.35,
}));

export default function PageBackground() {
  return (
    <div aria-hidden className="page-bg">
      <div className="page-glow page-glow-1" />
      <div className="page-glow page-glow-2" />
      <div className="page-glow page-glow-3" />
      {particles.map((c, i) => (
        <span key={i} className="page-chev-wrap" style={{ left: c.left, ["--k" as string]: c.speed }}>
          <i className={`page-particle${c.deep ? " deep" : ""}`} style={{ width: c.size, height: c.size, animationDelay: c.delay, animationDuration: c.dur, ["--dx" as string]: c.drift }} />
        </span>
      ))}
    </div>
  );
}
