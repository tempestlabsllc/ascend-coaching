import { site } from "@/config/site";
import { LegalPage } from "@/components/Legal";

export const metadata = { title: "Terms of Service & Health Waiver" };

export default function Terms() {
  return (
    <LegalPage title="Terms of Service & Health Waiver" updated="November 11, 2026">
      <section>
        <p>By using this website, buying a coaching plan or downloading a guide from {site.name}, you agree to these terms. If you do not agree, please do not use our services.</p>
      </section>
      <section>
        <h2>1. Our services</h2>
        <p>{site.name} provides online fitness and nutrition coaching, delivered through ABC Trainerize and messaging (Trainerize or WhatsApp), and digital guides. Your coach shares knowledge built from years of hands-on training experience and research. Your coach is not a doctor, dietitian or other licensed healthcare provider, and is not a certified personal trainer.</p>
      </section>
      <section>
        <h2>2. Not medical advice</h2>
        <p>Everything we provide, including plans, messages, videos and guides, is for general fitness and educational purposes only. It is not medical advice and is not a substitute for advice from a qualified healthcare professional. Never ignore medical advice or delay seeking it because of something you read or heard from us.</p>
        <p>Our guides may discuss peptides, supplements or medications for educational purposes. We do not sell, prescribe or supply any drug, and nothing we say is a recommendation to use one. Talk to a licensed medical provider before starting any drug, peptide or supplement.</p>
      </section>
      <section id="health">
        <h2>3. Health waiver and assumption of risk</h2>
        <p>Exercise and changes to your diet carry inherent risks, including injury, illness and, in rare cases, serious harm. By using our services you confirm and agree that:</p>
        <ul>
          <li>You are 18 or older and in good health, or you have been cleared by a doctor to exercise and change your diet.</li>
          <li>You will consult a doctor before starting if you have, or think you may have, any medical condition, injury, or are pregnant, or take medication.</li>
          <li>You have told us about any injuries, conditions or medications that could affect your training, and you will tell us about any changes.</li>
          <li>You will stop exercising and seek medical help if you feel pain, dizziness, shortness of breath or any other warning sign.</li>
          <li>You are responsible for using proper form, appropriate weights and safe equipment, and for training within your own limits.</li>
          <li>You voluntarily take part and assume all risks of doing so. To the fullest extent permitted by law, you release {site.name} and your coach from any claims, liability or damages arising from your participation, except where caused by our gross negligence or willful misconduct.</li>
        </ul>
      </section>
      <section>
        <h2>4. Results</h2>
        <p>Results vary from person to person and depend on factors such as consistency, starting point, genetics, sleep and stress. Transformations shown on this site are real but are not typical or guaranteed.</p>
      </section>
      <section>
        <h2>5. Subscriptions and billing</h2>
        <p>Coaching plans are monthly subscriptions billed through Stripe and renew automatically each month until cancelled. You can cancel at any time and your plan stays active until the end of the period you have paid for. See our <a className="underline" href="/refunds">Refunds &amp; Cancellations</a> policy. We may change prices with notice; changes apply from your next billing period.</p>
      </section>
      <section>
        <h2>6. Your responsibilities</h2>
        <p>Please give accurate information, complete check-ins honestly, and treat your coach with respect. We may end coaching, with a pro-rated refund for unused time, if these terms are seriously breached.</p>
      </section>
      <section>
        <h2>7. Digital products and content</h2>
        <p>Guides, programs and other materials are for your personal use only. Do not copy, share, resell or publish them without written permission. All content on this site belongs to {site.name}.</p>
      </section>
      <section>
        <h2>8. Third-party services and links</h2>
        <p>We use third-party services such as Stripe, Calendly, ABC Trainerize and WhatsApp, and our content may link to other websites. Their own terms and policies apply, and we are not responsible for them.</p>
      </section>
      <section>
        <h2>9. Affiliate disclosure</h2>
        <p>Your coach is an affiliate of Tempest Labs (tempestlabs.shop) and may earn a commission when you use the code &ldquo;eddy&rdquo;. {site.name} does not own Tempest Labs and is not responsible for its products. Mentioning a store is not a recommendation to use any product; talk to a licensed medical provider first.</p>
      </section>
      <section>
        <h2>10. Limitation of liability</h2>
        <p>To the fullest extent permitted by law, {site.name} is not liable for any indirect, incidental or consequential damages, and our total liability for any claim is limited to the amount you paid us in the three months before the claim.</p>
      </section>
      <section>
        <h2>11. Changes and contact</h2>
        <p>We may update these terms and will change the date above when we do. Questions? Email <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </section>
    </LegalPage>
  );
}
