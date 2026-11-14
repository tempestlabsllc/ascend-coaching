import { NextResponse, after } from "next/server";
import { ensureWebhook } from "@/stripe-setup";
import { tiers, guides, site, threeMonth, threeMonthTotalCents } from "@/config/site";
import { stripe } from "@/lib";

export async function POST(req: Request) {
  const { kind, id, term } = await req.json().catch(() => ({}));
  const item = kind === "tier" ? tiers.find((t) => t.id === id) : guides.find((g) => g.id === id);
  if (!item) return NextResponse.json({ message: "Unknown item." }, { status: 400 });
  if ("comingSoon" in item && item.comingSoon) return NextResponse.json({ message: "This guide is coming soon." }, { status: 400 });

  if (!stripe) {
    return NextResponse.json({ message: "Demo mode: payments aren't connected yet (add STRIPE_SECRET_KEY)." });
  }

  // Make sure Stripe will tell us about this purchase (sets up the webhook once).
  after(() => ensureWebhook());

  // Send buyers back to whatever domain they're on (vercel.app link or custom domain).
  const siteUrl = new URL(req.url).origin;

  const isSub = kind === "tier" && "interval" in item && item.interval === "month";
  const is3 = isSub && term === "3month";
  const name = "name" in item ? `${item.name} Coaching${is3 ? ` (${threeMonth.months}-month plan)` : ""}` : item.title;
  const amount = is3 ? threeMonthTotalCents(item.priceCents) : item.priceCents;

  // Embedded payment form (Stripe Checkout Studio, ui_mode "form") whenever a publishable key for the
  // same mode (test/live) as the secret key is set. Otherwise fall back to Stripe's hosted checkout page,
  // so buying never breaks while keys are being switched.
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  const live = (k: string) => k.includes("_live_");
  const embedded = publishableKey.startsWith("pk_") && live(publishableKey) === live(process.env.STRIPE_SECRET_KEY ?? "");
  const returnUrl = `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`;

  const session = await stripe.checkout.sessions.create({
    mode: isSub ? "subscription" : "payment",
    line_items: [{
      quantity: 1,
      price_data: {
        currency: site.currency,
        unit_amount: amount,
        product_data: { name, tax_code: "txcd_10000000" }, // general electronically supplied services
        ...(process.env.STRIPE_AUTOMATIC_TAX === "true" ? { tax_behavior: "exclusive" as const } : {}),
        ...(isSub ? { recurring: { interval: "month" as const, interval_count: is3 ? threeMonth.months : 1 } } : {}),
      },
    }],
    metadata: { kind, id, term: is3 ? "3month" : "monthly" },
    allow_promotion_codes: true,
    // Configured in Stripe Checkout Studio.
    billing_address_collection: "auto",
    phone_number_collection: { enabled: false },
    submit_type: "auto",
    ...(isSub ? { payment_method_collection: "always" as const } : {}),
    // Stripe Tax: off (as set in Checkout Studio) until Tax is set up in the Stripe dashboard (Settings → Tax)
    // and STRIPE_AUTOMATIC_TAX=true.
    ...(process.env.STRIPE_AUTOMATIC_TAX === "true"
      ? { automatic_tax: { enabled: true }, ...(isSub ? {} : { customer_creation: "always" as const }) }
      : { automatic_tax: { enabled: false } }),
    // Invoicing: subscriptions create invoices automatically; one-time purchases
    // (guides) get a paid invoice PDF emailed to the buyer too.
    ...(isSub
      ? { subscription_data: { billing_mode: { type: "flexible" as const }, metadata: { tier: id, term: is3 ? "3month" : "monthly" } } }
      : { invoice_creation: { enabled: true } }),
    ...(embedded
      ? { ui_mode: "form" as const, integration_identifier: "custom_embedded_web_0001", return_url: returnUrl }
      : {
          // Hosted page fallback. The coaching note is shown on our /checkout page for the embedded form
          // (the form doesn't support custom_text).
          ...(kind === "tier"
            ? { custom_text: { submit: { message: "After you subscribe, your coach will personally reach out within 24 hours on Trainerize or WhatsApp to review everything with you." } } }
            : {}),
          success_url: returnUrl,
          cancel_url: `${siteUrl}/${kind === "tier" ? "coaching" : "shop"}`,
        }),
  });

  return embedded
    ? NextResponse.json({ client_secret: session.client_secret, publishable_key: publishableKey })
    : NextResponse.json({ url: session.url });
}
