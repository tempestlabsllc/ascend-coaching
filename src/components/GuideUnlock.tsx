"use client";
import { useState } from "react";

// Email gate for free guides: enter an email, agree to emails, then the download starts.
export default function GuideUnlock({ guideId }: { guideId: string }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const r = await fetch("/api/guide-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, consent, guide: guideId }),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    if (r?.ok && j.url) {
      setStatus("done");
      window.location.href = j.url;
    } else {
      setStatus("error");
      setMsg(j.message || "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return <p className="rounded-xl bg-mist p-3 text-sm font-semibold text-brand-dark">Unlocked! Your download is starting. <a className="underline" href={`/api/download?guide=${guideId}`}>Download again</a></p>;
  }

  return (
    <form id="unlock" onSubmit={submit} className="space-y-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        aria-label="Your email"
        className="field"
      />
      <label className="flex items-start gap-2 text-xs text-black/60">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-brand" />
        <span>Send me the guide and emails from Ascend Coaching and Tempest Labs (tempestlabs.shop). Unsubscribe anytime. See our <a href="/privacy" className="underline">Privacy Policy</a>.</span>
      </label>
      <button className="btn-primary w-full" disabled={status === "sending"}>{status === "sending" ? "Unlocking…" : "Unlock free guide"}</button>
      {status === "error" && <p className="text-sm text-red-600">{msg}</p>}
    </form>
  );
}
