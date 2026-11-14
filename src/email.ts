import { site } from "@/config/site";

// Sends an email through Resend's HTTP API. No-op (returns false) until
// RESEND_API_KEY and EMAIL_FROM are set in Vercel.
export async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.warn("Email not sent: RESEND_API_KEY / EMAIL_FROM not set");
    return false;
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html, reply_to: site.email }),
  });
  if (!r.ok) console.error("Resend error", r.status, await r.text().catch(() => ""));
  return r.ok;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

// Simple branded email shell.
export function emailLayout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#f4f9fc;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#16181d">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e3eef6">
<tr><td style="background:#0a0a0a;padding:20px 28px;color:#fff;font-weight:800;letter-spacing:.08em;font-size:18px">ASCEND <span style="color:#3a9ad9;font-size:11px;letter-spacing:.4em">COACHING</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 16px;font-size:22px">${esc(title)}</h1>
${body}
<p style="margin:28px 0 0;color:#6b7280;font-size:13px">Questions? Just reply to this email or message me on Trainerize or WhatsApp.<br>${esc(site.name)} · <a href="${site.url}" style="color:#2378b5">${site.url.replace("https://", "")}</a></p>
</td></tr></table></td></tr></table></body></html>`;
}
export { esc };
