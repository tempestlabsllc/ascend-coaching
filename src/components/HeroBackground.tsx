"use client";
import { useEffect, useRef } from "react";

// Animated hero background: glowing turquoise particles that rise upward
// (the "ascension"), with faint connecting lines between nearby particles.
export default function HeroBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; r: number; vy: number; vx: number; a: number; tw: number };
    let ps: P[] = [];
    const make = (y?: number): P => ({
      x: Math.random() * w,
      y: y ?? Math.random() * h,
      r: Math.random() * 2 + 0.6,
      vy: Math.random() * 0.5 + 0.15,
      vx: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.6 + 0.3,
      tw: Math.random() * Math.PI * 2,
    });

    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, (w * h) / 9000));
      ps = Array.from({ length: count }, () => make());
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, w, h);
      // links
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
          const d = dx * dx + dy * dy;
          if (d < 110 * 110) {
            ctx.strokeStyle = `rgba(224,17,95,${0.12 * (1 - Math.sqrt(d) / 110)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke();
          }
        }
      }
      // particles
      for (const p of ps) {
        if (!reduce) {
          p.y -= p.vy; p.x += p.vx + Math.sin(t / 2000 + p.tw) * 0.1;
          if (p.y < -10) Object.assign(p, make(h + 10));
        }
        const flicker = 0.7 + 0.3 * Math.sin(t / 600 + p.tw);
        ctx.fillStyle = `rgba(224,17,95,${p.a * flicker})`;
        ctx.shadowColor = "rgba(224,17,95,0.9)"; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
      if (!reduce) raf = requestAnimationFrame(draw);
    }

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-grid" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
    </div>
  );
}
