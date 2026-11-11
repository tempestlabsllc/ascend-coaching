"use client";
import { useState } from "react";

const scale = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

function Row({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={full ? "sm:col-span-2" : ""}><span className="label">{label}</span>{children}</label>;
}
function Rate({ label, name }: { label: string; name: string }) {
  return (
    <Row label={`${label} (1–10)`}>
      <select className="field" name={name} defaultValue="" required>
        <option value="" disabled>Choose…</option>
        {scale.map((n) => <option key={n}>{n}</option>)}
      </select>
    </Row>
  );
}

export default function CheckInForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/intake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ form: "check-in", ...data }) });
    setStatus(res.ok ? "done" : "error");
    if (res.ok) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl bg-card p-10 text-center">
        <h2 className="text-2xl font-extrabold">Check-in received 💪</h2>
        <p className="mt-2 text-black/60">I'll review it and reply with your adjustments soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset className="grid gap-4 rounded-2xl border border-black/10 bg-card p-6 sm:grid-cols-2">
        <Row label="Full name *"><input className="field" name="name" required /></Row>
        <Row label="Email *"><input className="field" name="email" type="email" required /></Row>
        <Row label="Current weight *"><input className="field" name="weight" type="number" step="any" required /></Row>
        <Row label="Waist measurement (optional)"><input className="field" name="waist" placeholder="e.g. 32 in or 81 cm" /></Row>
        <Row label="Workouts completed vs planned *"><input className="field" name="workouts" required placeholder="e.g. 4 of 4" /></Row>
        <Rate label="Nutrition: how well you hit your targets" name="nutrition" />
        <Rate label="Sleep quality" name="sleep" />
        <Rate label="Energy" name="energy" />
        <Rate label="Stress (10 = very stressed)" name="stress" />
        <Row label="Biggest win this week" full><textarea className="field min-h-20" name="win" /></Row>
        <Row label="Biggest struggle" full><textarea className="field min-h-20" name="struggle" /></Row>
        <Row label="Questions for your coach" full><textarea className="field min-h-20" name="questions" /></Row>
      </fieldset>
      <button className="btn-primary w-full sm:w-auto" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Submit check-in"}</button>
      {status === "error" && <p className="text-brand">Something went wrong. Please try again or email me directly.</p>}
    </form>
  );
}
