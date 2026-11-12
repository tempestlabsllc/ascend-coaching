// Hero background: the coach's own physique in a baby-blue duotone, fading
// into a dark navy backdrop with a moving gym-floor grid, drifting light and
// a cursor spotlight (cursor tracking via LiveEffects).

export default function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_75%_20%,#0f3352_0%,#081d31_45%,#04101c_100%)]">
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />

      {/* physique photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero-physique.jpg" alt="" className="hero-physique" />
      <div className="hero-sweep" />

      <div className="hero-floor" />
      <div className="hero-spot" />

      {/* keep the headline readable */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,16,28,.95)_0%,rgba(4,16,28,.75)_38%,rgba(4,16,28,.05)_65%,transparent_100%)]" />
    </div>
  );
}
