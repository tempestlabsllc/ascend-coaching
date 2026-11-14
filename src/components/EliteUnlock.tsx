"use client";
import { useEffect, useState } from "react";

// Elite members: guides unlock automatically after checkout. On another device,
// they enter their checkout email and get a sign-in link.
export default function EliteUnlock({ unlocked, notice }: { unlocked: boolean; notice?: "expired" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [msg, setMsg] = useState(notice === "expired" ? "That link has expired or the membership isn't active. Request a new one below." : "");

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
    const r = await fetch("/api/elite-login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setStatus(r?.ok ? "sent" : "error");
    setMsg(j.message || "Something went wrong. Please try again.");
  }

  return (
    <form id="elite" onSubmit={submit} className="flex flex-col gap-3 rounded-2xl bg-ink p-5 text-white sm:flex-row sm:items-center">
      <p className="flex-1"><strong>Elite member?</strong> <span className="text-white/70">Enter your checkout email and we&apos;ll send a link that unlocks every guide on this device.</span></p>
      {status !== "sent" && (
        <div className="flex gap-2">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" aria-label="Checkout email" className="w-52 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-brand" required />
          <button className="btn-primary px-5 py-2 text-sm" disabled={status === "sending"}>{status === "sending" ? "…" : "Send link"}</button>
        </div>
      )}
      {msg && <p className={`text-sm sm:basis-full ${status === "sent" ? "text-[#89cff0]" : "text-[#ff8a98]"}`}>{msg}</p>}
    </form>
  );
}

// Thank-you page helper: unlocks guides on this device right after an Elite checkout.
export function EliteAutoUnlock({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<"working" | "done" | "failed">("working");
  useEffect(() => {
    fetch("/api/elite-claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ session_id: sessionId }) })
      .then((r) => setState(r.ok ? "done" : "failed"))
      .catch(() => setState("failed"));
  }, [sessionId]);
  return (
    <div className="mx-auto mt-4 max-w-lg rounded-2xl bg-ink p-5 text-left text-white">
      <p className="text-xs font-bold uppercase tracking-widest text-[#89cff0]">Elite perk</p>
      <p className="mt-1 text-lg font-bold">
        {state === "working" ? "Unlocking all guides…" : state === "done" ? "All guides are unlocked for you." : "Your guides are almost ready."}
      </p>
      <p className="mt-1 text-sm text-white/70">
        {state === "failed"
          ? "Use the sign-in link in your welcome email, or enter your checkout email on the Guides page."
          : "Every guide is free while your Elite membership is active, including new ones. On another device, use the sign-in link in your welcome email."}
      </p>
      <a href="/shop" className="mt-3 inline-block text-sm font-bold text-[#89cff0] underline">Go to the guides</a>
    </div>
  );
}
