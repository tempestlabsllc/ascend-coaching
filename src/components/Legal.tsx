// Simple layout for the legal pages.
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-extrabold">{title}</h1>
      <p className="mt-2 text-sm text-black/50">Last updated {updated}</p>
      <div className="mt-10 space-y-8 text-black/75 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:mb-1 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </div>
  );
}
