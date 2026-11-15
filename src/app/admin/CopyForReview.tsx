"use client";
import { useState } from "react";

// Copies one form's answers as plain text (no email or phone, first name only) so it can be
// pasted into a chat with an assistant for coaching suggestions.
export default function CopyForReview({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement("textarea");
      t.value = text; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
    }
    setDone(true); setTimeout(() => setDone(false), 2000);
  };
  return (
    <button type="button" onClick={copy} className="btn-outline !px-4 !py-2 text-sm">
      {done ? "Copied ✓" : "Copy for review"}
    </button>
  );
}
