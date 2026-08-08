import { Sparkles } from "lucide-react";
import Header from "@/components/Header";
import MobileDock from "@/components/MobileDock";
import FeaturedVideo from "@/components/FeaturedVideo";
import VideoGrid from "@/components/VideoGrid";
import GlassPanel from "@/components/ui/GlassPanel";
import SectionHeader from "@/components/ui/SectionHeader";
import { getFeaturedVideo, getPublicVideos } from "@/lib/supabase/queries";
import { getCurrentYear } from "@/lib/getCurrentYear";

export default async function Home() {
  const featured = await getFeaturedVideo();
  const publicVideos = await getPublicVideos();
  const latest = featured
    ? publicVideos.filter((video) => video.id !== featured.id)
    : publicVideos;

  const recentVideos = latest.slice(0, 6);
  const olderVideos = latest.slice(6);

  return (
    <>
      <Header videos={publicVideos} />
      <main className="page-enter mx-auto w-full max-w-6xl flex-1 px-6 pt-10 sm:pt-14">
        <div className="relative mx-auto mb-10 flex max-w-lg flex-col items-center pt-2 text-center sm:mb-14">
          <span
            aria-hidden
            className="glint absolute -top-1 right-[30%] h-1.5 w-1.5 rounded-full bg-gradient-to-br from-rose-200 to-violet-200 blur-[1px]"
          />
          <span className="text-xs tracking-wide text-ink-soft/70">just between us 🤏</span>
          <h1
            aria-label="shh."
            className="mt-3 bg-gradient-to-r from-rose-200 via-fuchsia-200 to-violet-200 bg-clip-text text-4xl font-medium tracking-tight text-transparent sm:text-5xl"
          >
            shh.
          </h1>
          <p className="mt-3 text-sm text-ink-soft/70">some things are better kept here.</p>
        </div>

        {publicVideos.length === 0 ? (
          <GlassPanel
            intensity="soft"
            className="mx-auto flex max-w-md flex-col items-center justify-center px-10 py-20 text-center"
          >
            <div className="mb-4 rounded-full border border-white/10 bg-white/5 p-4">
              <Sparkles size={22} strokeWidth={1.5} className="text-rose-200/60" />
            </div>
            <p className="text-lg text-zinc-400">quiet in here.</p>
            <p className="mt-1.5 text-sm text-zinc-600">for now.</p>
          </GlassPanel>
        ) : (
          <>
            {featured && (
              <section className="mb-20 sm:mb-24">
                <FeaturedVideo video={featured} />
              </section>
            )}

            {recentVideos.length > 0 && (
              <section id="recently" className="scroll-mt-28">
                <SectionHeader>recently 🤏</SectionHeader>
                <VideoGrid videos={recentVideos} spotlightFirst />
              </section>
            )}

            {olderVideos.length > 0 && (
              <>
                <div aria-hidden className="my-16 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent sm:my-20" />
                <section>
                  <SectionHeader>older</SectionHeader>
                  <VideoGrid videos={olderVideos} />
                </section>
              </>
            )}
          </>
        )}
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 pb-28 pt-4 text-center sm:pb-16">
        <div className="mx-auto h-px w-16 bg-white/10" />
        <p className="mt-6 bg-gradient-to-r from-rose-200/70 via-fuchsia-200/70 to-violet-200/70 bg-clip-text text-sm font-medium text-transparent">
          shh. 🤏
        </p>
        <p className="mt-1.5 text-xs text-zinc-600">keep it between us. · {getCurrentYear()}</p>
      </footer>

      <MobileDock videos={publicVideos} />
    </>
  );
}
