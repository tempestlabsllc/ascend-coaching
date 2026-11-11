import Link from "next/link";
import TierCards from "@/components/TierCards";
import { faqs } from "@/config/site";

export const metadata = { title: "Coaching plans" };

export default function CoachingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-extrabold">Coaching plans</h1>
      <p className="mt-2 mb-10 max-w-2xl text-black/60">Every plan is run by me personally, with 9 years of personal training experience behind it. No AI, no generic app. Pick the level of support you want; after checkout you'll fill in a short questionnaire so I can get started.</p>
      <TierCards />
      <div className="mt-20 grid gap-10 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-2xl font-extrabold">Questions</h2>
          <p className="mt-2 text-black/60">Still unsure? <Link href="/book" className="text-brand underline">Book a free call</Link>.</p>
        </div>
        <dl className="space-y-6">
          {faqs.map((f) => (
            <div key={f.q}><dt className="font-bold">{f.q}</dt><dd className="mt-1 text-black/70">{f.a}</dd></div>
          ))}
        </dl>
      </div>
    </div>
  );
}
