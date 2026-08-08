"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import GlassPanel from "@/components/ui/GlassPanel";
import GlassButton from "@/components/ui/GlassButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    if (!supabase) {
      setError("admin isn't connected yet.");
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError("incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="page-enter flex flex-1 flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            href="/"
            aria-label="shh."
            className="bg-gradient-to-r from-rose-200 via-fuchsia-200 to-violet-200 bg-clip-text text-2xl font-medium tracking-tight text-transparent"
          >
            <span aria-hidden="true">shh.</span>
          </Link>
          <p className="mt-2 text-sm text-ink-soft/70">you know the password.</p>
        </div>

        <GlassPanel intensity="heavy" className="panel-enter p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-medium text-zinc-400">
                email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:border-violet-200/40 focus:outline-none focus:ring-2 focus:ring-violet-200/15"
                placeholder="you@shh.ge"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-medium text-zinc-400">
                password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:border-violet-200/40 focus:outline-none focus:ring-2 focus:ring-violet-200/15"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-rose-300">{error}</p>}

            <GlassButton type="submit" variant="primary" disabled={loading} className="sheen mt-2 w-full">
              {loading ? "coming in…" : "come in"}
            </GlassButton>
          </form>
        </GlassPanel>

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-xs text-zinc-600 transition-colors hover:text-zinc-400"
        >
          <ArrowLeft size={12} strokeWidth={2} />
          back
        </Link>
      </div>
    </main>
  );
}
