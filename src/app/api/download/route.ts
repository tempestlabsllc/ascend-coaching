import { readFile } from "node:fs/promises";
import path from "node:path";
import { guides } from "@/config/site";
import { stripe } from "@/lib";

// Serves a guide PDF from /private-guides. Free guides download directly;
// paid guides require a paid Stripe Checkout session for that guide.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const guide = guides.find((g) => g.id === url.searchParams.get("guide"));
  if (!guide || guide.comingSoon) return new Response("Not found", { status: 404 });

  if (guide.priceCents > 0) {
    const sessionId = url.searchParams.get("session_id");
    if (!stripe || !sessionId) return new Response("Purchase required", { status: 403 });
    const s = await stripe.checkout.sessions.retrieve(sessionId).catch(() => null);
    if (!s || s.payment_status !== "paid" || s.metadata?.id !== guide.id) {
      return new Response("Purchase required", { status: 403 });
    }
  }

  try {
    const file = await readFile(path.join(process.cwd(), "private-guides", guide.file));
    return new Response(file, {
      headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${guide.file}"` },
    });
  } catch {
    return new Response("This guide is coming soon. Check back shortly!", { status: 404 });
  }
}
