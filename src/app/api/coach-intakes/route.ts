import { createHash, timingSafeEqual } from "node:crypto";
import { readRecords, storeConfigured } from "@/store";

export const dynamic = "force-dynamic";

// Read-only feed of intake questionnaires, for a helper (like Claude) that writes coaching
// suggestions. It is locked by its own key, INTAKE_READ_KEY in Vercel (at least 24 characters),
// which is separate from ADMIN_PASSWORD. It can only read intake answers: no payments, clients,
// check-ins, leads or settings, and it cannot change anything. Phone numbers and email addresses
// are left out. To revoke it, delete or change INTAKE_READ_KEY in Vercel and redeploy.
// Without the key set, the endpoint does not exist (404).
const MIN_LENGTH = 24;
const sha = (s: string) => createHash("sha256").update(s).digest();
const HIDDEN = new Set(["email", "phone", "waiver", "form"]);

function authorized(req: Request) {
  const key = process.env.INTAKE_READ_KEY ?? "";
  if (key.length < MIN_LENGTH) return false;
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  return given.length > 0 && timingSafeEqual(sha(given), sha(key));
}

export async function GET(req: Request) {
  if (!authorized(req)) return new Response("Not found", { status: 404 });
  if (!storeConfigured()) return Response.json({ intakes: [] }, { headers: { "Cache-Control": "no-store" } });
  const intakes = (await readRecords("forms"))
    .filter((f) => f.form === "intake")
    .map((f) => {
      const answers = Object.fromEntries(Object.entries(f).filter(([k]) => !HIDDEN.has(k)));
      // First name only, plus a short stable reference so repeat submissions can be matched up.
      answers.name = String(f.name ?? "").trim().split(/\s+/)[0] || "Unknown";
      const ref = typeof f.email === "string" ? createHash("sha256").update(f.email.toLowerCase()).digest("hex").slice(0, 8) : "";
      return { ref, ...answers };
    });
  return Response.json({ intakes }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
