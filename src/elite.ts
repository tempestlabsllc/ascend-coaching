import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { stripe } from "@/lib";

// Elite members get every guide free while their Elite subscription is active.
//
// How access works (no codes to share or leak):
// - Right after an Elite checkout, the thank-you page unlocks guides on that device.
// - On any other device, members enter their checkout email on the Guides page and
//   get a one-time sign-in link by email.
// Either way the browser gets a signed cookie holding their Stripe subscription id,
// and every visit re-checks with Stripe that the subscription is still active.
// Cancelled or unpaid memberships lose access automatically.

export const ELITE_COOKIE = "ac_elite";
const ACTIVE = new Set(["active", "trialing", "past_due"]);

function key() {
  const base = process.env.ELITE_SIGNING_SECRET || process.env.STRIPE_SECRET_KEY || "";
  return createHash("sha256").update(`ascend-elite:${base}`).digest();
}
const sign = (data: string) => createHmac("sha256", key()).update(data).digest("base64url");
function sigOk(data: string, sig: string) {
  const a = Buffer.from(sign(data));
  const b = Buffer.from(sig);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Cookie value for a subscription: "<subId>.<signature>". */
export const eliteCookieValue = (subId: string) => `${subId}.${sign(subId)}`;

/** One-time sign-in link token, valid for `days`. */
export function eliteLoginToken(subId: string, days = 7) {
  const exp = Math.floor(Date.now() / 1000) + days * 86400;
  return `${subId}.${exp}.${sign(`${subId}.${exp}`)}`;
}

export function subIdFromLoginToken(token: string): string | null {
  const [subId, exp, sig] = token.split(".");
  if (!subId || !exp || !sig) return null;
  if (!sigOk(`${subId}.${exp}`, sig) || Number(exp) < Date.now() / 1000) return null;
  return subId;
}

/** True when the Stripe subscription exists, is an Elite plan and is still active. */
export async function isActiveEliteSub(subId: string) {
  if (!stripe || !subId.startsWith("sub_")) return false;
  const sub = await stripe.subscriptions.retrieve(subId).catch(() => null);
  return !!sub && sub.metadata?.tier === "elite" && ACTIVE.has(sub.status);
}

/** Checks the Elite cookie (from a raw Cookie header or a value) against Stripe. */
export async function hasElite(cookieHeaderOrValue: string | null | undefined, isHeader = true) {
  let value = cookieHeaderOrValue || "";
  if (isHeader) {
    const hit = value.split(/;\s*/).find((c) => c.startsWith(`${ELITE_COOKIE}=`));
    value = hit ? decodeURIComponent(hit.slice(ELITE_COOKIE.length + 1)) : "";
  }
  const [subId, sig] = value.split(".");
  if (!subId || !sig || !sigOk(subId, sig)) return false;
  return isActiveEliteSub(subId);
}

/** Finds an active Elite subscription for a checkout email, if any. */
export async function findEliteSubByEmail(email: string) {
  if (!stripe) return null;
  const variants = [...new Set([email.trim(), email.trim().toLowerCase()])].filter(Boolean);
  const seen = new Set<string>();
  for (const e of variants) {
    const customers = await stripe.customers.list({ email: e, limit: 10 }).catch(() => null);
    for (const c of customers?.data ?? []) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      const subs = await stripe.subscriptions.list({ customer: c.id, status: "all", limit: 20 }).catch(() => null);
      const sub = subs?.data.find((s) => s.metadata?.tier === "elite" && ACTIVE.has(s.status));
      if (sub) return sub;
    }
  }
  return null;
}

export const eliteCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: true,
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};
