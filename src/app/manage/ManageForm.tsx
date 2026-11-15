"use client";
import { useState } from "react";

export default function ManageForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const r = await fetch("/api/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setStatus(r?.ok ? "sent" : "error");
    setMsg(j.message || "Something went wrong. Please try again.");
  }

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
      {status !== "sent" && (
        <>
          <input type="text" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email or phone number" aria-label="Checkout email or phone number" required
            className="flex-1 rounded-full border border-black/15 bg-white px-5 py-3 outline-none focus:border-brand" />
          <button className="btn-primary" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Email Me a Link"}</button>
        </>
      )}
      {msg && <p className={`text-sm sm:basis-full ${status === "sent" ? "text-brand-dark" : "text-red-700"}`}>{msg}</p>}
    </form>
  );
}
