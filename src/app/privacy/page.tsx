import { site } from "@/config/site";
import { LegalPage } from "@/components/Legal";

export const metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="November 11, 2026">
      <section>
        <p>This policy explains what information {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects through this website and our coaching services, how we use it, and the choices you have.</p>
      </section>
      <section>
        <h2>Information we collect</h2>
        <ul>
          <li><b>Contact details:</b> your name, email address and phone/WhatsApp number.</li>
          <li><b>Health and fitness information:</b> what you share in the questionnaire and check-ins, such as age, height, weight, goals, training history, diet, sleep, injuries, medical conditions and medications, plus any progress photos or measurements you send.</li>
          <li><b>Purchase information:</b> what you bought and when. Payments are processed by Stripe; we never see or store your full card number.</li>
          <li><b>Guide signups:</b> your email address when you unlock a free guide.</li>
          <li><b>Basic technical data:</b> standard information your browser sends (such as IP address and device type) to our hosting provider, and one cookie that remembers you unlocked a free guide.</li>
        </ul>
      </section>
      <section>
        <h2>How we use it</h2>
        <ul>
          <li>To build, deliver and adjust your training and nutrition plan, and to communicate with you.</li>
          <li>To process payments, send receipts and manage your subscription.</li>
          <li>To send you the guides you request and, if you agreed, marketing emails (see below).</li>
          <li>To keep the website working and secure, and to meet legal obligations.</li>
        </ul>
      </section>
      <section>
        <h2>Who we share it with</h2>
        <p>We use trusted services to run the business. They only receive what they need to do their job:</p>
        <ul>
          <li><b>Stripe</b> (payments and billing), <b>Calendly</b> (call booking), <b>ABC Trainerize</b> (your plan, tracking and messaging), <b>WhatsApp</b> (messaging, if you choose it), <b>FormSubmit</b> (delivering form submissions to our inbox), <b>Upstash</b> (secure storage of form submissions and guide signups) and <b>Vercel</b> (website hosting).</li>
          <li><b>Tempest Labs (tempestlabs.shop):</b> when you unlock a free guide and tick the box agreeing to it, your email address is shared with Tempest Labs so they can send you emails. We do not share your questionnaire, health information or phone number with Tempest Labs.</li>
        </ul>
        <p>We do not sell your health information. We may disclose information if required by law.</p>
      </section>
      <section>
        <h2>Marketing emails</h2>
        <p>You will only get marketing emails if you agreed to them. Every email includes a way to unsubscribe, or you can email us at <a className="underline" href={`mailto:${site.email}`}>{site.email}</a> and we will remove you and ask Tempest Labs to do the same.</p>
      </section>
      <section>
        <h2>How long we keep it</h2>
        <p>We keep coaching information while you are a client and for a reasonable period afterwards for our records, then delete it. You can ask us to delete it sooner at any time.</p>
      </section>
      <section>
        <h2>Your choices and rights</h2>
        <p>You can ask to see, correct or delete the information we hold about you, or withdraw your consent to marketing, by emailing <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>. Depending on where you live, you may have additional rights under local privacy laws.</p>
      </section>
      <section>
        <h2>Age</h2>
        <p>Our services are for adults 18 and over. We do not knowingly collect information from anyone under 18.</p>
      </section>
      <section>
        <h2>Security</h2>
        <p>We use reputable providers and take reasonable steps to protect your information, but no method of sending or storing data online is completely secure.</p>
      </section>
      <section>
        <h2>Changes and contact</h2>
        <p>We may update this policy and will change the date above when we do. Questions? Email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </section>
    </LegalPage>
  );
}
