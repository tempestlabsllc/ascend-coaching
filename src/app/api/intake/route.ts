import { NextResponse } from "next/server";
import { forwardSubmission } from "@/forward";
import { saveRecord } from "@/store";

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
  return NextResponse.json({ ok }, { status: ok ? 200 : 502 });
}
