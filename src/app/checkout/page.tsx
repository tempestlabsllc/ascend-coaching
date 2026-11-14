import Link from "next/link";
import { guides, tiers } from "@/config/site";
import CheckoutForm from "./CheckoutForm";

export const metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ kind?: string; id?: string; term?: string }> }) {
  const { kind, id, term } = await searchParams;
  const tier = kind === "tier" ? tiers.find((t) => t.id === id) : undefined;
  const guide = kind === "guide" ? guides.find((g) => g.id === id) : undefined;
  const back = kind === "tier" ? "/coaching" : "/shop";

  if (!tier && !guide) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-black/70">That item couldn&apos;t be found.</p>
        <Link href="/coaching" className="btn-primary mt-6">See coaching plans</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Link href={back} className="text-sm text-black/60 underline">← Back</Link>
      <h1 className="mt-4 text-3xl font-extrabold">{tier ? `${tier.name} Coaching` : guide!.title}</h1>
      {tier && (
        <p className="mt-3 text-black/70">After you subscribe, I&apos;ll personally reach out within 24 hours on Trainerize or WhatsApp to review everything with you.</p>
      )}
      <div className="mt-8">
        <CheckoutForm kind={kind as "tier" | "guide"} id={id!} term={term === "3month" ? "3month" : "monthly"} />
      </div>
    </div>
  );
}
