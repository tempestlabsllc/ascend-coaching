"use client";
import { useState } from "react";
import { threeMonth } from "@/config/site";

type Option = { id: string; name: string; monthly: string; threeMonth: string };
type Props = { c: string; k: string; options: Option[]; currentTier?: string; currentTerm?: string; cancelling: boolean; pending: string | null };

export default function SwitchForm({ c, k, options, currentTier, currentTerm, cancelling, pending }: Props) {
  const [tier, setTier] = useState(options.find((o) => o.id !== currentTier)?.id ?? options[0]?.id ?? "");
  const [term, setTerm] = useState<"monthly" | "3month">(currentTerm === "3month" ? "3month" : "monthly");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);

  async function send(action: string) {
    setStatus("sending");
    const r = await fetch("/api/manage/switch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ c, k, action, tier, term }) }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setStatus(r?.ok ? "sent" : "error");
    setMsg(j.message || "Something went wrong. Please try again.");
  }

  if (status === "sent") return <p className="mt-6 rounded-2xl border border-brand/30 bg-mist p-4 text-black/80">{msg}</p>;
  const isCurrent = tier === currentTier && term === (currentTerm === "3month" ? "3month" : "monthly");

  return (
    <>
      {pending && (
        <div className="mt-6 rounded-2xl border border-brand/30 bg-mist p-4 text-sm text-black/80">
          <p>{pending}</p>
          <button type="button" onClick={() => send("undo-switch")} className="mt-2 font-semibold text-brand-dark underline" disabled={status === "sending"}>Keep My Current Plan Instead</button>
        </div>
      )}
      {cancelling && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p>Your plan is set to cancel at the end of this billing period.</p>
          <button type="button" onClick={() => send("undo-cancel")} className="mt-2 font-semibold underline" disabled={status === "sending"}>Keep My Plan Active</button>
        </div>
      )}

      <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6">
        <h2 className="text-xl font-bold">Switch Plans</h2>
        <p className="mt-1 text-sm text-black/60">Pick your new plan. It starts on your next billing date, and you stay on your current plan until then.</p>
        <form onSubmit={(e) => { e.preventDefault(); send("switch"); }} className="mt-4 space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map((o) => (
              <label key={o.id} className={`cursor-pointer rounded-2xl border-2 p-4 ${tier === o.id ? "border-brand bg-mist" : "border-black/10 bg-white"}`}>
                <input type="radio" name="tier" value={o.id} checked={tier === o.id} onChange={() => setTier(o.id)} className="sr-only" />
                <span className="block font-bold">{o.name}{o.id === currentTier && <span className="ml-2 rounded-full bg-black/5 px-2 py-0.5 text-xs font-semibold text-black/60">Current</span>}</span>
                <span className="text-sm text-black/60">{term === "3month" ? o.threeMonth : o.monthly}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 text-sm">
            {(["monthly", "3month"] as const).map((t) => (
              <button type="button" key={t} onClick={() => setTerm(t)} className={`rounded-full px-4 py-2 font-semibold ${term === t ? "bg-ink text-white" : "bg-black/5 text-black/70"}`}>{t === "monthly" ? "Monthly" : `3 Months (Save ${threeMonth.discountPercent}%)`}</button>
            ))}
          </div>
          <button className="btn-primary w-full" disabled={status === "sending" || isCurrent}>{status === "sending" ? "Working…" : isCurrent ? "This Is Your Current Plan" : "Switch From My Next Billing Date"}</button>
        </form>
      </section>

      {!cancelling && (
        <section className="mt-6 rounded-3xl border border-black/10 bg-white p-6">
          <h2 className="text-xl font-bold">Cancel My Plan</h2>
          <p className="mt-1 text-sm text-black/60">You won&apos;t be charged again, and your coaching continues until the end of the period you&apos;ve paid for.</p>
          {confirmCancel ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => send("cancel")} className="btn rounded-full bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700" disabled={status === "sending"}>{status === "sending" ? "Working…" : "Yes, Cancel My Plan"}</button>
              <button type="button" onClick={() => setConfirmCancel(false)} className="btn-outline">Keep My Plan</button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmCancel(true)} className="btn-outline mt-4">Cancel My Plan</button>
          )}
        </section>
      )}
      {msg && status === "error" && <p className="mt-3 text-sm text-red-700">{msg}</p>}
    </>
  );
}
