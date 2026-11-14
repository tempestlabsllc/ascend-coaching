import { NextResponse } from "next/server";
import { forwardSubmission } from "@/forward";
import { saveRecord } from "@/store";
import { logActivity } from "@/activity";

// Questionnaire and check-in answers are emailed to the coach (see src/forward.ts).
// The very first FormSubmit email asks you to click "Activate" once.
export async function POST(req: Request) {
  const data = await req.json().catch(() => null);
  if (!data || typeof data !== "object" || !data.email || !data.name) {
    return NextResponse.json({ ok: false, message: "Name and email are required." }, { status: 400 });
  }
  const formName = data.form === "check-in" ? "Weekly check-in" : "New intake questionnaire";
  const saved = await saveRecord("forms", { ...data, form: data.form === "check-in" ? "check-in" : "intake" });
  const ok = (await forwardSubmission(`${formName}: ${data.name}`, data, String(data.email)).catch(() => false)) || saved;
  if (ok) {
    const isCheckIn = data.form === "check-in";
    await logActivity(isCheckIn ? "check-in" : "intake", `${isCheckIn ? "Check-in" : "New intake"}: ${String(data.name).slice(0, 80)}`,
      String(data.email).slice(0, 120), { link: `/admin?tab=forms&q=${encodeURIComponent(String(data.email))}` });
  }
  return NextResponse.json({ ok }, { status: ok ? 200 : 502 });
}
