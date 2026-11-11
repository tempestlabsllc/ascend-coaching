// "Everything you need to level up" section: icon cards with hover lift and ruby accents.

const icons = {
  training: (
    <path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" />
  ),
  nutrition: (
    <>
      <path d="M12 21c-4.5 0-8-3.5-8-8 0-3 2-5.5 4.5-5.5 1.3 0 2.4.6 3.5 1.4 1.1-.8 2.2-1.4 3.5-1.4 2.5 0 4.5 2.5 4.5 5.5 0 4.5-3.5 8-8 8z" />
      <path d="M12 8.9C12 6 13.5 3.8 16 3" />
    </>
  ),
  accountability: (
    <>
      <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.2A8.5 8.5 0 1 1 21 12z" />
      <path d="M8.5 12.5l2.3 2.3 4.7-4.8" />
    </>
  ),
  progress: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
};

const features: { key: keyof typeof icons; title: string; text: string; points: string[] }[] = [
  {
    key: "training",
    title: "Custom training",
    text: "Programs built around your goals, equipment and schedule.",
    points: ["Gym, home or bodyweight", "Clear sets, reps and progressions"],
  },
  {
    key: "nutrition",
    title: "Nutrition that fits",
    text: "Targets or full meal plans built around foods you actually like.",
    points: ["Calorie and macro targets", "No foods you hate"],
  },
  {
    key: "accountability",
    title: "Real accountability",
    text: "A real coach checking in, so you never feel on your own.",
    points: ["Regular check-ins", "Form reviews and messaging"],
  },
  {
    key: "progress",
    title: "Progress tracking",
    text: "Log workouts and progress in the ABC Trainerize app, and your plan is adjusted as you improve.",
    points: ["Workouts, weight and lifts tracked", "Plan updates every 4 weeks"],
  },
];

export default function FeatureGrid() {
  return (
    <section className="relative overflow-hidden py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-mist/70 via-white to-white" />
      <div aria-hidden className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-brand">What you get</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Everything you need to <span className="text-brand">level up</span>
          </h2>
          <p className="mt-4 text-lg text-black/60">Four things every client gets, whichever plan you choose.</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.key}
              className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-brand/40 hover:shadow-[0_20px_50px_-20px_rgba(58,154,217,0.45)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand to-[#89cff0] transition-transform duration-500 group-hover:scale-x-100" />
              <span className="absolute right-6 top-5 text-5xl font-black text-black/[0.05] transition-colors duration-300 group-hover:text-brand/15">
                0{i + 1}
              </span>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-[#89cff0] text-white shadow-[0_10px_25px_-8px_rgba(58,154,217,0.6)] transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-110">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  {icons[f.key]}
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-extrabold">{f.title}</h3>
              <p className="mt-2 text-black/60">{f.text}</p>
              <ul className="mt-5 space-y-2 border-t border-black/10 pt-4 text-sm">
                {f.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-black/75">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
