import { NextResponse } from "next/server";
import { stripe } from "@/lib";
import { isPaid } from "@/paid";
import { ELITE_COOKIE, eliteCookieOptions, eliteCookieValue, isActiveEliteSub, subIdFromLoginToken } from "@/elite";

// GET ?token=…  : sign-in link from the Elite email. Unlocks guides on this device.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const subId = subIdFromLoginToken(url.searchParams.get("token") || "");
  if (!subId || !(await isActiveEliteSub(subId))) {
    return NextResponse.redirect(new URL("/shop?elite=expired#elite", url), 302);
  }
  const res = NextResponse.redirect(new URL("/shop?elite=1#elite", url), 302);
  res.cookies.set(ELITE_COOKIE, eliteCookieValue(subId), eliteCookieOptions);
  return res;
}

// POST { session_id } : called by the thank-you page right after an Elite checkout.
export async function POST(req: Request) {
  const { session_id } = await req.json().catch(() => ({}));
  if (!stripe || typeof session_id !== "string") return NextResponse.json({ ok: false }, { status: 400 });
  const s = await stripe.checkout.sessions.retrieve(session_id).catch(() => null);
  const subId = typeof s?.subscription === "string" ? s.subscription : s?.subscription?.id;
  if (!s || !isPaid(s) || s.metadata?.kind !== "tier" || s.metadata?.id !== "elite" || !subId || !(await isActiveEliteSub(subId))) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ELITE_COOKIE, eliteCookieValue(subId), eliteCookieOptions);
  return res;
}
