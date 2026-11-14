import { NextResponse } from "next/server";
import { isEliteCode, ELITE_COOKIE } from "@/elite";

// Elite members enter their code to unlock every guide (current and future) for free.
export async function POST(req: Request) {
  const { code } = await req.json().catch(() => ({}));
  if (!isEliteCode(code)) {
    return NextResponse.json({ ok: false, message: "That code isn't valid. Check your Elite welcome email." }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ELITE_COOKIE, "1", { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}
