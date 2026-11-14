import { NextResponse } from "next/server";
import { guides } from "@/config/site";
import { forwardSubmission } from "@/forward";
import { saveRecord } from "@/store";

// Free guides unlock with an email. The email is sent to the coach like other
// forms, then a cookie lets this browser download free guides.
export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  const email = typeof data?.email === "string" ? data.email.trim() : "";
  const guide = guides.find((g) => g.id === data?.guide && g.priceCents === 0 && !g.comingSoon);
  if (!guide || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || data?.consent !== true) {
    return NextResponse.json({ ok: false, message: "Please enter a valid email and tick the box." }, { status: 400 });
  }
  const saved = await saveRecord("leads", { email: email.toLowerCase(), guide: guide.id, consent: true });
  const ok = (await forwardSubmission(`New guide signup: ${email}`, {
    form: "guide-signup",
    email,
    guide: guide.title,
    marketingConsent: "Agreed to emails from Ascend Coaching and Tempest Labs (tempestlabs.shop)",
  }, email).catch(() => false)) || saved;
  if (!ok) return NextResponse.json({ ok: false, message: "Something went wrong. Please try again." }, { status: 502 });

  const res = NextResponse.json({ ok: true, url: `/api/download?guide=${guide.id}` });
  res.cookies.set("ac_guide_unlocked", "1", { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}
