"use client";
import { useState } from "react";

// Elite members enter their code to unlock every guide for free.
export default function EliteUnlock({ unlocked }: { unlocked: boolean }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [msg, setMsg] = useState("");

  if (unlocked) {
    return (
      <div id="elite" className="flex items-center gap-3 rounded-2xl bg-ink px-5 py-4 text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand font-bold">✓</span>
        <p><strong>Elite unlocked.</strong> <span className="text-white/70">Every guide is free for you, including new ones as they come out.</span></p>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const r = await fetch("/api/elite-unlock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) }).catch(() => null);
    if (r?.ok) { window.location.reload(); return; }
    const j = r ? await r.json().catch(() => ({})) : {};
    setStatus("error");
    setMsg(j.message || "Something went wrong. Please try again.");
  }

  return (
    <form id="elite" onSubmit={submit} className="flex flex-col gap-3 rounded-2xl bg-ink p-5 text-white sm:flex-row sm:items-center">
      <p className="flex-1"><strong>Elite member?</strong> <span className="text-white/70">Enter your code to unlock all guides for free.</span></p>
      <div className="flex gap-2">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ELITE-XXXX-XXXX" aria-label="Elite code" className="w-44 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm uppercase text-white outline-none placeholder:text-white/40 focus:border-brand" required />
        <button className="btn-primary px-5 py-2 text-sm" disabled={status === "sending"}>{status === "sending" ? "…" : "Unlock"}</button>
      </div>
      {status === "error" && <p className="text-sm text-[#ff8a98] sm:basis-full">{msg}</p>}
    </form>
  );
}
