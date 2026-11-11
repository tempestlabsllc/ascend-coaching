import Link from "next/link";
import { site, about, testimonials, faqs } from "@/config/site";
import TierCards from "@/components/TierCards";

const steps = [
  { n: "01", t: "Book a free call", d: "A quick chat about your goals to see if we're a good fit." },
  { n: "02", t: "Fill in the questionnaire", d: "Tell me your stats, goals, schedule, training and eating habits." },
  { n: "03", t: "Get your plan", d: "Training and nutrition built for you, delivered within days." },
  { n: "04", t: "Check in and climb", d: "Regular check-ins keep you accountable while your plan evolves." },
];

const features = [
  { icon: "🏋️", t: "Custom training", d: "Programs built around your goals, equipment and schedule. Gym, home or bodyweight." },
  { icon: "🥗", t: "Nutrition that fits", d: "Calorie and macro targets or full meal plans, built around foods you actually like." },
  { icon: "📱", t: "Real accountability", d: "Check-ins, form reviews and direct messaging so you never feel on your own." },
  { icon: "📈", t: "Progress tracking", d: "We track weight, measurements and lifts, then adjust your plan as you improve." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand/20 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 text-center sm:pt-32 sm:pb-32">
          <p className="font-semibold uppercase tracking-[0.3em] text-brand">{site.name}</p>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            Start your <span className="text-brand">ascension</span> today
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-white/70">
            Personalised online coaching from {site.coachName}. Training, nutrition and accountability built around your life, wherever you train.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/book" className="btn-primary">Book a free call</Link>
            <Link href="/coaching" className="btn-outline">See coaching plans</Link>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-y border-white/10 bg-card py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-extrabold sm:text-4xl">Everything you need to <span className="text-brand">level up</span></h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.t} className="rounded-2xl border border-white/10 bg-paper p-6">
                <div className="text-3xl">{f.icon}</div>
                <h3 className="mt-4 text-lg font-bold">{f.t}</h3>
                <p className="mt-2 text-sm text-white/60">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-extrabold sm:text-4xl">How it works</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="border-t-2 border-brand pt-4">
              <div className="text-sm font-bold text-brand">{s.n}</div>
              <h3 className="mt-2 text-xl font-bold">{s.t}</h3>
              <p className="mt-1 text-white/60">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About preview */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid items-center gap-10 rounded-3xl border border-white/10 bg-card p-8 md:grid-cols-[1fr_1.4fr] md:p-12">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand/30 to-mist">
            {about.photo
              ? <img src={about.photo} alt={site.coachName} className="h-full w-full object-cover" />
              : <span className="text-sm text-white/50">Coach photo</span>}
          </div>
          <div>
            <p className="font-semibold uppercase tracking-widest text-brand">Your coach</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{about.headline}</h2>
            <p className="mt-4 text-lg text-white/70">{about.short}</p>
            <Link href="/about" className="btn-outline mt-8">More about me</Link>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Coaching plans</h2>
        <p className="mt-2 mb-10 text-white/60">Cancel anytime. Not sure which fits? <Link href="/book" className="text-brand underline">Book a call</Link>.</p>
        <TierCards />
      </section>

      {/* Testimonials (only shown once real ones are added) */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-24">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Client results</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-white/10 bg-card p-6">
                <p className="text-sm font-bold text-brand">{t.result}</p>
                <blockquote className="mt-3 text-white/80">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-white/50">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Guides */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-mist p-8 sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Not ready for coaching yet?</h2>
            <p className="mt-2 text-white/70">Start on your own with a digital starter guide, including a free one.</p>
          </div>
          <Link href="/shop" className="btn-primary">Browse guides</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pt-24">
        <h2 className="text-center text-3xl font-extrabold sm:text-4xl">Questions</h2>
        <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {f.q}<span className="text-2xl text-brand transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-white/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div className="rounded-3xl bg-brand px-8 py-16 text-center text-black">
          <h2 className="text-4xl font-black uppercase sm:text-5xl">Ready to climb?</h2>
          <p className="mx-auto mt-4 max-w-xl text-black/70">Book a free call and let's map out your first steps together.</p>
          <Link href="/book" className="btn mt-8 bg-black text-white hover:bg-black/80">Book a free call</Link>
        </div>
      </section>
    </>
  );
}
