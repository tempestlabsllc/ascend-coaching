import IntakeForm from "./IntakeForm";

export const metadata = { title: "Intake questionnaire" };

export default function IntakePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-extrabold">Intake questionnaire</h1>
      <p className="mt-2 mb-10 text-white/60">The more detail you give, the better your plan. Takes about 5 minutes.</p>
      <IntakeForm />
    </div>
  );
}
