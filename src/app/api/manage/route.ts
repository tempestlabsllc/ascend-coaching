import { NextResponse } from "next/server";
import { stripe } from "@/lib";
import { site } from "@/config/site";
import { sendEmail, emailLayout } from "@/email";
import { CANCEL_NOTE, manageUrl, portalSession, validManageKey } from "@/manage-link";
import { findClient, normalizePhone } from "@/plan-change";

// GET: a signed link from an email or the thank-you page opens the client's Stripe billing portal.
export async function GET(req: Request) {
  const u = new URL(req.url);
  const c = u.searchParams.get("c");
  if (!stripe || !validManageKey(c, u.searchParams.get("k"))) return NextResponse.redirect(`${u.origin}/manage?error=link`, 303);
  try {
    return NextResponse.redirect(await portalSession(c!, `${u.origin}/manage?c=${encodeURIComponent(c!)}&k=${encodeURIComponent(u.searchParams.get("k")!)}`), 303);
  } catch (e) {
    console.error("billing portal", e);
    return NextResponse.redirect(`${u.origin}/manage?error=portal`, 303);
  }
}

// POST: client enters their checkout email and gets their manage link by email.
// Always answers the same way, so nobody can use this to check who is a client.
export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  const v = typeof email === "string" ? email.trim() : "";
  if (!(/^\S+@\S+\.\S+$/.test(v) || normalizePhone(v))) {
    return NextResponse.json({ ok: false, message: "Enter the email or phone number you used at checkout." }, { status: 400 });
  }
  const ok = { ok: true, message: "If we find a coaching plan, a secure link to change or cancel it is on its way to the email on file. Check your inbox." };
  if (!stripe) return NextResponse.json(ok);
  const found = await findClient(v);
  const addr = found?.customer.email;
  const customer = found?.customer.id;
  if (customer && addr) {
    await sendEmail(addr, "Change or cancel your Ascend Coaching plan", emailLayout("Change or Cancel Your Plan", `<p style="margin:0 0 14px">Tap below to switch plans, cancel, update your card or download invoices.</p>
<p><a href="${manageUrl(customer, new URL(req.url).origin)}" style="display:inline-block;background:#3a9ad9;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">Change or Cancel Plan</a></p>
<p style="margin:14px 0 0;font-size:14px">${CANCEL_NOTE}</p>
<p style="margin:14px 0 0;color:#6b7280;font-size:13px">Didn't ask for this? You can ignore this email. Questions? Reply or email ${site.email}.</p>`));
  }
  return NextResponse.json(ok);
}
