"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

// Stripe's embedded payment form (Checkout Studio, ui_mode "form"). Stripe.js must be loaded
// straight from js.stripe.com (PCI rule), so it comes in as a script tag, not an npm bundle.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Window { Stripe?: (key: string) => any }
}

const appearance = {
  theme: "stripe",
  labels: "auto",
  inputs: "spaced",
  variables: {
    borderRadius: "4px",
    colorBackground: "#ffffff",
    colorDanger: "#df1b41",
    colorPrimary: "#0570de",
    colorSuccess: "#00c853",
    colorText: "#30313d",
    fontFamily: "default",
    fontSizeBase: "16px",
    spacingUnit: "4px",
  },
};

type Session = { client_secret: string; publishable_key: string };

export default function CheckoutForm({ kind, id, term }: { kind: "tier" | "guide"; id: string; term: "monthly" | "3month" }) {
  const [ready, setReady] = useState(false); // Stripe.js loaded
  const [session, setSession] = useState<Session | null>(null);
  const [mounted, setMounted] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const started = useRef(false);
  const mounting = useRef(false);

  useEffect(() => {
    if (window.Stripe) setReady(true);
    if (started.current) return;
    started.current = true; // one Checkout Session per visit
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, id, term }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) window.location.replace(data.url); // hosted checkout fallback
        else if (data.client_secret && data.publishable_key) setSession(data);
        else setMsg(data.message || "Something went wrong.");
      })
      .catch(() => setMsg("Something went wrong. Please refresh and try again."));
  }, [kind, id, term]);

  useEffect(() => {
    if (!ready || !session || mounting.current) return;
    mounting.current = true;
    (async () => {
      try {
        const stripe = window.Stripe!(session.publishable_key);
        const checkout = stripe.initCheckoutFormSdk({ clientSecret: session.client_secret, appearance });
        const form = checkout.createForm({ layout: "expanded" });
        form.mount("#checkout-form");
        setMounted(true);

        const loadActionsResult = await checkout.loadActions();
        if (loadActionsResult.type === "success") {
          // On success Stripe sends the buyer to /success (the session's return_url), which shows the
          // download / next steps and sends the purchase emails, same as before.
          form.on("confirm", async (event: unknown) => {
            try {
              await loadActionsResult.actions.confirm({ formConfirmEvent: event });
            } catch (error) {
              console.error("Payment confirmation error:", error);
            }
          });
        } else {
          setMsg("The payment form couldn't load. Please refresh the page.");
        }
      } catch (e) {
        console.error("Payment form error:", e);
        setMsg("The payment form couldn't load. Please refresh the page.");
      }
    })();
  }, [ready, session]);

  return (
    <>
      <Script
        src="https://js.stripe.com/dahlia/stripe.js"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
        onError={() => setMsg("The payment form couldn't load. If you use an ad blocker, please allow js.stripe.com and refresh.")}
      />
      {!mounted && !msg && <p className="text-black/60">Loading secure payment form…</p>}
      {msg && <p className="text-brand">{msg}</p>}
      <div id="checkout-form" />
    </>
  );
}
