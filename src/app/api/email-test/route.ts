import { site } from "@/config/site";
import { sendEmailDetailed, emailLayout } from "@/email";

// Open /api/email-test in a browser to check that emails work. It only ever sends to
// the business inbox (site.email), at most once a minute, and shows Resend's answer.
let last = 0;

export const dynamic = "force-dynamic";

export async function GET() {
  const page = (title: string, body: string, ok: boolean) =>
    new Response(
      `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Email test</title>
<body style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:520px;margin:48px auto;padding:0 16px;color:#16181d">
<h1 style="font-size:26px">${ok ? "✅" : "❌"} ${title}</h1><p style="font-size:17px;line-height:1.5">${body}</p></body>`,
      { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
    );

  if (Date.now() - last < 60_000) return page("Slow down", "A test email was sent less than a minute ago. Check your inbox, or try again in a minute.", false);
  last = Date.now();

  const res = await sendEmailDetailed(
    site.email,
    "Ascend Coaching test email ✅",
    emailLayout("Emails are working", `<p style="margin:0">This is a test from ascendcoaching.pro. Purchase confirmations, Elite unlock links and new-sale alerts will be sent the same way.</p>`),
  );
  return res.ok
    ? page("Test email sent", `Sent to ${site.email}. Check that inbox (and the spam folder) in the next minute.`, true)
    : page("Email didn't send", res.error ?? "Unknown error.", false);
}
