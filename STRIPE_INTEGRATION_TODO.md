# Stripe integration: remaining steps

This file is the single source of truth for finishing the Stripe embedded form (Checkout Studio) setup.

## Values to Replace

None. The Checkout Session call already uses real values:

- `mode` is picked per product: `"subscription"` for coaching plans (monthly and 3-month), `"payment"` for paid guides.
- `line_items` are built from the prices in [src/config/site.ts](src/config/site.ts) with `price_data`, so there are no `price_...` placeholders to swap. To change a price, edit that file.

**Files containing placeholders:** none.

| Field | Current Value | What to Set |
|-------|--------------|-------------|
| mode | `subscription` (coaching) / `payment` (guides) | Nothing to do. |
| line_items[].price_data | Built from `src/config/site.ts` | Nothing to do. Edit prices in `src/config/site.ts`. |

## Configured Parameters

These parameters were configured in Checkout Studio and are already set.

**Files containing these parameters:**
- [src/app/api/checkout/route.ts](src/app/api/checkout/route.ts) (server: creates the Checkout Session)
- [src/app/checkout/CheckoutForm.tsx](src/app/checkout/CheckoutForm.tsx) (browser: appearance and form layout)

| Parameter | Value |
|-----------|-------|
| ui_mode | `form` |
| integration_identifier | `custom_embedded_web_0001` |
| billing_address_collection | `auto` |
| phone_number_collection | `{ enabled: false }` |
| automatic_tax | `{ enabled: false }` (turns on only if you set `STRIPE_AUTOMATIC_TAX=true`, same as before) |
| payment_method_collection | `always` (coaching subscriptions only; Stripe only allows it on subscriptions) |
| submit_type | `auto` |
| appearance | Stripe theme, spaced inputs, 4px radius, `#0570de` primary (as configured) |
| form layout | `expanded` |

Kept from the existing setup because the site depends on them: `metadata` (tells the thank-you page, emails and Elite unlock what was bought), `allow_promotion_codes` (discount codes, including 100% off), `subscription_data` (flexible billing, plan info), `invoice_creation` (guide invoices).

Removed for the embedded form: `success_url` and `cancel_url` (replaced by `return_url`, which points at the same `/success` page) and `custom_text` (Stripe rejects it with `ui_mode: "form"`; the "I'll reach out within 24 hours" note now sits above the form on `/checkout`). These still apply on the hosted-page fallback below.

## Setup

1. **Add the publishable key.** In Vercel, open the project, then Settings, then Environment Variables, and add:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your publishable key from https://dashboard.stripe.com/apikeys
2. **Use matching keys.** The publishable key must come from the same mode as `STRIPE_SECRET_KEY`:
   - Testing: `sk_test_...` with `pk_test_...`
   - Live: `sk_live_...` with `pk_live_...`
   When you switch to live, change **both** at the same time. If they don't match (or the publishable key is missing), the site falls back to Stripe's hosted checkout page, so sales keep working.
3. **Redeploy** in Vercel after changing environment variables.
4. Nothing else to install. Stripe.js loads from `https://js.stripe.com/dahlia/stripe.js` (Stripe requires it to load from their site). The `stripe` server package (v23, API version `2026-10-28.endive`) already supports the embedded form.
5. **Live mode webhook:** nothing to do. The site creates its Stripe webhook automatically on the first checkout in each mode, as before.

## What changed (files)

- `src/app/checkout/page.tsx` (new): the checkout page buyers land on after clicking a plan or guide.
- `src/app/checkout/CheckoutForm.tsx` (new): loads Stripe.js and mounts the embedded payment form.
- `src/components/BuyButton.tsx`: buttons now open `/checkout` instead of jumping straight to Stripe.
- `src/app/api/checkout/route.ts`: creates the session with the Checkout Studio settings and returns `{ client_secret }` for the form (or `{ url }` for the hosted fallback).
- `.env.example`, `README.md`: document `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.

## How it works

1. Buyer clicks "Choose Elite" (or "Buy now" on a guide) and lands on `/checkout` on your site.
2. The page asks `/api/checkout` for a Checkout Session. The server builds it from `src/config/site.ts` and returns a client secret.
3. Stripe's payment form appears inside your page. Discount codes are entered right in the form.
4. After paying (or a 100%-off code), Stripe sends the buyer to `/success?session_id=...`, the same thank-you page as before. It shows the guide download or next steps, unlocks Elite guides, and sends the purchase emails.
5. The Stripe webhook (`/api/stripe-webhook`) still receives `checkout.session.completed` as the backup for emails, so nothing is lost if the buyer closes the tab.

## Testing

Use test keys (`sk_test_` + `pk_test_`) and these cards with any future expiry date, any CVC and any postcode:

| Card | Result |
|------|--------|
| 4242 4242 4242 4242 | Payment succeeds |
| 4000 0025 0000 3155 | Asks for 3D Secure authentication |
| 4000 0000 0000 9995 | Declined (insufficient funds) |

Things to check once:
- Buy a guide: you land on the thank-you page with a Download PDF button, and get the email.
- Buy Elite: the thank-you page unlocks all guides.
- Use a 100%-off promotion code on a guide: the order completes without a card.
- Click "Back" on `/checkout`: you return to the plans or guides page.

## Next steps

- Products and prices: edit `src/config/site.ts`.
- Fulfillment and order tracking: already handled by `/success`, `/api/stripe-webhook` and the `/admin` dashboard.
- Optional: match the form colours to the site's blue (`#3a9ad9`) by changing `colorPrimary` in `src/app/checkout/CheckoutForm.tsx` or in Checkout Studio.

## Resources

- https://support.stripe.com
- https://docs.stripe.com/mcp
