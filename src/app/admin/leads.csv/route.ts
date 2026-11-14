import { isAdmin } from "@/admin/auth";
import { readRecords } from "@/store";
import { guides } from "@/config/site";

export const dynamic = "force-dynamic";

const cell = (v: string) => `"${v.replace(/"/g, '""').replace(/^([=+\-@])/, "'$1")}"`;

// Lead list as a spreadsheet file (opens in Excel, Google Sheets, Mailchimp import, etc).
export async function GET() {
  if (!(await isAdmin())) return new Response("Not found", { status: 404 });
  const leads = await readRecords("leads");
  const rows = new Map<string, { first: string; guides: Set<string> }>();
  for (const l of [...leads].reverse()) {
    if (typeof l.email !== "string") continue;
    const r = rows.get(l.email) ?? { first: l.savedAt, guides: new Set<string>() };
    if (typeof l.guide === "string") r.guides.add(guides.find((g) => g.id === l.guide)?.title ?? l.guide);
    rows.set(l.email, r);
  }
  const csv = ["email,signed_up,guides", ...[...rows].map(([e, r]) => [e, r.first.slice(0, 10), [...r.guides].join("; ")].map(cell).join(","))].join("\n");
  return new Response(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="ascend-leads.csv"', "Cache-Control": "no-store" },
  });
}
