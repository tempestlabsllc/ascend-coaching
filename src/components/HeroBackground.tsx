// Hero background: a soft baby-blue sky with drifting light, a faint dot grid,
// and layered mountain ridges rising toward a glowing peak (the "ascent").
// Pure CSS/SVG, no JS.

export default function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f3faff_38%,#dcf0fc_100%)]">
      {/* drifting colour light */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      {/* sun glow behind the peak / plan card */}
      <div className="hero-sun" />

      {/* faint dot grid, fading out toward the edges */}
      <div className="hero-dots" />

      {/* light rays from the peak */}
      <div className="hero-rays" />

      {/* layered ridges */}
      <svg viewBox="0 0 1440 360" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[50%] w-full">
        <defs>
          <linearGradient id="ridge1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a8d9f5" />
            <stop offset="1" stopColor="#e3f3fd" />
          </linearGradient>
          <linearGradient id="ridge2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6fbde9" stopOpacity="0.8" />
            <stop offset="1" stopColor="#d4ecfb" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="ridge3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a9ad9" stopOpacity="0.6" />
            <stop offset="1" stopColor="#cfe9fa" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* far range, highest peak on the right */}
        <path className="ridge ridge-far" fill="url(#ridge1)" d="M0 260 L120 215 L210 240 L330 185 L430 220 L560 170 L660 205 L790 30 L880 120 L960 95 L1060 150 L1150 110 L1250 160 L1340 120 L1440 170 L1440 360 L0 360 Z" />
        <path fill="url(#snow)" opacity="0.8" d="M790 30 L752 78 L772 70 L790 88 L808 68 L830 80 Z" />
        {/* middle range */}
        <path className="ridge ridge-mid" fill="url(#ridge2)" d="M0 290 L90 250 L200 275 L320 215 L450 260 L590 205 L720 250 L860 190 L980 240 L1100 175 L1220 230 L1340 195 L1440 225 L1440 360 L0 360 Z" />
        {/* near range */}
        <path className="ridge ridge-near" fill="url(#ridge3)" d="M0 330 L140 290 L260 315 L400 270 L540 310 L700 280 L840 320 L990 275 L1130 310 L1280 280 L1440 300 L1440 360 L0 360 Z" />
      </svg>

      {/* keep the text side crisp, then blend into the page below */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_28%_45%,rgba(255,255,255,.75)_0%,rgba(255,255,255,.35)_45%,transparent_75%)]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-paper" />
    </div>
  );
}
