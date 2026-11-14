import type Stripe from "stripe";
import { stripe } from "@/lib";
import { site, tiers, guides } from "@/config/site";
import { sendEmail, emailLayout, esc } from "@/email";
import { logActivity } from "@/activity";
import { formatPrice } from "@/config/site";

// Stripe calls this after a successful checkout. We send the buyer a confirmation
// email (Elite buyers also get their code to unlock every guide for free).
// Needs STRIPE_WEBHOOK_SECRET (from the Stripe webhook endpoint) and the Resend env vars.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!stripe || !secret || !sig) return new Response("Webhook not configured", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await req.text(), sig, secret);
  } catch {
    return new Response("Bad signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const to = s.customer_details?.email;
    if (s.payment_status === "paid") {
      const m = s.metadata ?? {};
      const item = m.kind === "tier"
        ? `${tiers.find((t) => t.id === m.id)?.name ?? "Coaching"} coaching${m.term === "3month" ? " (3-month)" : ""}`
        : (guides.find((g) => g.id === m.id)?.title ?? "Guide");
      const who = s.customer_details?.name || to || "Someone";
      await logActivity("purchase", `New purchase: ${item} (${formatPrice(s.amount_total ?? 0)})`, `${who}${to && who !== to ? ` · ${to}` : ""} just bought ${item}.`, { key: event.id });
    }
    if (to && s.payment_status === "paid") {
      const name = s.customer_details?.name?.split(" ")[0];
      const hi = `<p style="margin:0 0 14px">Hey${name ? ` ${esc(name)}` : ""},</p>`;
      const btn = (href: string, label: string) =>
        `<a href="${href}" style="display:inline-block;background:#3a9ad9;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px;margin:6px 8px 6px 0">${label}</a>`;

      if (s.metadata?.kind === "tier") {
        const tier = tiers.find((t) => t.id === s.metadata?.id);
        const term = s.metadata?.term === "3month" ? " (3-month plan)" : "";
        const code = process.env.ELITE_GUIDE_CODE;
        const eliteBlock =
          tier?.id === "elite" && code
            ? `<div style="margin:20px 0;padding:18px;border-radius:12px;background:#0a0a0a;color:#fff">
<p style="margin:0 0 6px;font-size:13px;letter-spacing:.12em;color:#89cff0;font-weight:700">YOUR ELITE GUIDE CODE</p>
<p style="margin:0 0 10px;font-size:26px;font-weight:900;letter-spacing:.06em">${esc(code)}</p>
<p style="margin:0;font-size:14px;color:#d1d5db">Use this code to unlock all guides for free, including every future guide. Enter it on the <a href="${site.url}/shop#elite" style="color:#89cff0">Guides page</a>.</p></div>`
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
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const c = typeof sub.customer === "string" ? await stripe.customers.retrieve(sub.customer).catch(() => null) : sub.customer;
    const email = c && !("deleted" in c && c.deleted) ? (c as Stripe.Customer).email : "";
    const plan = tiers.find((t) => t.id === sub.metadata?.tier)?.name ?? "Coaching";
    await logActivity("cancel", `Plan ended: ${plan}`, `${email || "A client"}'s ${plan} plan has ended.`, { link: "/admin?tab=churn", key: event.id });
  }

  if (event.type === "invoice.payment_failed") {
    const inv = event.data.object as Stripe.Invoice;
    await logActivity("payment-failed", `Payment failed: ${formatPrice(inv.amount_due)}`,
      `${inv.customer_email || "A client"}'s payment didn't go through. Stripe will retry it.`, { link: "/admin?tab=churn", key: event.id });
  }

  return new Response("ok");
}
