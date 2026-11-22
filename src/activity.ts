import { site } from "@/config/site";
import { saveRecord, firstTime } from "@/store";
import { sendEmail, emailLayout, esc, alertRecipients } from "@/email";

// Everything that happens on the site lands in the /admin Activity feed. The important
// ones also email the coach right away (see alertRecipients in src/email.ts).
export type ActivityType = "purchase" | "booking" | "intake" | "check-in" | "lead" | "cancel" | "payment-failed" | "plan-change";
const ALERT: ActivityType[] = ["purchase", "booking", "intake", "check-in", "cancel", "payment-failed", "plan-change"];

export async function logActivity(type: ActivityType, title: string, detail: string, opts: { alert?: boolean; link?: string; key?: string } = {}) {
  if (opts.key && !(await firstTime(`activity:${opts.key}`))) return; // already logged (e.g. a Stripe retry)
  await saveRecord("activity", { type, title, detail });
  if (opts.alert ?? ALERT.includes(type)) {
    const to = alertRecipients();
    const link = `${site.url}${opts.link ?? "/admin?tab=activity"}`;
    await sendEmail(to, `🔔 ${title}`, emailLayout(title, `<p style="margin:0 0 14px">${esc(detail)}</p>
<p><a href="${link}" style="display:inline-block;background:#3a9ad9;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px">Open admin</a></p>`)).catch(() => false);
  }
}
