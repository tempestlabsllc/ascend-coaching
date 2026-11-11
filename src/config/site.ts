// ─────────────────────────────────────────────────────────────
// Everything you'll want to edit lives in this file:
// brand, coaching tiers, prices, and digital guides.
// All values are PLACEHOLDERS until confirmed.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Ascend Coaching",
  tagline: "Online fitness coaching built around your life.",
  heroTitle: "Start your ascension today",
  coachName: "Edwin",
  email: "supportascendcoaching@gmail.com",
  instagram: "https://instagram.com/",
  currency: "usd",
  // Stripe Customer Portal login link (Stripe Dashboard → Settings → Billing → Customer portal).
  // Lets clients cancel, switch tiers, update cards and download invoices themselves.
  manageSubscriptionUrl: process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || "",
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL || "https://cal.com/your-name/discovery-call",
};

export type Tier = {
  id: string;
  name: string;
  priceCents: number;
  interval: "month" | "one_time";
  blurb: string;
  features: string[];
  highlighted?: boolean;
  color: "grey" | "gold" | "rainbow";
};

export const tiers: Tier[] = [
  {
    id: "starter",
    color: "grey",
    name: "Starter",
    priceCents: 5000,
    interval: "month",
    blurb: "A personalised plan and monthly check-ins.",
    features: [
      "Custom training program",
      "Nutrition targets (calories + macros)",
      "Monthly check-in call",
      "Program updates every 4 weeks",
    ],
  },
  {
    id: "pro",
    color: "gold",
    name: "Pro",
    priceCents: 10000,
    interval: "month",
    blurb: "Weekly accountability for steady progress.",
    features: [
      "Everything in Starter",
      "Weekly check-ins with form review",
      "Custom meal plan",
      "Messaging support (48h reply)",
    ],
    highlighted: true,
  },
  {
    id: "elite",
    color: "rainbow",
    name: "Elite",
    priceCents: 20000,
    interval: "month",
    blurb: "Hands-on, high-touch coaching.",
    features: [
      "Everything in Pro",
      "Bi-weekly 1:1 video calls",
      "Same-day messaging support",
      "Lifestyle, sleep & recovery coaching",
    ],
  },
];

export type Guide = {
  id: string;
  title: string;
  priceCents: number;
  description: string;
  pages: number;
  // File name inside /private-guides that buyers get after paying.
  file: string;
};

export const guides: Guide[] = [
  {
    // FREE guide. Content still to come; drop the PDF into /private-guides when ready.
    id: "starting-peps",
    title: "Everything You Need to Know About Starting Peps",
    priceCents: 0,
    description: "A free beginner's overview. Full content coming soon.",
    pages: 0,
    file: "starting-peps.pdf",
  },
  // Add paid guides here later, e.g.
  // { id: "fat-loss-starter", title: "Fat Loss Starter Guide", priceCents: 2900, description: "...", pages: 40, file: "fat-loss-starter.pdf" },
];

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: site.currency.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

// About the coach. Placeholder text: replace with Edwin's real story.
// Drop a photo at /public/coach.jpg and set photo: "/coach.jpg".
export const about = {
  photo: "",
  headline: "Hi, I'm Edwin.",
  short: "I help busy people build strength, lose fat and feel confident, with plans that fit real life instead of fighting it.",
  story: [
    "Placeholder: a few sentences about how you got into fitness and coaching.",
    "Placeholder: your qualifications, experience, and who you love working with.",
    "Placeholder: your coaching philosophy and what clients can expect from you.",
  ],
  credentials: ["Certification (placeholder)", "X+ years coaching (placeholder)", "Specialty (placeholder)"],
};

// Real client testimonials. The section is hidden on the site until you add some.
export const testimonials: { name: string; result: string; quote: string }[] = [
  // { name: "Jordan M.", result: "-18 lbs in 12 weeks", quote: "..." },
];

export const faqs = [
  { q: "How does online coaching work?", a: "After you sign up you fill in the intake questionnaire. I build your training and nutrition plan, deliver it within a few days, and we check in on the schedule for your tier." },
  { q: "Do I need a gym?", a: "No. Plans can be built for a full gym, a home setup, or bodyweight only." },
  { q: "I'm a complete beginner. Is this for me?", a: "Yes. Every plan starts from where you are now, with clear instructions and form guidance." },
  { q: "Can I switch tiers or cancel?", a: "Yes. Monthly plans can be upgraded, downgraded or cancelled anytime before your next billing date." },
  { q: "What if I have an injury or medical condition?", a: "Tell me in the questionnaire and I'll work around it. For medical conditions, please get clearance from your doctor first." },
];
