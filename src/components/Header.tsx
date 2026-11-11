import Link from "next/link";
import { site } from "@/config/site";

const links = [
  { href: "/about", label: "About" },
  { href: "/coaching", label: "Coaching" },
  { href: "/shop", label: "Guides" },
  { href: "/intake", label: "Questionnaire" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-paper/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-brand">{site.name}</Link>
        <div className="flex items-center gap-4 text-sm font-medium sm:gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hidden hover:text-brand sm:inline">{l.label}</Link>
          ))}
          <Link href="/coaching" className="rounded-full bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">Get started</Link>
        </div>
      </nav>
      <div className="flex justify-center gap-5 pb-3 text-sm sm:hidden">
        {links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
      </div>
    </header>
  );
}
