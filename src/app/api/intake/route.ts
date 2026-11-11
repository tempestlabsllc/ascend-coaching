import { NextResponse } from "next/server";
import { appendFile } from "node:fs/promises";
import { site } from "@/config/site";

// Questionnaire answers are emailed to INTAKE_EMAIL (defaults to the site email)
// via FormSubmit.co, which needs no account. The very first submission sends an
// activation email to that inbox: click "Activate" once and every answer after
// that arrives as an email. Set INTAKE_WEBHOOK_URL instead to send them to
// Zapier, Make, a Google Sheet script, etc.
export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data || typeof data !== "object" || !data.email || !data.name) {
    return NextResponse.json({ ok: false, message: "Name and email are required." }, { status: 400 });
  }
  const formName = data.form === "check-in" ? "Weekly check-in" : "New intake questionnaire";
  const submission: Record<string, unknown> = { ...data, submittedAt: new Date().toISOString() };
  for (const [k, v] of Object.entries(submission)) if (Array.isArray(v)) submission[k] = v.join(", ");

  const hook = process.env.INTAKE_WEBHOOK_URL;
  const to = process.env.INTAKE_EMAIL || site.email;
  const isDev = process.env.NODE_ENV !== "production" && !process.env.INTAKE_SEND_IN_DEV;

  if (hook) {
    const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(submission) });
    if (!r.ok) return NextResponse.json({ ok: false }, { status: 502 });
  } else if (!isDev) {
    const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `${formName}: ${submission.name}`,
        _replyto: submission.email,
        _template: "table",
        ...submission,
      }),
    });
    if (!r.ok) return NextResponse.json({ ok: false }, { status: 502 });
  } else {
    // Local development: save to a file instead of emailing.
    await appendFile("intake-submissions.jsonl", JSON.stringify(submission) + "\n").catch(() => {});
    console.log("[intake]", submission);
  }
  return NextResponse.json({ ok: true });
}
