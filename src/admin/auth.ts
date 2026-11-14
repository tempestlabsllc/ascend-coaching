import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Private admin area. The password lives only in Vercel as ADMIN_PASSWORD (never in this
// public repo). A signed, httpOnly cookie keeps you logged in for 7 days; changing the
// password logs every device out.
export const ADMIN_COOKIE = "ac_admin";
const MAX_AGE = 60 * 60 * 24 * 7;
const MIN_LENGTH = 12;

function password() {
  const p = process.env.ADMIN_PASSWORD ?? "";
  return p.length >= MIN_LENGTH ? p : null; // too short (or missing) = admin stays locked
}
export const adminConfigured = () => password() !== null;

const sha = (s: string) => createHash("sha256").update(s).digest();
const key = (p: string) => sha(`ascend-admin:${p}:${process.env.ADMIN_SESSION_SECRET ?? ""}`);
const sign = (p: string, body: string) => createHmac("sha256", key(p)).update(body).digest("base64url");

export function checkPassword(input: unknown) {
  const p = password();
  if (!p || typeof input !== "string") return false;
  return timingSafeEqual(sha(input), sha(p));
}

export function newSessionToken() {
  const p = password()!;
  const body = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return `${body}.${sign(p, body)}`;
}

function validToken(token: string | undefined) {
  const p = password();
  if (!p || !token) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig || !/^\d+$/.test(body) || Number(body) < Date.now() / 1000) return false;
  const a = Buffer.from(sig), b = Buffer.from(sign(p, body));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin() {
  return validToken((await cookies()).get(ADMIN_COOKIE)?.value);
}

export const sessionCookie = { httpOnly: true, secure: true, sameSite: "strict" as const, path: "/", maxAge: MAX_AGE };
