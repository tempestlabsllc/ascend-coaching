import { NextResponse } from "next/server";
import { logActivity } from "@/activity";
import { firstTime } from "@/store";

const INVITEE = /^https:\/\/api\.calendly\.com\/scheduled_events\/[\w-]{6,64}\/invitees\/[\w-]{6,64}$/;
const EVENT = /^https:\/\/api\.calendly\.com\/scheduled_events\/[\w-]{6,64}$/;

// The Book page calls this when Calendly says a call was booked. With CALENDLY_TOKEN
// (Calendly → Integrations → API & Webhooks → personal access token) we look up the
// booking to get the name, email and time, and only then send the email alert, so a
// fake request can't spam you. Without it, the booking still shows in the feed.
export async function POST(req: Request) {
  const { invitee, event } = await req.json().catch(() => ({}));
  if (typeof invitee !== "string" || !INVITEE.test(invitee)) return NextResponse.json({ ok: false }, { status: 400 });
  const eventUri = typeof event === "string" && EVENT.test(event) ? event : null;

  if (!(await firstTime(`booking:${invitee}`))) return NextResponse.json({ ok: true });
  const token = process.env.CALENDLY_TOKEN;
  if (token) {
    const get = (u: string) => fetch(u, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    const [inv, ev] = await Promise.all([get(invitee), eventUri ? get(eventUri) : null]);
    if (!inv?.resource) return NextResponse.json({ ok: false }, { status: 400 });
    const r = inv.resource;
    const start = ev?.resource?.start_time
      ? new Date(ev.resource.start_time).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: process.env.ADMIN_TIMEZONE || "America/New_York" })
      : "";
    await logActivity("booking", `Call booked: ${r.name ?? "New client"}`, `${r.name ?? ""} · ${r.email ?? ""}${start ? ` · ${start}` : ""}`, { alert: true });
  } else {
    await logActivity("booking", "Call booked", "Someone booked a discovery call. See Calendly for their details.", { alert: false });
  }
  return NextResponse.json({ ok: true });
}
