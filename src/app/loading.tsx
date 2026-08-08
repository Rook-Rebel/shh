export default function Loading() {
  return (
    <>
      <div className="sticky top-0 z-40 px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="mx-auto flex w-fit items-center gap-7 rounded-full border border-white/10 bg-zinc-950/40 px-5 py-3 backdrop-blur-xl">
          <div className="h-5 w-10 animate-pulse rounded bg-white/10" />
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 pt-10 sm:pt-14">
        <div className="mx-auto mb-10 flex max-w-lg flex-col items-center gap-3 pt-2 text-center sm:mb-14">
          <div className="h-3 w-32 animate-pulse rounded-full bg-white/5" />
          <div className="h-10 w-24 animate-pulse rounded-full bg-white/10" />
          <div className="h-3 w-56 animate-pulse rounded-full bg-white/5" />
        </div>

        <div className="shimmer mb-20 aspect-video w-full rounded-[30px] border border-white/10 bg-zinc-900 sm:mb-24 sm:rounded-[36px]" />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="shimmer aspect-video rounded-[22px] border border-white/10 bg-zinc-900 sm:rounded-3xl" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
