import CheckInForm from "./CheckInForm";

export const metadata = { title: "Check-in" };

export default function CheckInPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-extrabold">Client check-in</h1>
      <p className="mt-2 mb-10 text-white/60">For current clients. Submit on your check-in day; progress photos every 4 weeks can be sent by replying to my email.</p>
      <CheckInForm />
    </div>
  );
}
