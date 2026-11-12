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
        <p>Coaching is a personal service, and your coach starts working on your plan as soon as you sign up. Because of that, payments are non-refundable once coaching has started (your plan is being built or has been delivered), and we do not give refunds for partial months.</p>
        <p>We will refund you in these cases:</p>
        <ul>
          <li><b>Before we start:</b> if you cancel before your coach has begun building your plan, you get a full refund.</li>
          <li><b>If we don&apos;t deliver:</b> if we fail to provide what your plan includes, such as your program or check-in feedback, we will refund that billing period.</li>
          <li><b>Serious medical reasons:</b> if a serious injury or medical condition stops you from continuing, we will refund the unused part of your current month.</li>
          <li><b>Billing mistakes:</b> if you were charged in error, such as a double charge or a charge after cancelling, we will refund it.</li>
        </ul>
        <p>Refunds are not given for not following the plan, missing check-ins, giving inaccurate information, or not getting the results you hoped for. Results depend on your consistency and are never guaranteed.</p>
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
