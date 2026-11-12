import { appendFile } from "node:fs/promises";
import { site } from "@/config/site";

// Sends a form submission to the coach: INTAKE_WEBHOOK_URL if set (Zapier, Make,
// Google Sheets...), otherwise emailed to INTAKE_EMAIL / the site email via
// FormSubmit.co. In local development it is saved to intake-submissions.jsonl.
export async function forwardSubmission(subject: string, data: Record<string, unknown>, replyTo?: string) {
  const submission: Record<string, unknown> = { ...data, submittedAt: new Date().toISOString() };
  for (const [k, v] of Object.entries(submission)) if (Array.isArray(v)) submission[k] = v.join(", ");

  const hook = process.env.INTAKE_WEBHOOK_URL;
  const to = process.env.INTAKE_EMAIL || site.email;
  const isDev = process.env.NODE_ENV !== "production" && !process.env.INTAKE_SEND_IN_DEV;

  if (hook) {
    const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject, ...submission }) });
    return r.ok;
  }
  if (!isDev) {
    const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ _subject: subject, ...(replyTo ? { _replyto: replyTo } : {}), _template: "table", ...submission }),
    });
    return r.ok;
  }
  await appendFile("intake-submissions.jsonl", JSON.stringify({ subject, ...submission }) + "\n").catch(() => {});
  console.log("[form]", subject, submission);
  return true;
}
