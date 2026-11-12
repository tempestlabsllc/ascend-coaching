import Link from "next/link";
import Results from "@/components/Results";
import { testimonials } from "@/config/site";

export const metadata = { title: "Client results" };

// To add a new client: put their photos in /public/results and add an entry to
// `results` (and optionally `testimonials`) in src/config/site.ts.
export default function ResultsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <p className="font-semibold uppercase tracking-widest text-brand">Real results</p>
        <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Client results</h1>
        <p className="mt-3 max-w-2xl text-lg text-black/60">Real people, real photos, no filters or stock images.</p>
      </div>
      <div className="mt-10"><Results heading={false} /></div>

      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-20">
          <h2 className="text-3xl font-extrabold">What clients say</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl border border-black/10 bg-card p-6">
                <p className="text-sm font-bold text-brand">{t.result}</p>
                <blockquote className="mt-3 text-black/80">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm text-black/50">{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="rounded-3xl bg-brand px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-black uppercase sm:text-4xl">You could be next</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">Pick your plan and start your own transformation today.</p>
          <Link href="/coaching" className="btn mt-8 bg-black text-white hover:bg-black/80">Choose your plan</Link>
        </div>
      </section>
    </div>
  );
}
