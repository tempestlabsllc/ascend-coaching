"use client";
import { useState } from "react";
import { threeMonth } from "@/config/site";

type Option = { id: string; name: string; monthly: string; threeMonth: string };

export default function SwitchForm({ c, k, options }: { c: string; k: string; options: Option[] }) {
  const [tier, setTier] = useState(options[0]?.id ?? "");
  const [term, setTerm] = useState<"monthly" | "3month">("monthly");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const r = await fetch("/api/manage/switch", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ c, k, tier, term }) }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setStatus(r?.ok ? "sent" : "error");
    setMsg(j.message || "Something went wrong. Please try again.");
  }

  if (status === "sent") return <p className="mt-4 rounded-2xl border border-brand/30 bg-mist p-4 text-black/80">{msg}</p>;
  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o.id} className={`cursor-pointer rounded-2xl border-2 p-4 ${tier === o.id ? "border-brand bg-mist" : "border-black/10 bg-white"}`}>
            <input type="radio" name="tier" value={o.id} checked={tier === o.id} onChange={() => setTier(o.id)} className="sr-only" />
            <span className="block font-bold">{o.name}</span>
            <span className="text-sm text-black/60">{term === "3month" ? o.threeMonth : o.monthly}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-2 text-sm">
        {(["monthly", "3month"] as const).map((t) => (
          <button type="button" key={t} onClick={() => setTerm(t)} className={`rounded-full px-4 py-2 font-semibold ${term === t ? "bg-ink text-white" : "bg-black/5 text-black/70"}`}>{t === "monthly" ? "Monthly" : `3 Months (Save ${threeMonth.discountPercent}%)`}</button>
        ))}
      </div>
      <button className="btn-primary w-full" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Switch From My Next Billing Date"}</button>
      {msg && <p className="text-sm text-red-700">{msg}</p>}
    </form>
  );
}
