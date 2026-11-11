import { guides, formatPrice } from "@/config/site";
import BuyButton from "@/components/BuyButton";

export const metadata = { title: "Digital guides" };

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-extrabold">Digital starter guides</h1>
      <p className="mt-2 mb-10 max-w-2xl text-white/60">Instant PDF downloads you can work through at your own pace, no coaching commitment needed.</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => {
          const free = g.priceCents === 0;
          return (
            <div key={g.id} className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card shadow-sm">
              <div className="flex aspect-[16/9] items-end bg-gradient-to-br from-brand to-brand-dark p-5 text-white">
                <span className="text-xl font-extrabold leading-tight">{g.title}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold">{free ? "Free" : formatPrice(g.priceCents)}</span>
                  {g.pages > 0 && <span className="text-xs text-white/50">{g.pages} pages · PDF</span>}
                </div>
                <p className="mt-2 flex-1 text-sm text-white/70">{g.description}</p>
                <div className="mt-5">
                  {free
                    ? <a href={`/api/download?guide=${g.id}`} className="btn-outline w-full">Download free</a>
                    : <BuyButton kind="guide" id={g.id} label="Buy now" />}
                </div>
              </div>
            </div>
          );
        })}
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand/40 bg-mist p-8 text-center">
          <span className="text-4xl">📘</span>
          <h3 className="mt-3 text-lg font-bold">More guides coming soon</h3>
          <p className="mt-1 text-sm text-white/60">New starter guides are on the way. Check back soon.</p>
        </div>
      </div>
    </div>
  );
}
