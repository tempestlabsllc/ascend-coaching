import { site } from "@/config/site";
import { LegalPage } from "@/components/Legal";

export const metadata = { title: "Refunds & Cancellations" };

export default function Refunds() {
  return (
    <LegalPage title="Refunds & Cancellations" updated="November 11, 2026">
      <section>
        <h2>Cancelling your plan</h2>
        <p>You can cancel your coaching subscription at any time{site.manageSubscriptionUrl ? <> from the <a className="underline" href={site.manageSubscriptionUrl}>Manage subscription</a> page</> : null} or by emailing <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>. Cancellation stops future payments. Your coaching continues until the end of the month you have already paid for.</p>
      </section>
      <section>
        <h2>Refunds on coaching</h2>
        <ul>
          <li><b>First purchase:</b> if you change your mind within 48 hours of your first payment and your plan has not been delivered yet, email us for a full refund.</li>
          <li><b>After that:</b> payments are non-refundable once your plan has been delivered or the billing month has started, and we do not give partial-month refunds.</li>
          <li><b>Billing mistakes:</b> if you were charged in error, such as a double charge or a charge after cancelling, contact us and we will refund it.</li>
        </ul>
      </section>
      <section>
        <h2>Digital guides</h2>
        <p>Because guides are delivered instantly as downloads, paid guides are non-refundable once purchased, unless the file is faulty and we cannot fix it.</p>
      </section>
      <section>
        <h2>Changing plans</h2>
        <p>Want to move up or down a plan? Message your coach or email us and we will switch you from your next billing date.</p>
      </section>
      <section>
        <h2>How refunds are paid</h2>
        <p>Approved refunds go back to your original payment method through Stripe and usually appear within 5 to 10 business days.</p>
      </section>
    </LegalPage>
  );
}
