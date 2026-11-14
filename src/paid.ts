import type Stripe from "stripe";

// A checkout counts as paid when the card was charged, or when a 100% discount
// code made the order free (Stripe reports that as "no_payment_required").
export function isPaid(s: Pick<Stripe.Checkout.Session, "payment_status">) {
  return s.payment_status === "paid" || s.payment_status === "no_payment_required";
}
