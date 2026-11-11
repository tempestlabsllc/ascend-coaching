import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/config/site";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">
        <Header />
        <main>{children}</main>
        <footer className="mt-24 border-t border-white/10 py-10 text-center text-sm text-white/60">
          <p className="mb-4 text-lg font-extrabold text-brand">{site.name}</p>
          <p>© {new Date().getFullYear()} {site.name} · <a className="underline" href={`mailto:${site.email}`}>{site.email}</a>
             · <a className="underline" href="/check-in">Client check-in</a>
            {site.manageSubscriptionUrl && <> · <a className="underline" href={site.manageSubscriptionUrl}>Manage subscription</a></>}</p>
          <p className="mt-2 max-w-xl mx-auto px-4">Information on this site is for educational purposes and is not medical advice. Consult a qualified professional before starting any program.</p>
        </footer>
      </body>
    </html>
  );
}
