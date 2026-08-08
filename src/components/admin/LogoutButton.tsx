"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import GlassButton from "@/components/ui/GlassButton";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <GlassButton onClick={handleLogout} disabled={loading} className="px-3.5 py-2 text-xs">
      <LogOut size={13} strokeWidth={1.75} />
      log out
    </GlassButton>
  );
}
