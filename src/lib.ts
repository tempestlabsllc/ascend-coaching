import Stripe from "stripe";
export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? "https://ascendcoaching.shop" : "http://localhost:3000");
