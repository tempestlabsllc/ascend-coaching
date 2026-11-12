import Link from "next/link";
import { site, about, testimonials, faqs } from "@/config/site";
import TierCards from "@/components/TierCards";
import HeroBackground from "@/components/HeroBackground";
import FeatureGrid from "@/components/FeatureGrid";
import Results from "@/components/Results";
import CountUp from "@/components/CountUp";

const steps = [
  { n: "01", t: "Pick your offer", d: "Choose the coaching plan that fits you and check out in a minute. I'll reach out within 24 hours to review everything." },
  { n: "02", t: "Book a call or fill out the questionnaire", d: "Hop on a quick call, or share your goals, stats and schedule in the questionnaire. Your choice." },
  { n: "03", t: "Get your plan in Trainerize", d: "Your training and nutrition plan lands in the ABC Trainerize app within days, where you log every workout." },
  { n: "04", t: "1:1 on Trainerize or WhatsApp", d: "Your coach works with you directly on Trainerize or WhatsApp, whichever you prefer, while your plan evolves." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section data-spot className="relative flex min-h-[92vh] items-center overflow-hidden bg-[#061523]">
        <HeroBackground />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-semibold text-[#bfe9ff] shadow-sm backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#89cff0] opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#89cff0]" />
              </span>
              {site.name} · 1:1 online coaching
            </span>
            <h1 className="mt-7 text-5xl font-black uppercase leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]">
              Start your <span className="text-shimmer">ascension</span> today
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-lg text-white/75 lg:mx-0">
              1:1 online coaching from a real person with {site.yearsExperience} years of training experience. Training, nutrition and accountability built around your life, wherever you train.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href="/coaching" className="btn-primary group shadow-[0_14px_34px_-10px_rgba(58,154,217,0.75)]">
                Choose your plan
                <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
              <Link href="/shop" className="btn border-2 border-white/60 bg-white/5 text-white backdrop-blur hover:bg-white hover:text-ink">Free starter guide</Link>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/70 lg:justify-start">
              {["A real person, not an app", `${site.yearsExperience} years experience`, "Training + nutrition"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#89cff0]/20 text-xs font-bold text-[#bfe9ff]">✓</span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/55">Have questions first? <Link href="/book" className="font-semibold text-[#89cff0] underline">Book a free call</Link></p>
          </div>

          {/* Plan preview card (illustrative) */}
          <div aria-hidden className="relative mx-auto hidden w-full max-w-sm origin-bottom-right lg:block lg:translate-x-20 lg:translate-y-44 lg:scale-[.78]">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-[#89cff0]/40 to-brand/20 blur-2xl" />
            <div className="hero-float relative rounded-3xl border border-white/80 bg-white p-6 shadow-[0_30px_80px_-30px_rgba(35,120,181,0.55)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand">Your plan</p>
                  <p className="mt-1 text-lg font-extrabold">Week 4 · Building</p>
                </div>
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand-dark">On track</span>
              </div>
              <div className="mt-5 flex h-28 items-end gap-2">
                {[38, 46, 42, 58, 64, 61, 78, 92].map((h, i) => (
                  <div key={i} className="hero-bar flex-1 rounded-t-md bg-gradient-to-t from-brand to-[#89cff0]" style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }} />
                ))}
              </div>
              <ul className="mt-5 space-y-2.5 text-sm">
                {[["Training", "Upper body · 6 exercises"], ["Nutrition", "Protein target hit"], ["Check-in", "Sent to your coach"]].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between rounded-xl bg-card px-3 py-2.5">
                    <span><span className="font-bold">{k}</span> <span className="text-black/55">· {v}</span></span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">✓</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hero-float-2 absolute -left-10 -bottom-6 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
              <p className="text-xs text-black/50">Message from your coach</p>
              <p className="text-sm font-bold">&ldquo;Great week. Adding weight Monday.&rdquo;</p>
            </div>
            <div className="chip-float absolute -right-8 -top-8 rounded-2xl bg-[#89cff0] px-4 py-2.5 text-ink shadow-xl" style={{ animationDelay: "-1s" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink/60">Squat</p>
              <p className="text-lg font-black leading-none">+40 lbs</p>
            </div>
            <div className="chip-float absolute -right-10 bottom-16 rounded-2xl border border-white/20 bg-[#0a2238]/90 px-4 py-2.5 text-white shadow-xl backdrop-blur" style={{ animationDelay: "-3s" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/55">Body fat</p>
              <p className="text-lg font-black leading-none text-[#89cff0]">−8%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live marquee */}
      <div className="overflow-hidden border-y border-black/5 bg-ink py-4 text-white">
        <div className="marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-10 pr-10 text-lg font-black uppercase tracking-widest">
              {["Build muscle", "Lose fat", "Body recomposition", "Hit new PRs", "Custom meal plans", "1:1 coaching", "Weekly check-ins", "Get shredded"].map((t) => (
                <span key={t} className="flex items-center gap-10">{t}<span className="text-[#89cff0]">✦</span></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Animated stats */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div data-reveal className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { to: site.yearsExperience, suffix: "", label: "years of training" },
            { to: 33, suffix: " lbs", label: "my own cut (180 → 147)" },
            { to: 10, suffix: "k", label: "followers on Instagram" },
            { to: 30, suffix: "k", label: "followers on TikTok" },
          ].map((s) => (
            <div key={s.label} className="lift rounded-2xl border border-black/10 bg-card p-6 text-center">
              <p className="text-4xl font-black text-brand sm:text-5xl"><CountUp to={s.to} suffix={s.suffix} /></p>
              <p className="mt-1 text-sm text-black/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real coach, not an app */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div data-reveal className="grid items-center gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-semibold uppercase tracking-widest text-brand">Real coaching</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">Not an app.<br />Not AI.<br /><span className="text-brand">A real person.</span></h2>
          </div>
          <div>
            <p className="text-xl text-black/85">This isn&apos;t an AI program or an app that doesn&apos;t know who you are. It&apos;s a real person working with you directly, 1:1, with {site.yearsExperience} years of training experience behind every plan, check-in and adjustment.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              <li className="lift rounded-xl border border-black/10 bg-card p-4"><span className="block text-3xl font-black text-brand">{site.yearsExperience}</span><span className="text-sm text-black/60">years of training experience</span></li>
              <li className="lift rounded-xl border border-black/10 bg-card p-4"><span className="block text-3xl font-black text-brand">1:1</span><span className="text-sm text-black/60">you work with your coach directly</span></li>
              <li className="lift rounded-xl border border-black/10 bg-card p-4"><span className="block text-3xl font-black text-brand">100%</span><span className="text-sm text-black/60">of check-ins answered personally</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* What you get */}
      <FeatureGrid />

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-3xl font-extrabold sm:text-4xl">How it works</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.n} data-reveal style={{ transitionDelay: `${i * 0.1}s` }} className="group border-t-2 border-brand pt-4">
              <div className="text-4xl font-black text-brand/25 transition group-hover:text-brand">{s.n}</div>
              <h3 className="mt-2 text-xl font-bold">{s.t}</h3>
              <p className="mt-1 text-black/60">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About preview */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div data-reveal className="grid items-center gap-10 rounded-3xl border border-black/10 bg-card p-8 md:grid-cols-[1fr_1.4fr] md:p-12">
          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand/30 to-mist">
            {about.photo
              ? <img src={about.photo} alt="Your coach" className="h-full w-full object-cover object-[center_30%] transition duration-700 hover:scale-105" />
              : <span className="text-sm text-black/50">Coach photo</span>}
          </div>
          <div>
            <p className="font-semibold uppercase tracking-widest text-brand">Your coach</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">{about.headline}</h2>
            <p className="mt-4 text-lg text-black/70">{about.short}</p>
            <Link href="/about" className="btn-outline mt-8">More about me</Link>
          </div>
        </div>
      </section>

      <Results limit={2} />

      {/* Plans */}
      <section className="mx-auto max-w-6xl px-4 pt-20">
        <h2 data-reveal className="text-3xl font-extrabold sm:text-4xl">Coaching plans</h2>
        <p className="mt-2 mb-10 text-black/60">Cancel anytime. Questions? <Link href="/book" className="text-brand underline">Book a free call</Link>.</p>
        <TierCards />
      </section>

      {/* Testimonials (only shown once real ones are added) */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-24">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Client results</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-black/10 bg-card p-6">
                <p className="text-sm font-bold text-brand">{t.result}</p>
                <blockquote className="mt-3 text-black/80">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-black/50">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Guides */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div data-reveal className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-mist p-8 sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Not ready for coaching yet?</h2>
            <p className="mt-2 text-black/70">Start on your own with a digital starter guide, including a free one.</p>
          </div>
          <Link href="/shop" className="btn-primary">Browse guides</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pt-24">
        <h2 className="text-center text-3xl font-extrabold sm:text-4xl">Questions</h2>
        <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {f.q}<span className="text-2xl text-brand transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-black/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto mt-24 max-w-6xl px-4">
        <div data-reveal data-spot className="relative overflow-hidden rounded-3xl bg-[#061523] px-8 py-16 text-center text-white">
          <div aria-hidden className="hero-spot" />
          <div aria-hidden className="hero-floor opacity-60" />
          <div className="relative">
          <h2 className="text-4xl font-black uppercase sm:text-5xl">Ready to climb?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">Pick your plan today and get your custom program within days.</p>
          <Link href="/coaching" className="btn-primary mt-8 shadow-[0_14px_34px_-10px_rgba(58,154,217,0.9)]">Choose your plan</Link>
          </div>
        </div>
      </section>
    </>
  );
}
