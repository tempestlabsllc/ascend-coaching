"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Site-wide live effects: scroll-reveal for [data-reveal], a scroll progress bar,
// and cursor-tracking (--mx/--my) for any [data-spot] element.
export default function LiveEffects() {
  const path = usePathname();
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));

    const bar = document.getElementById("scroll-bar");
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar?.style.setProperty("--sp", String(h > 0 ? scrollY / h : 0));
    };
    const onMove = (e: PointerEvent) => {
      document.querySelectorAll<HTMLElement>("[data-spot]").forEach((el) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointermove", onMove, { passive: true });
    return () => { io.disconnect(); removeEventListener("scroll", onScroll); removeEventListener("pointermove", onMove); };
  }, [path]);
  return <div id="scroll-bar" className="scroll-bar" aria-hidden />;
}
