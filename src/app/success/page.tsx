import Link from "next/link";
import { guides, tiers } from "@/config/site";
import { stripe } from "@/lib";

export const metadata = { title: "Thank you" };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const s = stripe && session_id ? await stripe.checkout.sessions.retrieve(session_id).catch(() => null) : null;
  const kind = s?.metadata?.kind;
  const guide = kind === "guide" ? guides.find((g) => g.id === s?.metadata?.id) : undefined;
  const tier = kind === "tier" ? tiers.find((t) => t.id === s?.metadata?.id) : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold">Thank you! 🎉</h1>
      {guide && (
        <>
          <p className="mt-4 text-white/70">Your copy of <strong>{guide.title}</strong> is ready.</p>
          <a href={`/api/download?guide=${guide.id}&session_id=${session_id}`} className="btn-primary mt-8">Download PDF</a>
          <p className="mt-4 text-sm text-white/50">Bookmark this page to download it again later.</p>
        </>
      )}
      {tier && (
        <>
          <p className="mt-4 text-white/70">Welcome to <strong>{tier.name}</strong> coaching. Next step: fill in the intake questionnaire so I can build your plan.</p>
          <Link href="/intake" className="btn-primary mt-8">Start questionnaire</Link>
        </>
      )}
      {!guide && !tier && <p className="mt-4 text-white/70">Your order is confirmed. A receipt is on its way to your inbox.</p>}
    </div>
  );
}
