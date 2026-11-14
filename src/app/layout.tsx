import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/config/site";
import Header from "@/components/Header";
import LiveEffects from "@/components/LiveEffects";
import PageBackground from "@/components/PageBackground";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  alternates: { canonical: "/" },
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <PageBackground />
        <LiveEffects />
        <Header />
        <main>{children}</main>
        <footer className="mt-24 border-t border-black/10 py-10 text-center text-sm text-black/60">
          <div className="mb-4 flex justify-center"><Logo /></div>
          <p>© {new Date().getFullYear()} {site.name} · <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>
             · <a className="underline" href="/check-in">Client check-in</a>
            {site.manageSubscriptionUrl && <> · <a className="underline" href={site.manageSubscriptionUrl}>Manage subscription</a></>}</p>
          <p className="mt-3">
            <a className="underline" href={site.instagram} target="_blank" rel="noopener">Instagram</a>
            {" · "}<a className="underline" href={site.tiktok} target="_blank" rel="noopener">TikTok</a>
            {" · "}<a className="underline" href="/privacy">Privacy</a>
            {" · "}<a className="underline" href="/terms">Terms &amp; health waiver</a>
            {" · "}<a className="underline" href="/refunds">Refunds &amp; cancellations</a>
          </p>
          <p className="mt-2 max-w-xl mx-auto px-4">Information on this site is for educational purposes and is not medical advice. Consult a qualified professional before starting any program.</p>
        </footer>
      </body>
    </html>
  );
}
