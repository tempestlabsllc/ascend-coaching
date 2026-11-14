"use client";
import { useEffect, useState } from "react";

// Calendly inline embed. When someone books, Calendly tells this page and we log it
// to the admin Activity feed (see /api/booked).
export default function BookingEmbed({ url }: { url: string }) {
  const [src, setSrc] = useState(`${url}?hide_gdpr_banner=1&background_color=ffffff&text_color=16181d&primary_color=3a9ad9`);
  useEffect(() => {
    setSrc((s) => `${s}&embed_type=Inline&embed_domain=${encodeURIComponent(window.location.host)}`);
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com" || e.data?.event !== "calendly.event_scheduled") return;
      const p = e.data.payload ?? {};
      fetch("/api/booked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitee: p.invitee?.uri, event: p.event?.uri }),
        keepalive: true,
      }).catch(() => {});
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  return <iframe src={src} title="Booking calendar" className="h-[720px] w-full" />;
}
