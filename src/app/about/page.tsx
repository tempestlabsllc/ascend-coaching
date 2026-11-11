import Link from "next/link";
import { site, about } from "@/config/site";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-12 md:grid-cols-[1fr_1.3fr]">
        <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand/30 to-mist">
          {about.photo
            ? <img src={about.photo} alt={site.coachName} className="h-full w-full object-cover" />
            : <span className="text-sm text-white/50">Coach photo</span>}
        </div>
        <div>
          <p className="font-semibold uppercase tracking-widest text-brand">About your coach</p>
          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{about.headline}</h1>
          <p className="mt-6 text-lg text-white/80">{about.short}</p>
          <div className="mt-6 space-y-4 text-white/70">
            {about.story.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {about.credentials.map((c) => (
              <li key={c} className="rounded-full border border-brand/40 bg-mist px-4 py-1.5 text-sm">{c}</li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/book" className="btn-primary">Book a free call</Link>
            <Link href="/coaching" className="btn-outline">See plans</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
