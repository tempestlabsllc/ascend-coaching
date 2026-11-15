"use client";
import { useState } from "react";

export default function LoginForm({ wrong }: { wrong: boolean }) {
  const [sending, setSending] = useState(false);
  return (
    <form method="post" action="/admin/auth" onSubmit={() => setSending(true)} className="mt-6 space-y-4">
      <label className="block">
        <span className="label">Password</span>
        <input className="field" type="password" name="password" autoComplete="current-password"
          autoCapitalize="none" autoCorrect="off" spellCheck={false} required />
      </label>
      {wrong && !sending && <p className="text-sm text-red-600">Wrong password. Check for capital letters and try again.</p>}
      <button type="submit" className="btn-primary w-full" aria-busy={sending}>{sending ? "Logging in…" : "Log In"}</button>
    </form>
  );
}
