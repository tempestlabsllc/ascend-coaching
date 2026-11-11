"use client";
import { useState } from "react";

export default function BuyButton({
  kind, id, label, className = "btn-primary w-full",
}: { kind: "tier" | "guide"; id: string; label: string; className?: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function go() {
    setLoading(true); setMsg(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setMsg(data.message || "Something went wrong.");
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={go} disabled={loading} className={className}>
        {loading ? "Loading…" : label}
      </button>
      {msg && <p className="mt-2 text-sm text-brand">{msg}</p>}
    </div>
  );
}
