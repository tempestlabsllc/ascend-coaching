import { createHash, timingSafeEqual } from "node:crypto";

// Elite-only guide code. The repo is public, so only a SHA-256 hash of the code
// lives here; the plain code is set in Vercel as ELITE_GUIDE_CODE (used in emails).
const ELITE_CODE_SHA256 = "6361e5cf70a61390f0821502f20418101578b945aa8a03333b387b3763e56320";
export const ELITE_COOKIE = "ac_elite";

const sha = (s: string) => createHash("sha256").update(s).digest();

export function isEliteCode(input: unknown): boolean {
  if (typeof input !== "string") return false;
  const code = input.trim().toUpperCase();
  if (!code) return false;
  const env = process.env.ELITE_GUIDE_CODE?.trim().toUpperCase();
  const hashes = [Buffer.from(ELITE_CODE_SHA256, "hex"), ...(env ? [sha(env)] : [])];
  const h = sha(code);
  return hashes.some((x) => x.length === h.length && timingSafeEqual(x, h));
}

export function hasEliteCookie(cookieHeader: string | null) {
  return (cookieHeader || "").split(/;\s*/).includes(`${ELITE_COOKIE}=1`);
}
