"use client";

import { useFormStatus } from "react-dom";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import GlassButton from "@/components/ui/GlassButton";

function LogoutSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <GlassButton type="submit" disabled={pending} className="px-3.5 py-2 text-xs">
      <LogOut size={13} strokeWidth={1.75} />
      log out
    </GlassButton>
  );
}

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <LogoutSubmitButton />
    </form>
  );
}
