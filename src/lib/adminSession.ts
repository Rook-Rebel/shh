import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// Server-only. Never imported from a "use client" file — Next.js keeps
// unprefixed env vars (no NEXT_PUBLIC_) out of the browser bundle entirely,
// but we're careful about where this module is imported from regardless.

export const ADMIN_SESSION_COOKIE = "shh_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): string {
  // A dedicated secret is better practice, but falling back to the admin
  // password means the whole system still works with just the two env
  // vars the admin is actually asked to set.
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function timingSafeStringsEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a comparison so mismatched lengths don't return faster
    // than matched ones, without calling timingSafeEqual on unequal sizes.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

export function verifyAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;

  const emailMatches = timingSafeStringsEqual(email.trim().toLowerCase(), adminEmail.trim().toLowerCase());
  const passwordMatches = timingSafeStringsEqual(password, adminPassword);
  return emailMatches && passwordMatches;
}

export function createSessionToken(): { value: string; maxAgeSeconds: number } {
  const issuedAt = Date.now().toString();
  const signature = sign(issuedAt);
  return { value: `${issuedAt}.${signature}`, maxAgeSeconds: SESSION_MAX_AGE_SECONDS };
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;

  const separatorIndex = token.indexOf(".");
  if (separatorIndex === -1) return false;

  const issuedAt = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  if (!issuedAt || !signature) return false;

  if (!timingSafeStringsEqual(signature, sign(issuedAt))) return false;

  const issuedAtMs = Number(issuedAt);
  if (!Number.isFinite(issuedAtMs)) return false;

  const age = Date.now() - issuedAtMs;
  return age >= 0 && age < SESSION_MAX_AGE_SECONDS * 1000;
}

// Every Server Action that writes to the database or storage must call this
// first. A page-level redirect (proxy.ts, admin/page.tsx) only controls what
// gets rendered — Server Actions are separate, directly-callable endpoints
// and are not covered by that check, so each one re-verifies on its own.
export async function requireAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!isValidSessionToken(session)) {
    throw new Error("unauthorized");
  }
}
