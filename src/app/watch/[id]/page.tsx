import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import MobileDock from "@/components/MobileDock";
import VideoPlayer from "@/components/VideoPlayer";
import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";
import VideoGrid from "@/components/VideoGrid";
import GlassPanel from "@/components/ui/GlassPanel";
import SectionHeader from "@/components/ui/SectionHeader";
import { getPublicVideos, getVideoById } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/formatDate";

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) return { title: "shh." };

  return {
    title: `${video.title} — shh.`,
    description: video.description,
    openGraph: {
      title: video.title,
      description: video.description,
      images: video.thumbnail_url ? [video.thumbnail_url] : undefined,
      url: `https://shh.ge/watch/${video.id}`,
    },
  };
}

export default async function WatchPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const video = await getVideoById(id);

  if (!video) notFound();

  const publicVideos = await getPublicVideos();
  const more = publicVideos.filter((v) => v.id !== video.id).slice(0, 3);

  return (
    <>
      {video.thumbnail_url && (
        <div
          aria-hidden
          className="pointer-events-none fixed -inset-32 -z-10 opacity-25"
          style={{
            backgroundImage: `url(${video.thumbnail_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(100px) brightness(0.35) saturate(1.3)",
          }}
        />
      )}

      <Header videos={publicVideos} />
      <main className="page-enter mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-10 sm:py-14">
        <GlassPanel intensity="heavy" rounded="rounded-[32px]" className="p-2 sm:p-3">
          <VideoPlayer videoUrl={video.video_url} title={video.title} />
        </GlassPanel>

        <GlassPanel intensity="soft" className="mt-6 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-xl font-medium text-ink sm:text-2xl">{video.title}</h1>
              <p className="mt-1.5 text-sm text-zinc-500">{formatDate(video.created_at, "long")}</p>
            </div>
            <div className="flex gap-3">
              <LikeButton videoId={video.id} />
              <ShareButton title={video.title} />
            </div>
          </div>

          {video.description && (
            <p className="mt-6 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-zinc-400">
              {video.description}
            </p>
          )}
        </GlassPanel>

        {more.length > 0 && (
          <section className="mt-16">
            <SectionHeader>more evidence</SectionHeader>
            <VideoGrid videos={more} />
          </section>
        )}
      </main>

      <MobileDock videos={publicVideos} />
    </>
  );
}
