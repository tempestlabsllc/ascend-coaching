// Side-by-side before/after photos, each cropped (see *-card.jpg) so the
// physique sits in the centre of the frame. Subtle zoom on hover.
export default function BeforeAfter({ before, after }: { before: { src: string; label: string }; after: { src: string; label: string } }) {
  return (
    <div className="grid grid-cols-2 gap-1 bg-black/5">
      {[before, after].map((p, i) => (
        <div key={p.src} className="group relative aspect-[4/5] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.src} alt={p.label} loading="lazy" className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105" />
          <span className={`absolute bottom-2 left-2 rounded-full px-3 py-1 text-xs font-bold ${i === 0 ? "bg-black/70 text-white" : "bg-brand text-white"}`}>{p.label}</span>
        </div>
      ))}
    </div>
  );
}
