import { NextResponse } from "next/server";
import { isAdmin, sessionCookie } from "@/admin/auth";

// Remembers when the Activity tab was last opened, for the "new" count.
export async function POST() {
  if (!(await isAdmin())) return new Response("Not found", { status: 404 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("ac_admin_seen", new Date().toISOString(), { ...sessionCookie, maxAge: 60 * 60 * 24 * 365 });
  return res;
}
