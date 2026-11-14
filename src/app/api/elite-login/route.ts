import { NextResponse } from "next/server";
import { site } from "@/config/site";
import { sendEmail, emailLayout } from "@/email";
import { eliteLoginToken, findEliteSubByEmail } from "@/elite";

// Elite member on a new device: email them a sign-in link that unlocks every guide.
// Always answers the same way, so nobody can use this to check who is a member.
export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ ok: false, message: "Enter the email you used at checkout." }, { status: 400 });
  }
  const sub = await findEliteSubByEmail(email);
  if (sub) {
    const link = `${new URL(req.url).origin}/api/elite-claim?token=${eliteLoginToken(sub.id)}`;
    await sendEmail(
      email.trim(),
      "Your Elite guides sign-in link",
      emailLayout("Unlock your Elite guides", `<p style="margin:0 0 14px">Tap the button below to unlock every guide on this device. The link works for 7 days.</p>
<p><a href="${link}" style="display:inline-block;background:#3a9ad9;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">Unlock my guides</a></p>
<p style="margin:14px 0 0;color:#6b7280;font-size:13px">Didn't ask for this? You can ignore this email. Questions? Reply or email ${site.email}.</p>`),
    );
  }
  return NextResponse.json({ ok: true, message: "If that email has an active Elite membership, a sign-in link is on its way. Check your inbox." });
}
