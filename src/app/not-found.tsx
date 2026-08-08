import Link from "next/link";
import Header from "@/components/Header";
import MobileDock from "@/components/MobileDock";
import GlassPanel from "@/components/ui/GlassPanel";
import { glassButtonClass } from "@/components/ui/GlassButton";
import { getPublicVideos } from "@/lib/supabase/queries";

export default async function NotFound() {
  const publicVideos = await getPublicVideos();

  return (
    <>
      <Header videos={publicVideos} />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <GlassPanel intensity="soft" className="px-10 py-14">
          <p className="text-lg text-zinc-400">nothing here.</p>
          <Link href="/" className={glassButtonClass("ghost", "mt-6")}>
            back to shh.
          </Link>
        </GlassPanel>
      </div>
      <MobileDock videos={publicVideos} />
    </>
  );
}
