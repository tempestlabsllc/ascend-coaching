import Link from "next/link";
import { after } from "next/server";
import { handleCompletedCheckout } from "@/purchase-emails";
import { ensureWebhook } from "@/stripe-setup";
import { guides, tiers } from "@/config/site";
import { stripe } from "@/lib";
import { isPaid } from "@/paid";
import { EliteAutoUnlock } from "@/components/EliteUnlock";
import { manageUrl, CANCEL_NOTE } from "@/manage-link";

export const metadata = { title: "Thank you" };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const s = stripe && session_id ? await stripe.checkout.sessions.retrieve(session_id).catch(() => null) : null;
  const kind = s?.metadata?.kind;
  const paid = !!s && isPaid(s);
  // Backup for the Stripe webhook: send the purchase emails from here too (only once per checkout).
  if (s && paid) after(async () => { await ensureWebhook(); await handleCompletedCheckout(s); });
  const guide = kind === "guide" && paid ? guides.find((g) => g.id === s?.metadata?.id) : undefined;
  const tier = kind === "tier" ? tiers.find((t) => t.id === s?.metadata?.id) : undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold">Thank You! 🎉</h1>
      {guide && (
        <>
          <p className="mt-4 text-black/70">Your copy of <strong>{guide.title}</strong> is ready.</p>
          <a href={`/api/download?guide=${guide.id}&session_id=${session_id}`} className="btn-primary mt-8">Download PDF</a>
          <p className="mt-4 text-sm text-black/60">A copy has also been sent to {s?.customer_details?.email ? <strong>{s.customer_details.email}</strong> : "your email"}, so you can download it again any time.</p>
          <div className="mx-auto mt-8 max-w-lg rounded-2xl bg-ink p-5 text-left text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-[#89cff0]">Want Every Guide?</p>
            <p className="mt-1 text-white/80">Elite members get <strong className="text-white">all guides free</strong>, including every new one, plus weekly progress reviews.</p>
            <Link href="/coaching" className="mt-3 inline-block text-sm font-bold text-[#89cff0] underline">See the Elite Plan</Link>
          </div>
        </>
      )}
      {tier && (
        <>
          <div className="mx-auto mt-6 flex max-w-lg items-start gap-3 rounded-2xl border border-brand/30 bg-mist p-5 text-left">
            <span aria-hidden className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-white">✓</span>
            <div>
              <p className="text-black/80"><strong className="text-ink">Download WhatsApp, I&apos;ll message you there within 24 hours.</strong> That&apos;s where I&apos;ll reach out personally to review everything with you: your goals, your plan and how we&apos;ll work together.</p>
              <a href="https://www.whatsapp.com/download" target="_blank" rel="noopener" className="mt-3 inline-block rounded-full bg-[#25D366] px-5 py-2 text-sm font-bold text-white hover:opacity-90">Download WhatsApp</a>
            </div>
          </div>
          {tier.id === "elite" && paid && session_id && <EliteAutoUnlock sessionId={session_id} />}
          <p className="mt-6 text-black/70">Welcome to <strong>{tier.name}</strong> coaching. Next step: book a quick call or fill in the questionnaire, whichever you prefer, so I can build your plan.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/intake" className="btn-primary">Fill Out Questionnaire</Link><Link href="/book" className="btn-outline">Book a Call</Link></div>
          <ol className="mx-auto mt-12 max-w-md space-y-4 text-left">
            {[
              ["Today", "Download WhatsApp, then book a call or fill in the questionnaire (about 5 minutes)."],
              ["Within 24 hours", "I message you on WhatsApp to review everything: your goals, your plan and next steps."],
              ...(tier.messagingOnly
                ? [["Ongoing", "Message me anytime on Trainerize or WhatsApp and I reply within 24 hours, with advice on training, nutrition, supplements, form or mindset."]]
                : [
                    ["Within 3 days", "You get an invite to the ABC Trainerize app with your training plan and nutrition targets."],
                    ["Ongoing", "We work 1:1 on Trainerize or WhatsApp, and I adjust your plan at every check-in."],
                  ]),
            ].map(([when, what], i) => (
              <li key={when} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
                <span><strong className="block">{when}</strong><span className="text-black/60">{what}</span></span>
              </li>
            ))}
          </ol>
          {paid && (
            <p className="mx-auto mt-10 max-w-md text-sm text-black/55">
              Want to switch or cancel later? Use <a className="font-semibold text-brand-dark underline" href={manageUrl(s?.customer)}>Change or Cancel Plan</a> (the link is in your email too). {CANCEL_NOTE}
            </p>
          )}
        </>
      )}
      {!guide && !tier && <p className="mt-4 text-black/70">Your order is confirmed. A receipt is on its way to your inbox.</p>}
    </div>
  );
}
