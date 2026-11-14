// Site-wide live background. Sits behind every page: soft brand-colour glows that
// drift slowly and shift with scroll (parallax via --sy, set in LiveEffects), plus
// soft glowing particles drifting up the page. Pure CSS transforms,
// no blur filters, so it stays smooth on phones. Off for prefers-reduced-motion.
const particles = [
  { left: "43%", size: 3.5, delay: "-12s", dur: "23s", speed: 0.04, drift: "28px" },
  { left: "14%", size: 4.0, delay: "-18s", dur: "23s", speed: 0.14, drift: "-13px" },
  { left: "6%", size: 3.0, delay: "-13s", dur: "35s", speed: 0.04, drift: "-29px" },
  { left: "72%", size: 5.0, delay: "-1s", dur: "25s", speed: 0.14, drift: "40px" },
  { left: "82%", size: 6.0, delay: "-30s", dur: "23s", speed: 0.10, drift: "10px" },
  { left: "8%", size: 3.5, delay: "-1s", dur: "26s", speed: 0.06, drift: "-22px" },
  { left: "71%", size: 3.0, delay: "-18s", dur: "31s", speed: 0.10, drift: "-17px" },
  { left: "15%", size: 6.0, delay: "-18s", dur: "28s", speed: 0.07, drift: "30px" },
  { left: "93%", size: 3.0, delay: "-18s", dur: "23s", speed: 0.10, drift: "23px" },
  { left: "89%", size: 6.0, delay: "-13s", dur: "32s", speed: 0.09, drift: "18px" },
  { left: "48%", size: 4.0, delay: "-7s", dur: "27s", speed: 0.11, drift: "-9px" },
  { left: "12%", size: 6.0, delay: "-9s", dur: "38s", speed: 0.09, drift: "3px" },
  { left: "95%", size: 5.0, delay: "-9s", dur: "24s", speed: 0.04, drift: "13px" },
  { left: "23%", size: 4.0, delay: "-4s", dur: "37s", speed: 0.08, drift: "-31px" },
  { left: "73%", size: 6.0, delay: "-25s", dur: "32s", speed: 0.07, drift: "4px" },
  { left: "78%", size: 5.0, delay: "-18s", dur: "36s", speed: 0.04, drift: "-29px" },
  { left: "36%", size: 5.0, delay: "-22s", dur: "24s", speed: 0.04, drift: "-1px" },
  { left: "84%", size: 6.0, delay: "-21s", dur: "36s", speed: 0.06, drift: "9px" },
  { left: "87%", size: 4.0, delay: "-0s", dur: "36s", speed: 0.07, drift: "38px" },
  { left: "16%", size: 5.0, delay: "-1s", dur: "28s", speed: 0.12, drift: "-24px" },
  { left: "96%", size: 3.5, delay: "-12s", dur: "34s", speed: 0.14, drift: "23px" },
  { left: "12%", size: 3.5, delay: "-14s", dur: "34s", speed: 0.10, drift: "-23px" },
];

export default function PageBackground() {
  return (
    <div aria-hidden className="page-bg">
      <div className="page-glow page-glow-1" />
      <div className="page-glow page-glow-2" />
      <div className="page-glow page-glow-3" />
      {particles.map((c, i) => (
        <span key={i} className="page-chev-wrap" style={{ left: c.left, ["--k" as string]: c.speed }}>
          <i className="page-particle" style={{ width: c.size, height: c.size, animationDelay: c.delay, animationDuration: c.dur, ["--dx" as string]: c.drift }} />
        </span>
      ))}
    </div>
  );
}
