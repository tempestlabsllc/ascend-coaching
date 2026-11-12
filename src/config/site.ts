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
  instagram: "https://www.instagram.com/eddyy.raw/",
  instagramHandle: "@eddyy.raw",
  tiktok: "https://www.tiktok.com/@.eddyy",
  tiktokHandle: "@.eddyy",
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
  // Extra plan info (not currently shown on the cards).
  bestFor: string;
  details: { label: string; value: string }[];
};

export const tiers: Tier[] = [
  {
    id: "starter",
    color: "grey",
    name: "Starter",
    priceCents: 10000,
    interval: "month",
    blurb: "Train exactly how your coach trains.",
    bestFor: "Self-starters who want a proven routine to follow, without needing a custom plan.",
    details: [
      { label: "Your plan", value: "Your coach's exact training routine plus calorie and macro targets, delivered in the ABC Trainerize app within 3 days" },
      { label: "Check-ins", value: "Monthly check-in form, reply within 72 hours" },
      { label: "Updates", value: "You get every change your coach makes to their own routine" },
      { label: "Support", value: "1:1 contact on Trainerize or WhatsApp, questions answered at your monthly check-in" },
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
    priceCents: 20000,
    interval: "month",
    blurb: "Weekly accountability for steady progress.",
    bestFor: "Anyone who wants a plan built around their body, schedule and goals, with weekly accountability.",
    details: [
      { label: "Your plan", value: "Fully custom program and meal plan built from your questionnaire, delivered in the ABC Trainerize app within 3 days" },
      { label: "Check-ins", value: "Weekly check-in form, reply within 48 hours with form feedback" },
      { label: "Updates", value: "Program and nutrition adjusted every 4 weeks based on your progress" },
      { label: "Support", value: "Message your coach 1:1 on Trainerize or WhatsApp, with responses typically within 5 hours" },
    ],
    features: [
      "Fully custom program built for you",
      "Weekly check-ins with form review",
      "Custom meal plan",
      "1:1 messaging on Trainerize or WhatsApp (typically within 5 hours)",
    ],
    highlighted: true,
  },
  {
    id: "elite",
    color: "rainbow",
    name: "Elite",
    priceCents: 30000,
    interval: "month",
    blurb: "Hands-on, high-touch coaching.",
    bestFor: "Clients who want the fastest results and the most hands-on support.",
    details: [
      { label: "Your plan", value: "Custom program and meal plan in the ABC Trainerize app, plus a personal video walkthrough of your plan" },
      { label: "Check-ins", value: "Weekly check-in with a personal video reply within 24 hours" },
      { label: "Updates", value: "Program adjusted every 4 weeks, or sooner if needed" },
      { label: "Support", value: "Same-day 1:1 messaging on Trainerize or WhatsApp, plus sleep, stress and recovery coaching" },
    ],
    features: [
      "Everything in Pro",
      "Weekly check-ins with personal video responses",
      "Same-day 1:1 messaging (Trainerize or WhatsApp)",
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
    description: "What peptides are and what they do, my personal experience with them, what each popular peptide is studied for, and what the science and 2026 rules actually say.",
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
  photo: "/results/coach-lean.jpg",
  headline: "I know where you're starting, because I started there too.",
  short: "I know how overwhelming and stressful it can be to put in the work and not see the results you want. Let me help you avoid the mistakes I made, so you don't waste years chasing a goal without a proper plan to get there.",
  story: [
    "As a kid, I used to look at people who were big and strong with crazy abs and wonder how they ever got there. I wanted that so badly, but I had no idea where to even start.",
    "I started out skinny fat: not much muscle, a soft midsection, and clothes that never fit the way I wanted. I was always insecure about my body, so I know exactly how it can feel.",
    "My turning point came from years of personal research. I dug into everything I could find on how muscle is built and how nutrition affects your body, then tested it on myself. That knowledge built a physique I'm proud of, and taught me far more about the body than I ever expected to learn.",
    "Over the years I've mastered body recomposition: building muscle and losing fat at the same time. I've been very bulky and I've been very lean, and I understand exactly how to move between the two. Everything I know comes from years of real experience.",
    "Sharing that journey grew an audience of 10k followers on Instagram (twice) and 30k on TikTok, all around growth and self-improvement. Ascend Coaching is how I now help people 1:1. My goal is to help you achieve the physique you want as fast as possible, with the roadmap I wish I'd had as that kid who didn't know where to start.",
  ],
  credentials: ["9 years of training experience", "Multiple bulks, cuts and recomps", "10k on Instagram (twice)", "30k on TikTok", "1:1 coaching, no bots"],
};

// Before/after results shown on the home page. Photos live in /public/results.
export const results = [
  {
    who: "Kyle, client",
    headline: "200 lbs → 175 lbs",
    story: "Kyle wanted a build like mine: less fat and more lean muscle. We got him there in less than a year.",
    before: { src: "/results/kyle-before.jpg", label: "Before · 200 lbs" },
    after: { src: "/results/kyle-after.jpg", label: "After · 175 lbs" },
  },
  {
    who: "Your coach",
    headline: "180 lbs → 147 lbs",
    story: "From my heaviest bulk to my leanest. I've lived both ends, so I know how to get you where you want to be.",
    before: { src: "/results/coach-heavy-2.jpg", label: "Heaviest · 170–180 lbs" },
    after: { src: "/results/coach-lean.jpg", label: "Leanest · 147 lbs" },
  },
];

// Real client testimonials. The section is hidden on the site until you add some.
export const testimonials: { name: string; result: string; quote: string }[] = [
  // { name: "Jordan M.", result: "-18 lbs in 12 weeks", quote: "..." },
];

export const faqs = [
  { q: "How does online coaching work?", a: "After you sign up you fill in the intake questionnaire. I build your training and nutrition plan, deliver it within a few days, and we check in on the schedule for your tier." },
  { q: "What happens after I buy?", a: "Within 24 hours of your purchase I reach out to you personally to review everything: your goals, your plan and how we'll work together." },
  { q: "What app do you use?", a: "Your workouts and tracking live in the ABC Trainerize app (free for clients on iPhone and Android). You follow each session there, log your weights and reps, and track your progress. Day-to-day 1:1 contact with your coach happens on Trainerize or WhatsApp, whichever you prefer." },
  { q: "Do I need a gym?", a: "No. Plans can be built for a full gym, a home setup, or bodyweight only." },
  { q: "I'm a complete beginner. Is this for me?", a: "Yes. Every plan starts from where you are now, with clear instructions and form guidance." },
  { q: "Can I switch tiers or cancel?", a: "Yes. Monthly plans can be upgraded, downgraded or cancelled anytime before your next billing date." },
  { q: "What if I have an injury or medical condition?", a: "Tell me in the questionnaire and I'll work around it. For medical conditions, please get clearance from your doctor first." },
];
