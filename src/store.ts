// Tiny datastore for form answers and guide-signup leads, so they show up in /admin.
// Uses Upstash Redis over its REST API (no extra packages). Add it in Vercel under
// Storage → Upstash (Redis); Vercel then sets KV_REST_API_URL and KV_REST_API_TOKEN.
// Without it, nothing is stored and forms keep working exactly as before (email only).
const url = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const storeConfigured = () => !!(url() && token());

const KEEP = 5000; // newest entries kept per list

async function redis(commands: (string | number)[][]) {
  const r = await fetch(`${url()}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`Storage error ${r.status}`);
  return (await r.json()) as { result?: unknown; error?: string }[];
}

export type Stored = Record<string, unknown> & { savedAt: string };
export type ListName = "forms" | "leads";

export async function saveRecord(list: ListName, data: Record<string, unknown>) {
  if (!storeConfigured()) return false;
  try {
    const rec: Stored = { ...data, savedAt: new Date().toISOString() };
    if (JSON.stringify(rec).length > 50_000) return false; // ignore oversized junk
    await redis([["LPUSH", `ac:${list}`, JSON.stringify(rec)], ["LTRIM", `ac:${list}`, 0, KEEP - 1]]);
    return true;
  } catch (e) {
    console.error("saveRecord failed", e);
    return false;
  }
}

export async function readRecords(list: ListName, limit = KEEP): Promise<Stored[]> {
  if (!storeConfigured()) return [];
  const [res] = await redis([["LRANGE", `ac:${list}`, 0, limit - 1]]);
  if (res?.error) throw new Error(res.error);
  return ((res?.result as string[]) ?? []).flatMap((s) => {
    try { return [JSON.parse(s) as Stored]; } catch { return []; }
  });
}
