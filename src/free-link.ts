import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Download links for free guides that work from an email, on any device.
const key = () => createHash("sha256").update(`ascend-free:${process.env.ELITE_SIGNING_SECRET || process.env.STRIPE_SECRET_KEY || ""}`).digest();
const sig = (guideId: string) => createHmac("sha256", key()).update(guideId).digest("base64url").slice(0, 22);

export const freeGuideKey = sig;

export function validFreeKey(guideId: string, k: string | null) {
  if (!k) return false;
  const a = Buffer.from(sig(guideId)), b = Buffer.from(k);
  return a.length === b.length && timingSafeEqual(a, b);
}
