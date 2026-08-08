export default function Loading() {
  return (
    <>
      <div className="sticky top-0 z-40 px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="mx-auto flex w-fit items-center gap-7 rounded-full border border-white/10 bg-zinc-950/40 px-5 py-3 backdrop-blur-xl">
          <div className="h-5 w-10 animate-pulse rounded bg-white/10" />
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
          <div>
            <div className="shimmer aspect-video w-full rounded-[32px] border border-white/10 bg-zinc-900" />
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-white/5" />
            </div>
          </div>

          <aside className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="shimmer h-16 w-28 shrink-0 rounded-xl border border-white/10 bg-zinc-900" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-white/10" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
                </div>
              </div>
            ))}
          </aside>
        </div>
      </main>
    </>
  );
}
