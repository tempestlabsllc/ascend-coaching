import Link from "next/link";

// Opens our checkout page with Stripe's embedded payment form (src/app/checkout).
export default function BuyButton({
  kind, id, label, className = "btn-primary w-full", term,
}: { kind: "tier" | "guide"; id: string; label: string; className?: string; term?: "monthly" | "3month" }) {
  const q = new URLSearchParams({ kind, id, ...(term ? { term } : {}) });
  return <Link href={`/checkout?${q}`} className={className}>{label}</Link>;
}
