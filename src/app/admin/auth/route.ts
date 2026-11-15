import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPassword, newSessionToken, sessionCookie } from "@/admin/auth";

// Admin login as a plain form post: works in every phone browser and in-app browser,
// even before the page's JavaScript has loaded.
export async function POST(req: Request) {
  const url = new URL(req.url);
  const origin = req.headers.get("origin");
  const go = (path: string) => NextResponse.redirect(new URL(path, url), 303);
  const hosts = [url.host, req.headers.get("host"), req.headers.get("x-forwarded-host")].filter(Boolean);
  if (origin && origin !== "null" && !hosts.includes(new URL(origin).host)) {
    return go("/admin/login?err=1"); // form posted from another site
  }
  const form = await req.formData().catch(() => null);
  if (!checkPassword(form?.get("password"))) {
    await new Promise((r) => setTimeout(r, 1500)); // slows down password guessing
    return go("/admin/login?err=1");
  }
  const res = go("/admin");
  res.cookies.set(ADMIN_COOKIE, newSessionToken(), sessionCookie);
  return res;
}
