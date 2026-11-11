"use client";
import { useState } from "react";

const goals = ["Lose fat", "Build muscle", "Get stronger", "Improve fitness / endurance", "Body recomposition", "General health"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-black/10 bg-card p-6">
      <legend className="px-2 text-lg font-bold">{title}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Field({ label, name, type = "text", required, placeholder, full }: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string; full?: boolean;
}) {
  return (
    <label className={full ? "sm:col-span-2" : ""}>
      <span className="label">{label}{required && <span className="text-brand"> *</span>}</span>
      <input className="field" name={name} type={type} required={required} placeholder={placeholder} step={type === "number" ? "any" : undefined} />
    </label>
  );
}

function Select({ label, name, options, required }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <label>
      <span className="label">{label}{required && <span className="text-brand"> *</span>}</span>
      <select className="field" name={name} required={required} defaultValue="">
        <option value="" disabled>Choose…</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

function Area({ label, name, placeholder }: { label: string; name: string; placeholder?: string }) {
  return (
    <label className="sm:col-span-2">
      <span className="label">{label}</span>
      <textarea className="field min-h-24" name={name} placeholder={placeholder} />
    </label>
  );
}

export default function IntakeForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string | string[]> = {};
    for (const [k, v] of fd.entries()) {
      const val = String(v);
      if (k in data) data[k] = ([] as string[]).concat(data[k], val);
      else data[k] = val;
    }
    const res = await fetch("/api/intake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setStatus(res.ok ? "done" : "error");
    if (res.ok) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl bg-card p-10 text-center">
        <h2 className="text-2xl font-extrabold">Thanks, got it! 🙌</h2>
        <p className="mt-2 text-black/60">I'll review your answers and message you on WhatsApp within 48 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Section title="About you">
        <Field label="Full name" name="name" required />
        <Field label="WhatsApp number (with country code)" name="phone" type="tel" required placeholder="+1 555 123 4567" />
        <Field label="Email" name="email" type="email" required />
        <Field label="Age" name="age" type="number" required />
        <Select label="Sex" name="sex" options={["Male", "Female", "Prefer not to say"]} />
        <Select label="Units" name="units" options={["lbs / ft-in", "kg / cm"]} required />
        <Field label="Height" name="height" required placeholder={`e.g. 5'10" or 178 cm`} />
        <Field label="Current weight" name="currentWeight" type="number" required />
        <Field label="Goal weight (optional)" name="goalWeight" type="number" />
        <Field label="Estimated body fat % (optional)" name="bodyFat" type="number" />
      </Section>

      <Section title="Your goals">
        <div className="sm:col-span-2">
          <span className="label">What are your main goals? <span className="text-brand">*</span></span>
          <div className="grid gap-2 sm:grid-cols-3">
            {goals.map((g) => (
              <label key={g} className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm">
                <input type="checkbox" name="goals" value={g} className="accent-brand" /> {g}
              </label>
            ))}
          </div>
        </div>
        <Area label="Describe your goal in your own words" name="goalDetail" placeholder="What does success look like in 3–6 months?" />
        <Select label="Timeline" name="timeline" options={["1–3 months", "3–6 months", "6–12 months", "Long term / lifestyle"]} />
        <Select label="Motivation level (1–10)" name="motivation" options={["10", "9", "8", "7", "6", "5", "4 or less"]} />
        <Area label="Why now? What's driving you?" name="why" />
      </Section>

      <Section title="Training">
        <Select label="Training experience" name="experience" options={["Brand new", "Under 1 year", "1–3 years", "3+ years"]} required />
        <Select label="Days per week you can train" name="daysPerWeek" options={["2", "3", "4", "5", "6+"]} required />
        <Select label="Where will you train?" name="equipment" options={["Commercial gym", "Home gym", "Minimal equipment / bodyweight"]} required />
        <Select label="Session length" name="sessionLength" options={["30 min", "45 min", "60 min", "90 min+"]} />
        <Area label="What does your current training look like?" name="currentTraining" />
      </Section>

      <Section title="Nutrition & lifestyle">
        <Select label="Daily activity (outside training)" name="activity" options={["Mostly sitting", "Lightly active", "On my feet a lot", "Physical job"]} />
        <Select label="Average sleep" name="sleep" options={["Under 5 hrs", "5–6 hrs", "7–8 hrs", "8+ hrs"]} />
        <Select label="Stress level" name="stress" options={["Low", "Moderate", "High"]} />
        <Field label="Meals per day" name="mealsPerDay" type="number" />
        <Area label="Dietary preferences, allergies or foods you avoid" name="diet" />
        <Area label="What does a typical day of eating look like?" name="typicalDay" />
      </Section>

      <Section title="Health">
        <Area label="Injuries, medical conditions, or medications I should know about" name="health" />
        <Field label="How did you hear about me?" name="referral" full />
        <label className="flex items-start gap-2 text-sm sm:col-span-2">
          <input type="checkbox" name="consent" value="yes" required className="mt-1 accent-brand" />
          <span>I confirm the information above is accurate and I'm cleared to exercise. I understand coaching is not medical advice. <span className="text-brand">*</span></span>
        </label>
      </Section>

      <button className="btn-primary w-full sm:w-auto" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Submit questionnaire"}
      </button>
      {status === "error" && <p className="text-brand">Something went wrong. Please try again or email me directly.</p>}
    </form>
  );
}
