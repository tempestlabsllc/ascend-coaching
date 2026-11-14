# Ascend Coaching website

Next.js 16 + Tailwind + Stripe Checkout. Pages:

| Page | What it does |
|---|---|
| `/` | Home: hero, how it works, coaching plans, guides banner |
| `/coaching` | Coaching tiers with "Start" buttons (Stripe monthly subscription) + FAQ |
| `/book` | Embedded booking calendar (Cal.com or Calendly link) |
| `/intake` | Intake questionnaire: stats, goals, training, nutrition, health |
| `/shop` | Digital guides: free ones download directly, paid ones go through Stripe |
| `/admin` | Private (needs `ADMIN_PASSWORD`): revenue, clients, intake & check-in answers, guide sales, cancellations & failed payments, leads (CSV), discount codes |
| `/success` | After payment: download link for guides, or "start questionnaire" for coaching |

## Edit content
Brand name, tiers, prices and guides all live in **`src/config/site.ts`**.
Put guide PDFs in **`private-guides/`** using the file names set in that config.
Paid PDFs are only downloadable with a paid Stripe session.

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```
Without `STRIPE_SECRET_KEY` the buy buttons show a "demo mode" message.

## Settings (`.env.local`, or your host's environment variables)
- `ADMIN_PASSWORD` – password for `/admin` (12+ characters). Without it the admin page stays locked.
- `KV_REST_API_URL` + `KV_REST_API_TOKEN` – Upstash Redis (Vercel → Storage → Upstash). Saves intake/check-in answers and guide-signup leads so they show in `/admin`. Optional: forms still email without it.
- `STRIPE_SECRET_KEY` – from dashboard.stripe.com (use `sk_test_...` first)
- `STRIPE_AUTOMATIC_TAX=true` – after turning on Stripe Tax (Settings → Tax) to add sales tax at checkout
- Invoices: subscriptions invoice automatically; guide purchases get a paid invoice emailed. In Stripe → Settings → Customer emails, turn on "Successful payments" and "Finalized invoices".
- `NEXT_PUBLIC_BOOKING_URL` – your Cal.com / Calendly link
- Questionnaire answers are emailed to supportascendcoaching@gmail.com on the live site (via FormSubmit, no account).
  The first submission sends an activation email to that inbox: click Activate once.
  Optional: `INTAKE_EMAIL` to change the address, or `INTAKE_WEBHOOK_URL` to send to Zapier/Make/Sheets.
  Locally (npm run dev) answers are saved to `intake-submissions.jsonl` instead.

## Deploy to Vercel + ascendcoaching.shop
1. Put this folder in a GitHub repo, then on vercel.com → Add New → Project → import it (defaults are fine).
   `NEXT_PUBLIC_BOOKING_URL`, and later `NEXT_PUBLIC_STRIPE_PORTAL_URL`. Redeploy.
3. Project → Settings → Domains → add `ascendcoaching.shop` (and `www.ascendcoaching.shop`).
   If you don't own it yet, buy it right there in Vercel (Domains → Buy) and DNS is set up automatically.
   If you bought it elsewhere, Vercel shows the DNS records to add at your registrar.

## Stripe setup checklist (from Stripe's integration planner)
1. **Checkout**: Stripe-hosted Checkout (already built). Subscriptions use flexible billing mode.
2. **Customer Portal**: Dashboard → Settings → Billing → Customer portal → activate, allow cancel + switch plans,
   copy the login link into `NEXT_PUBLIC_STRIPE_PORTAL_URL`. A "Manage subscription" link then shows in the footer.
3. **Failed payments**: Dashboard → Settings → Billing → Revenue recovery → turn on Smart Retries and failed-payment emails.
4. **Tax**: Dashboard → Tax → confirm head office address. Products are tagged as digital services, so Stripe
   monitors tax thresholds for free. Once you register somewhere, set `STRIPE_AUTOMATIC_TAX=true`.
5. **Invoices**: Dashboard → Settings → Branding → upload logo, set turquoise (#0fa8a3). Turn on receipt/invoice emails
   under Settings → Customer emails.
