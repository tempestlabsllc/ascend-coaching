import type Stripe from "stripe";
import { stripe } from "@/lib";
import { site } from "@/config/site";

// Makes sure Stripe sends checkout events to this site, so nobody has to set up the
// webhook by hand. Runs in the background after a checkout starts; it only creates
// the endpoint when it's missing. Events are verified by fetching them back from
// Stripe (see /api/stripe-webhook), so no signing secret needs copying anywhere.
export const WEBHOOK_URL = `${site.url}/api/stripe-webhook`;
const EVENTS = ["checkout.session.completed", "customer.subscription.deleted", "invoice.payment_failed", "invoice.paid"] as const;

let done: Promise<void> | null = null;

export function ensureWebhook() {
  if (!stripe || process.env.STRIPE_AUTO_WEBHOOK === "false") return Promise.resolve();
  done ??= (async () => {
    const list = await stripe!.webhookEndpoints.list({ limit: 100 });
    // Same endpoint on the other host spelling (with or without www) redirects, which Stripe
    // treats as a failed delivery: move it to the live address instead of adding a second one.
    const bare = (u: string) => u.replace("://www.", "://");
    let hit = list.data.find((w) => w.url === WEBHOOK_URL);
    const stale = hit ? undefined : list.data.find((w) => bare(w.url) === bare(WEBHOOK_URL));
    if (stale) hit = await stripe!.webhookEndpoints.update(stale.id, { url: WEBHOOK_URL });
    if (!hit) {
      await stripe!.webhookEndpoints.create({
        url: WEBHOOK_URL,
        enabled_events: [...EVENTS],
        description: "Ascend Coaching: purchase emails and Elite access",
      });
    } else if (hit.status !== "enabled" || !EVENTS.every((e) => hit.enabled_events.includes(e) || hit.enabled_events.includes("*"))) {
      await stripe!.webhookEndpoints.update(hit.id, {
        disabled: false,
        enabled_events: [...new Set([...hit.enabled_events.filter((e) => e !== "*"), ...EVENTS])] as Stripe.WebhookEndpointUpdateParams.EnabledEvent[],
      });
    }
  })().catch((e) => {
    done = null; // try again next time
    console.error("Stripe webhook setup failed", e?.message ?? e);
  });
  return done;
}
