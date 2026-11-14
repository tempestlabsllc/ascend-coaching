"use client";
import { useEffect } from "react";

// Opening the Activity tab clears the "new" count for next time (this view keeps its badges).
export default function MarkSeen() {
  useEffect(() => { fetch("/admin/seen", { method: "POST" }).catch(() => {}); }, []);
  return null;
}
