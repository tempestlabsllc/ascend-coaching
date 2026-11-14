import type Stripe from "stripe";
import { stripe } from "@/lib";
import { site, tiers, guides } from "@/config/site";
import { sendEmail, emailLayout, esc } from "@/email";
import { isPaid } from "@/paid";
import { eliteLoginToken } from "@/elite";

// Stripe calls this after a successful checkout. We send the buyer a confirmation
// email (Elite buyers also get a link that unlocks every guide) and the coach a sale alert.
// The endpoint is registered in Stripe automatically (src/stripe-setup.ts).
// Verification: with STRIPE_WEBHOOK_SECRET set, the Stripe signature is checked. Without
// it, the event is fetched back from Stripe by id, so only real events are ever used.
export async function POST(req: Request) {
  if (!stripe) return new Response("Stripe not configured", { status: 400 });
  const body = await req.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    if (secret) {
      event = stripe.webhooks.constructEvent(body, req.headers.get("stripe-signature") ?? "", secret);
    } else {
      const id = JSON.parse(body)?.id;
      if (typeof id !== "string" || !id.startsWith("evt_")) throw new Error("bad id");
      event = await stripe.events.retrieve(id);
    }
  } catch {
    return new Response("Invalid event", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const to = s.customer_details?.email;
    if (to && isPaid(s)) {
      const name = s.customer_details?.name?.split(" ")[0];
      const hi = `<p style="margin:0 0 14px">Hey${name ? ` ${esc(name)}` : ""},</p>`;
      const btn = (href: string, label: string) =>
        `<a href="${href}" style="display:inline-block;background:#3a9ad9;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px;margin:6px 8px 6px 0">${label}</a>`;

      if (s.metadata?.kind === "tier") {
        const tier = tiers.find((t) => t.id === s.metadata?.id);
        const term = s.metadata?.term === "3month" ? " (3-month plan)" : "";
        const subId = typeof s.subscription === "string" ? s.subscription : s.subscription?.id;
        const eliteBlock =
          tier?.id === "elite" && subId
            ? `<div style="margin:20px 0;padding:18px;border-radius:12px;background:#0a0a0a;color:#fff">
<p style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;color:#89cff0;font-weight:700">ELITE PERK: ALL GUIDES FREE</p>
<p style="margin:0 0 12px;font-size:14px;color:#d1d5db">Every guide is unlocked for you while your membership is active, including new ones. Tap below on any phone or computer to unlock them there.</p>
<a href="${site.url}/api/elite-claim?token=${eliteLoginToken(subId, 30)}" style="display:inline-block;background:#3a9ad9;color:#fff;text-decoration:none;font-weight:700;padding:10px 20px;border-radius:999px">Unlock my guides</a>
<p style="margin:12px 0 0;font-size:12px;color:#9ca3af">Link expired? Enter your email on the <a href="${site.url}/shop#elite" style="color:#89cff0">Guides page</a> for a new one.</p></div>`
            : "";
        await sendEmail(
          to,
          `Welcome to ${tier?.name ?? "Ascend"} coaching${term}`,
          emailLayout(`Welcome to ${tier?.name ?? ""} coaching${term} 🎉`, `${hi}
<p style="margin:0 0 14px">Your payment went through and you're officially in. <strong>I'll personally reach out within 24 hours</strong> on Trainerize or WhatsApp to review everything with you.</p>
<p style="margin:0 0 8px"><strong>Your next step:</strong> book a quick call or fill out the questionnaire, whichever you prefer, so I can build your plan.</p>
<p style="margin:0 0 6px">${btn(`${site.url}/intake`, "Fill out questionnaire")}${btn(`${site.url}/book`, "Book a call")}</p>
${eliteBlock}
<p style="margin:14px 0 0">Within 3 days you'll get an invite to the ABC Trainerize app with your plan.</p>`),
        );
      } else if (s.metadata?.kind === "guide") {
        const g = guides.find((x) => x.id === s.metadata?.id);
        await sendEmail(
          to,
          `Your guide: ${g?.title ?? "download"}`,
          emailLayout("Your guide is ready", `${hi}
<p style="margin:0 0 14px">Thanks for grabbing <strong>${esc(g?.title ?? "your guide")}</strong>. You can download it any time here:</p>
<p>${btn(`${site.url}/api/download?guide=${encodeURIComponent(s.metadata?.id ?? "")}&session_id=${s.id}`, "Download PDF")}</p>`),
        );
      }

      // Heads-up to the coach for every sale, so nobody waits past the 24-hour promise.
      const item =
        s.metadata?.kind === "tier"
          ? `${tiers.find((t) => t.id === s.metadata?.id)?.name ?? s.metadata?.id} coaching${s.metadata?.term === "3month" ? " (3-month plan)" : " (monthly)"}`
          : guides.find((x) => x.id === s.metadata?.id)?.title ?? "Guide";
      const paid = s.amount_total != null ? `$${(s.amount_total / 100).toFixed(2)}` : "";
      await sendEmail(
        process.env.COACH_EMAIL || site.email,
        `New sale: ${item}${paid ? ` (${paid})` : ""}`,
        emailLayout("New sale 🎉", `<p style="margin:0 0 10px"><strong>${esc(item)}</strong>${paid ? ` for ${paid}` : ""}</p>
<p style="margin:0 0 6px">Name: ${esc(s.customer_details?.name ?? "not given")}</p>
<p style="margin:0 0 6px">Email: ${esc(to)}</p>
${s.metadata?.kind === "tier" ? `<p style="margin:14px 0 0"><strong>Reach out within 24 hours.</strong></p>` : ""}`),
      );
    }
  }
  return new Response("ok");
}
