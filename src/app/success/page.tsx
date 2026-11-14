import Link from "next/link";
import { guides, tiers } from "@/config/site";
import { stripe } from "@/lib";
import { isPaid } from "@/paid";
import { EliteAutoUnlock } from "@/components/EliteUnlock";

export const metadata = { title: "Thank you" };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const s = stripe && session_id ? await stripe.checkout.sessions.retrieve(session_id).catch(() => null) : null;
  const kind = s?.metadata?.kind;
  const paid = !!s && isPaid(s);
  const guide = kind === "guide" && paid ? guides.find((g) => g.id === s?.metadata?.id) : undefined;
  const tier = kind === "tier" ? tiers.find((t) => t.id === s?.metadata?.id) : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold">Thank you! 🎉</h1>
      {guide && (
        <>
          <p className="mt-4 text-black/70">Your copy of <strong>{guide.title}</strong> is ready.</p>
          <a href={`/api/download?guide=${guide.id}&session_id=${session_id}`} className="btn-primary mt-8">Download PDF</a>
          <p className="mt-4 text-sm text-black/50">Bookmark this page to download it again later.</p>
        </>
      )}
      {tier && (
        <>
          <div className="mx-auto mt-6 flex max-w-lg items-start gap-3 rounded-2xl border border-brand/30 bg-mist p-5 text-left">
            <span aria-hidden className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">✓</span>
            <p className="text-black/80"><strong className="text-ink">I&apos;ll personally reach out within 24 hours</strong> on Trainerize or WhatsApp to review everything with you: your goals, your plan and how we&apos;ll work together.</p>
          </div>
          {tier.id === "elite" && paid && session_id && <EliteAutoUnlock sessionId={session_id} />}
          <p className="mt-6 text-black/70">Welcome to <strong>{tier.name}</strong> coaching. Next step: book a quick call or fill in the questionnaire, whichever you prefer, so I can build your plan.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/intake" className="btn-primary">Fill out questionnaire</Link><Link href="/book" className="btn-outline">Book a call</Link></div>
          <ol className="mx-auto mt-12 max-w-md space-y-4 text-left">
            {[
              ["Today", "Book a call or fill in the questionnaire (about 5 minutes)."],
              ["Within 24 hours", "I reach out to you personally to review everything: your goals, your plan and next steps."],
              ["Within 3 days", "You get an invite to the ABC Trainerize app with your training plan and nutrition targets."],
              ["Ongoing", "We work 1:1 on Trainerize or WhatsApp, and I adjust your plan at every check-in."],
            ].map(([when, what], i) => (
              <li key={when} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
                <span><strong className="block">{when}</strong><span className="text-black/60">{what}</span></span>
              </li>
            ))}
          </ol>
        </>
      )}
      {!guide && !tier && <p className="mt-4 text-black/70">Your order is confirmed. A receipt is on its way to your inbox.</p>}
    </div>
  );
}
