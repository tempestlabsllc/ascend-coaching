"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { stripe } from "@/lib";
import { site } from "@/config/site";
import { ADMIN_COOKIE, checkPassword, isAdmin, newSessionToken, sessionCookie } from "@/admin/auth";

const back = (msg: string, err = false): never => redirect(`/admin?${err ? "err" : "msg"}=${encodeURIComponent(msg)}#discounts`);

async function guard() {
  if (!(await isAdmin())) redirect("/admin/login");
  if (!stripe) back("Stripe isn't connected (STRIPE_SECRET_KEY is missing).", true);
  return stripe!;
}

const stripeMsg = (e: unknown) => (e && typeof e === "object" && "message" in e ? String((e as Error).message) : "Something went wrong.");

export async function login(form: FormData) {
  if (!checkPassword(form.get("password"))) {
    await new Promise((r) => setTimeout(r, 1500)); // slows down password guessing
    redirect("/admin/login?err=1");
  }
  (await cookies()).set(ADMIN_COOKIE, newSessionToken(), sessionCookie);
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export async function setDiscountActive(form: FormData) {
  const s = await guard();
  const id = String(form.get("id") ?? "");
  const active = form.get("active") === "true";
  try {
    const p = await s.promotionCodes.update(id, { active });
    back(`${p.code} is now ${active ? "on" : "off"}.`);
  } catch (e) {
    if (isRedirect(e)) throw e;
    back(stripeMsg(e), true);
  }
}

// Create a new code, or "edit" one: Stripe doesn't allow changing a discount's amount,
// so editing turns the old code off and makes a fresh one with the new settings.
export async function saveDiscount(form: FormData) {
  const s = await guard();
  const f = (k: string) => String(form.get(k) ?? "").trim();
  const code = f("code").toUpperCase();
  const replaceId = f("replace");
  const kind = f("kind");
  const value = Number(f("value"));
  const duration = f("duration") as "once" | "forever" | "repeating";
  const months = Number(f("months"));
  const maxUses = f("max") ? Number(f("max")) : undefined;
  const expires = f("expires");
  const firstTime = form.get("first_time") === "on";

  if (!/^[A-Z0-9-]{3,30}$/.test(code)) back("Code must be 3 to 30 letters, numbers or dashes.", true);
  if (!(value > 0) || (kind === "percent" && value > 100)) back("Enter a discount amount above 0 (percent max 100).", true);
  if (!["once", "forever", "repeating"].includes(duration)) back("Pick how long the discount lasts.", true);
  if (duration === "repeating" && !(Number.isInteger(months) && months >= 1 && months <= 36)) back("Enter 1 to 36 months.", true);
  if (maxUses !== undefined && !(Number.isInteger(maxUses) && maxUses >= 1)) back("Max uses must be a whole number, 1 or more.", true);
  let expiresAt: number | undefined;
  if (expires) {
    expiresAt = Math.floor(new Date(`${expires}T23:59:59Z`).getTime() / 1000);
    if (!(expiresAt > Date.now() / 1000)) back("The end date must be in the future.", true);
  }

  let old: Stripe.PromotionCode | null = null;
  let couponId = "";
  try {
    if (replaceId) {
      old = await s.promotionCodes.retrieve(replaceId);
      if (old.active) await s.promotionCodes.update(replaceId, { active: false });
    }
    const coupon = await s.coupons.create({
      name: code,
      ...(kind === "percent" ? { percent_off: value } : { amount_off: Math.round(value * 100), currency: site.currency }),
      duration,
      ...(duration === "repeating" ? { duration_in_months: months } : {}),
      metadata: { created_by: "ascend-admin" },
    });
    couponId = coupon.id;
    await s.promotionCodes.create({
      promotion: { type: "coupon", coupon: coupon.id },
      code,
      ...(maxUses ? { max_redemptions: maxUses } : {}),
      ...(expiresAt ? { expires_at: expiresAt } : {}),
      ...(firstTime ? { restrictions: { first_time_transaction: true } } : {}),
      metadata: { created_by: "ascend-admin", ...(replaceId ? { replaces: replaceId } : {}) },
    });
  } catch (e) {
    if (isRedirect(e)) throw e;
    if (couponId) await s.coupons.del(couponId).catch(() => {}); // don't leave an unused coupon behind
    if (old?.active) await s.promotionCodes.update(old.id, { active: true }).catch(() => {}); // put the old one back
    back(stripeMsg(e), true);
  }
  back(replaceId ? `${code} updated.` : `${code} created and live.`);
}

function isRedirect(e: unknown) {
  return !!e && typeof e === "object" && "digest" in e && String((e as { digest: unknown }).digest).startsWith("NEXT_REDIRECT");
}
