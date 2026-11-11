// ─────────────────────────────────────────────────────────────
// Everything you'll want to edit lives in this file:
// brand, coaching tiers, prices, and digital guides.
// All values are PLACEHOLDERS until confirmed.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Ascend Coaching",
  tagline: "Online fitness coaching built around your life.",
  heroTitle: "Start your ascension today",
  coachName: "your coach",
  yearsExperience: 9,
  email: "supportascendcoaching@gmail.com",
  instagram: "https://instagram.com/",
  currency: "usd",
  // Stripe Customer Portal login link (Stripe Dashboard → Settings → Billing → Customer portal).
  // Lets clients cancel, switch tiers, update cards and download invoices themselves.
  manageSubscriptionUrl: process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL || "",
  bookingUrl:
    process.env.NEXT_PUBLIC_BOOKING_URL || "https://calendly.com/supportascendcoaching/30min",
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
  // Shown when someone hovers or taps "See full details" on the card.
  bestFor: string;
  details: { label: string; value: string }[];
};

export const tiers: Tier[] = [
  {
    id: "starter",
    color: "grey",
    name: "Starter",
    priceCents: 5000,
    interval: "month",
    blurb: "Train exactly how your coach trains.",
    bestFor: "Self-starters who want a proven routine to follow, without needing a custom plan.",
    details: [
      { label: "Your plan", value: "Your coach's exact training routine plus calorie and macro targets, delivered within 3 days" },
      { label: "Check-ins", value: "Monthly check-in form, reply within 72 hours" },
      { label: "Updates", value: "You get every change your coach makes to their own routine" },
      { label: "Support", value: "Questions answered at your monthly check-in" },
    ],
    features: [
      "Your coach's personal training routine",
      "Exact exercises, sets and reps",
      "Updated whenever the routine changes",
      "Nutrition targets (calories + macros)",
    ],
  },
  {
    id: "pro",
    color: "gold",
    name: "Pro",
    priceCents: 10000,
    interval: "month",
    blurb: "Weekly accountability for steady progress.",
    bestFor: "Anyone who wants a plan built around their body, schedule and goals, with weekly accountability.",
    details: [
      { label: "Your plan", value: "Fully custom program and meal plan built from your questionnaire, delivered within 3 days" },
      { label: "Check-ins", value: "Weekly check-in form, reply within 48 hours with form feedback" },
      { label: "Updates", value: "Program and nutrition adjusted every 4 weeks based on your progress" },
      { label: "Support", value: "Message your coach anytime, replies within 48 hours" },
    ],
    features: [
      "Fully custom program built for you",
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
    bestFor: "Clients who want the fastest results and the most hands-on support.",
    details: [
      { label: "Your plan", value: "Custom program and meal plan, plus a 30-minute kickoff video call to walk through it" },
      { label: "Check-ins", value: "Weekly check-in with a personal video reply within 24 hours" },
      { label: "Calls", value: "1:1 video call with your coach every 2 weeks" },
      { label: "Updates", value: "Program adjusted every 4 weeks, or sooner if needed" },
      { label: "Support", value: "Same-day messaging, plus sleep, stress and recovery coaching" },
    ],
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
  // true = listed with a "Coming soon" badge and no buy button yet.
  comingSoon?: boolean;
};

export const guides: Guide[] = [
  {
    // FREE guide. Source: guides-src/starting-peps.html (re-render to PDF after edits).
    id: "starting-peps",
    title: "Everything You Need to Know About Starting Peps",
    priceCents: 0,
    description: "What peptides are, what they do in your body, what the science and 2026 regulations actually say, and a checklist before you start.",
    pages: 11,
    file: "starting-peps.pdf",
  },
  {
    // PLACEHOLDER: set the price and description, drop the PDF in /private-guides, then remove comingSoon.
    id: "personal-split",
    title: "My Personal Training Split",
    priceCents: 0,
    description: "The exact weekly split I train with: every day, exercise, set and rep, plus how I progress it.",
    pages: 0,
    file: "personal-split.pdf",
    comingSoon: true,
  },
  {
    // PLACEHOLDER: set the price and description, drop the PDF in /private-guides, then remove comingSoon.
    id: "personal-protocol",
    title: "My Personal Protocol",
    priceCents: 0,
    description: "The full protocol I follow day to day, laid out step by step so you can run it yourself.",
    pages: 0,
    file: "personal-protocol.pdf",
    comingSoon: true,
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

// About the coach. Placeholder text: replace with the coach's real story.
// Drop a photo at /public/coach.jpg and set photo: "/coach.jpg".
export const about = {
  photo: "",
  headline: "A real coach in your corner.",
  short: "I help busy people build strength, lose fat and feel confident, with plans that fit real life instead of fighting it.",
  story: [
    "I've spent 9 years as a personal trainer, working with people face to face. Ascend Coaching brings that same 1:1 coaching online: you work directly with me, not an algorithm.",
    "Placeholder: a few sentences about how you got into fitness and coaching.",
    "Placeholder: your qualifications, experience, and who you love working with.",
    "Placeholder: your coaching philosophy and what clients can expect from you.",
  ],
  credentials: ["9 years of personal training", "1:1 coaching, no bots", "Certification (placeholder)"],
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
