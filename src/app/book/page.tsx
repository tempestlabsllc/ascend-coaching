import Link from "next/link";
import { site } from "@/config/site";
import BookingEmbed from "@/components/BookingEmbed";

export const metadata = { title: "Book a call" };

export default function BookPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-extrabold">Book a free discovery call</h1>
      <p className="mt-2 text-black/60">30 minutes to talk through your goals and see which plan fits. Want to save time on the call? <Link href="/intake" className="underline">Fill in the questionnaire</Link> first.</p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 bg-card">
        {/* Works with Cal.com or Calendly links. Set NEXT_PUBLIC_BOOKING_URL. */}
        <BookingEmbed url={site.bookingUrl} />
      </div>
      <p className="mt-3 text-sm text-black/50">Calendar not loading? <a className="underline" href={site.bookingUrl} target="_blank" rel="noreferrer">Open it in a new tab</a>.</p>
    </div>
  );
}
