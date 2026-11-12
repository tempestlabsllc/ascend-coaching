"use client";
import { useState } from "react";

// Drag-to-compare before/after photo.
export default function BeforeAfter({ before, after }: { before: { src: string; label: string }; after: { src: string; label: string } }) {
  const [pos, setPos] = useState(50);
  return (
    <div className="group relative aspect-[4/5] select-none overflow-hidden bg-black/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after.src} alt={after.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[center_30%]" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before.src} alt={before.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[center_30%]" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,.4)]" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm font-black text-brand-dark shadow-lg transition group-hover:scale-110">⇆</div>
      </div>
      <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">{before.label}</span>
      <span className="absolute bottom-3 right-3 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">{after.label}</span>
      <input
        type="range" min={0} max={100} value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Drag to compare before and after"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
