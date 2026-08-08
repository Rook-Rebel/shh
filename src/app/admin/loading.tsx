export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:py-14">
      <div className="mb-10 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-16 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-28 animate-pulse rounded bg-white/5" />
        </div>
        <div className="h-8 w-20 animate-pulse rounded-full bg-white/5" />
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
        <div className="h-9 w-28 animate-pulse rounded-full bg-white/10" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="shimmer aspect-video rounded-3xl border border-white/10 bg-zinc-900" />
        ))}
      </div>
    </main>
  );
}
