import Link from "next/link";
import { results } from "@/config/site";
import BeforeAfter from "./BeforeAfter";

// Before/after transformations (data in src/config/site.ts).
// limit: show only the newest few (home page preview). Omit to show all (Results page).
export default function Results({ limit, heading = true }: { limit?: number; heading?: boolean }) {
  const list = limit ? results.slice(0, limit) : results;
  return (
    <section className={`mx-auto max-w-6xl px-4 ${heading ? "pt-24" : ""}`}>
      {heading && <div className="max-w-2xl">
        <p className="font-semibold uppercase tracking-widest text-brand">Real results</p>
        <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Proof it works</h2>
        <p className="mt-2 text-black/60">Real people, real photos. No filters, no stock images. Drag the slider to compare.</p>
      </div>}
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {list.map((r) => (
          <figure key={r.headline} data-reveal className="lift overflow-hidden rounded-3xl border border-black/10 bg-card shadow-sm">
            <BeforeAfter before={r.before} after={r.after} />
            <figcaption className="p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-black/50">{r.who}</p>
              <p className="mt-1 text-2xl font-extrabold text-brand">{r.headline}</p>
              <p className="mt-2 text-black/70">{r.story}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-4 text-xs text-black/45">Individual results vary and depend on consistency, starting point and genetics.</p>
      {limit && <Link href="/results" className="btn-outline mt-6">See all results</Link>}
    </section>
  );
}
