import Link from "next/link";
import Logo from "./Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/coaching", label: "Coaching" },
  { href: "/results", label: "Results" },
  { href: "/shop", label: "Guides" },
  { href: "/intake", label: "Questionnaire" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-paper/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="Ascend Coaching home"><Logo /></Link>
        <div className="flex items-center gap-4 text-sm font-medium sm:gap-6">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hidden hover:text-brand sm:inline">{l.label}</Link>
          ))}
          <Link href="/coaching" className="rounded-full bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">Get started</Link>
        </div>
      </nav>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 px-4 pb-3 text-sm sm:hidden">
        {links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
      </div>
    </header>
  );
}
