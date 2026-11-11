import Link from "next/link";
import { site } from "@/config/site";

export const metadata = { title: "Book a call" };

export default function BookPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-extrabold">Book a free discovery call</h1>
      <p className="mt-2 text-white/60">30 minutes to talk through your goals and see which plan fits. Want to save time on the call? <Link href="/intake" className="underline">Fill in the questionnaire</Link> first.</p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-card">
        {/* Works with Cal.com or Calendly links. Set NEXT_PUBLIC_BOOKING_URL. */}
        <iframe src={`${site.bookingUrl}?hide_gdpr_banner=1&background_color=151314&text_color=f2f4f4&primary_color=e0115f`} title="Booking calendar" className="h-[720px] w-full" />
      </div>
      <p className="mt-3 text-sm text-white/50">Calendar not loading? <a className="underline" href={site.bookingUrl} target="_blank" rel="noreferrer">Open it in a new tab</a>.</p>
    </div>
  );
}
