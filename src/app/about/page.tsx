import Link from "next/link";
import { site, about } from "@/config/site";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-12 md:grid-cols-[1fr_1.3fr]">
        <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand/30 to-mist">
          {about.photo
            ? <img src={about.photo} alt="Your coach" className="h-full w-full object-cover object-[center_30%]" />
            : <span className="text-sm text-black/50">Coach photo</span>}
        </div>
        <div>
          <p className="font-semibold uppercase tracking-widest text-brand">About your coach</p>
          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{about.headline}</h1>
          <p className="mt-6 text-lg text-black/80">{about.short}</p>
          <div className="mt-6 space-y-4 text-black/70">
            {about.story.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {about.credentials.map((c) => (
              <li key={c} className="rounded-full border border-brand/40 bg-mist px-4 py-1.5 text-sm">{c}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-black/70">
            Follow along: <a href={site.instagram} target="_blank" rel="noopener" className="font-semibold text-brand-dark underline">Instagram {site.instagramHandle}</a>
            {" · "}<a href={site.tiktok} target="_blank" rel="noopener" className="font-semibold text-brand-dark underline">TikTok {site.tiktokHandle}</a>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/coaching" className="btn-primary">Choose your plan</Link>
            <Link href="/book" className="btn-outline">Book a free call</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
