import { results } from "@/config/site";

// Before/after transformations (data in src/config/site.ts).
export default function Results() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-24">
      <div className="max-w-2xl">
        <p className="font-semibold uppercase tracking-widest text-brand">Real results</p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Proof it works</h2>
        <p className="mt-2 text-black/60">Real people, real photos. No filters, no stock images.</p>
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {results.map((r) => (
          <figure key={r.headline} className="overflow-hidden rounded-3xl border border-black/10 bg-card shadow-sm">
            <div className="grid grid-cols-2 gap-1 bg-black/5">
              {[r.before, r.after].map((p, i) => (
                <div key={p.src} className="relative aspect-[3/4] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.label} loading="lazy" className="h-full w-full object-cover object-[center_30%]" />
                  <span className={`absolute bottom-2 left-2 rounded-full px-3 py-1 text-xs font-bold ${i === 0 ? "bg-black/70 text-white" : "bg-brand text-white"}`}>{p.label}</span>
                </div>
              ))}
            </div>
            <figcaption className="p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-black/50">{r.who}</p>
              <p className="mt-1 text-2xl font-extrabold text-brand">{r.headline}</p>
              <p className="mt-2 text-black/70">{r.story}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-4 text-xs text-black/45">Individual results vary and depend on consistency, starting point and genetics.</p>
    </section>
  );
}
