import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type Stripe from "stripe";
import { stripe } from "@/lib";
import { site } from "@/config/site";

// Self-serve "Change or cancel plan" links. A signed link opens /manage for that client,
// where they can request a plan switch (from their next billing date) or open Stripe's
// billing portal to cancel (at period end), update their card or get invoices.
const key = () => createHash("sha256").update(`ascend-manage:${process.env.ELITE_SIGNING_SECRET || process.env.STRIPE_SECRET_KEY || ""}`).digest();
const sig = (customerId: string) => createHmac("sha256", key()).update(customerId).digest("base64url").slice(0, 22);

export const CANCEL_NOTE = "Plan changes and cancellations must be made before your next billing date to take effect for the next billing period. Your current plan continues until the end of the period you have paid for.";

export function manageUrl(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null | undefined, origin = site.url) {
  const id = typeof customer === "string" ? customer : customer?.id;
  return id ? `${origin}/manage?c=${encodeURIComponent(id)}&k=${sig(id)}` : `${origin}/manage`;
}

export function validManageKey(customerId: string | null, k: string | null) {
  if (!customerId || !k) return false;
  const a = Buffer.from(sig(customerId)), b = Buffer.from(k);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Our own portal settings: cancel at the end of the paid period, update card, see invoices.
let configId: string | null = null;
async function portalConfig() {
  if (configId) return configId;
  const list = await stripe!.billingPortal.configurations.list({ active: true, limit: 100 });
  const mine = list.data.find((c) => c.metadata?.app === "ascend-coaching");
  if (mine) return (configId = mine.id);
  const made = await stripe!.billingPortal.configurations.create({
    business_profile: { headline: `${site.name}: change or cancel your plan`, privacy_policy_url: `${site.url}/privacy`, terms_of_service_url: `${site.url}/terms` },
    features: {
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
        cancellation_reason: { enabled: true, options: ["too_expensive", "missing_features", "switched_service", "unused", "other"] },
      },
      payment_method_update: { enabled: true },
      invoice_history: { enabled: true },
      customer_update: { enabled: true, allowed_updates: ["email", "address"] },
    },
    default_return_url: site.url,
    metadata: { app: "ascend-coaching" },
  });
  return (configId = made.id);
}

export async function portalSession(customerId: string, returnUrl: string) {
  const s = await stripe!.billingPortal.sessions.create({ customer: customerId, configuration: await portalConfig(), return_url: returnUrl });
  return s.url;
}
