import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getAllVideosForAdmin } from "@/lib/supabase/queries";
import AdminDashboard from "@/components/admin/AdminDashboard";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminPage() {
  const supabase = await createClient();

  // Middleware already redirects when Supabase isn't configured or the
  // visitor isn't signed in — these are defense-in-depth checks in case
  // the page is ever reached another way.
  if (!supabase) redirect("/admin/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const videos = await getAllVideosForAdmin();

  return (
    <main className="page-enter mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:py-14">
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <Link
            href="/"
            aria-label="shh."
            className="bg-gradient-to-r from-rose-200 via-fuchsia-200 to-violet-200 bg-clip-text text-2xl font-medium tracking-tight text-transparent"
          >
            <span aria-hidden="true">shh.</span>
          </Link>
          <p className="mt-2 text-sm font-medium text-ink-soft/70">the secret room</p>
          <p className="mt-0.5 text-xs text-zinc-600">you know what to do.</p>
        </div>
        <LogoutButton />
      </div>

      <AdminDashboard initialVideos={videos} />
    </main>
  );
}
