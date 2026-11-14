import type Stripe from "stripe";
import { stripe } from "@/lib";
import { site, tiers, guides } from "@/config/site";
import { handleCompletedCheckout, handleInvoicePaid } from "@/purchase-emails";
import { logActivity } from "@/activity";
import { formatPrice } from "@/config/site";

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
    let verified: Stripe.Event | null = null;
    if (secret) {
      try { verified = stripe.webhooks.constructEvent(body, req.headers.get("stripe-signature") ?? "", secret); } catch {}
    }
    if (!verified) {
      // No secret, or a secret from another endpoint/mode: fetch the event back from Stripe instead.
      const id = JSON.parse(body)?.id;
      if (typeof id !== "string" || !id.startsWith("evt_")) throw new Error("bad id");
      verified = await stripe.events.retrieve(id);
    }
    event = verified;
  } catch {
    return new Response("Invalid event", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await handleCompletedCheckout(event.data.object as Stripe.Checkout.Session);
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const c = typeof sub.customer === "string" ? await stripe.customers.retrieve(sub.customer).catch(() => null) : sub.customer;
    const email = c && !("deleted" in c && c.deleted) ? (c as Stripe.Customer).email : "";
    const plan = tiers.find((t) => t.id === sub.metadata?.tier)?.name ?? "Coaching";
    await logActivity("cancel", `Plan ended: ${plan}`, `${email || "A client"}'s ${plan} plan has ended.`, { link: "/admin?tab=churn", key: event.id });
  }

  if (event.type === "invoice.paid") {
    await handleInvoicePaid(event.data.object as Stripe.Invoice);
  }

  if (event.type === "invoice.payment_failed") {
    const inv = event.data.object as Stripe.Invoice;
    await logActivity("payment-failed", `Payment failed: ${formatPrice(inv.amount_due)}`,
      `${inv.customer_email || "A client"}'s payment didn't go through. Stripe will retry it.`, { link: "/admin?tab=churn", key: event.id });
  }

  return new Response("ok");
}
