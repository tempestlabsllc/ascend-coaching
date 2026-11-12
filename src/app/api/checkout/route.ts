import { NextResponse } from "next/server";
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

  // Send buyers back to whatever domain they're on (vercel.app link or custom domain).
  const siteUrl = new URL(req.url).origin;

  const isSub = kind === "tier" && "interval" in item && item.interval === "month";
  const is3 = isSub && term === "3month";
  const name = "name" in item ? `${item.name} Coaching${is3 ? ` (${threeMonth.months}-month plan)` : ""}` : item.title;
  const amount = is3 ? threeMonthTotalCents(item.priceCents) : item.priceCents;

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
    // Shown next to the pay button on Stripe's checkout page.
    ...(kind === "tier"
      ? { custom_text: { submit: { message: "After you subscribe, your coach will personally reach out within 24 hours on Trainerize or WhatsApp to review everything with you." } } }
      : {}),
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    // Stripe Tax: turn on once Tax is set up in the Stripe dashboard (Settings → Tax).
    ...(process.env.STRIPE_AUTOMATIC_TAX === "true"
      ? { automatic_tax: { enabled: true }, ...(isSub ? {} : { customer_creation: "always" as const }) }
      : {}),
    // Invoicing: subscriptions create invoices automatically; one-time purchases
    // (guides) get a paid invoice PDF emailed to the buyer too.
    ...(isSub
      ? { subscription_data: { billing_mode: { type: "flexible" as const }, metadata: { tier: id, term: is3 ? "3month" : "monthly" } } }
      : { invoice_creation: { enabled: true } }),
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/${kind === "tier" ? "coaching" : "shop"}`,
  });

  return NextResponse.json({ url: session.url });
}
