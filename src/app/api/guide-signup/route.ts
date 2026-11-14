import { NextResponse } from "next/server";
import { guides } from "@/config/site";
import { forwardSubmission } from "@/forward";
import { site } from "@/config/site";
import { sendEmail, emailLayout, esc } from "@/email";
import { freeGuideKey } from "@/free-link";
import { saveRecord } from "@/store";
import { logActivity } from "@/activity";

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

  await logActivity("lead", `New lead: ${email}`, `Unlocked ${guide.title}`);
  // Email the buyer their copy, so they can download it again from any device.
  const link = `${site.url}/api/download?guide=${guide.id}&k=${freeGuideKey(guide.id)}`;
  await sendEmail(email, `Your free guide: ${guide.title}`, emailLayout("Your free guide is ready", `<p style="margin:0 0 14px">Thanks for grabbing <strong>${esc(guide.title)}</strong>. You can download it any time here:</p>
<p><a href="${link}" style="display:inline-block;background:#3a9ad9;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">Download PDF</a></p>
<p style="margin:14px 0 0">Want a plan built around you? <a href="${site.url}/coaching" style="color:#2378b5;font-weight:700">See coaching plans</a>.</p>`)).catch(() => false);

  const res = NextResponse.json({ ok: true, url: `/api/download?guide=${guide.id}` });
  res.cookies.set("ac_guide_unlocked", "1", { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}
