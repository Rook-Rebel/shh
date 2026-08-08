import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from "@/lib/adminSession";
import { getAllVideosForAdmin } from "@/lib/supabase/queries";
import AdminDashboard from "@/components/admin/AdminDashboard";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminPage() {
  // Proxy already redirects signed-out visitors — this is a defense-in-depth
  // check in case the page is ever reached another way.
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidSessionToken(session)) redirect("/admin/login");

  const videos = await getAllVideosForAdmin();

  return (
    <main className="page-enter mx-auto w-full max-w-6xl flex-1 px-6 py-10 sm:py-14">
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <Link
            href="/"
            aria-label="shh."
            className="bg-gradient-to-r from-rose-200 via-fuchsia-200 to-violet-200 bg-clip-text text-lg font-medium tracking-tight text-transparent"
          >
            <span aria-hidden="true">shh.</span>
          </Link>
          <h1 className="mt-2 text-2xl font-medium text-ink">Admin Panel</h1>
        </div>
        <LogoutButton />
      </div>

      <AdminDashboard initialVideos={videos} />
    </main>
  );
}
