# shh.

A private, premium video archive. Only the admin (you) can upload, edit, or delete videos. Visitors can only watch, like, and share what you publish.

Built with Next.js, TypeScript, Tailwind CSS, and Supabase (Auth + Database + Storage).

## 1. Install dependencies

```bash
npm install
```

## 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project (any name/region/password is fine — save the database password somewhere safe).
2. Wait for it to finish provisioning.

## 3. Create the database table + storage buckets

1. In the Supabase dashboard, open **SQL Editor** → **New query**.
2. Paste the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.

This one script creates:

- the `videos` table (title, description, video_url, thumbnail_url, created_at, featured, visibility)
- row-level security policies (anyone can read, only a signed-in user can write)
- a public `videos` storage bucket and a public `thumbnails` storage bucket, with the same read/write rules

If you'd rather click through the UI instead: **Table Editor** → create `videos` with those columns, then **Storage** → create two public buckets named `videos` and `thumbnails`. The SQL script is faster and does both at once.

## 4. Add environment variables

1. In Supabase: **Project Settings** → **API**.
2. Copy the **Project URL**, the **publishable** key, and the **service_role** secret key.
3. Create `.env.local` in the project root (copy `.env.example`):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
   ```

The admin (you) logs in with a custom session cookie, not Supabase Auth, so the browser is never treated as an "authenticated" Supabase role — by design, anon can only read. `SUPABASE_SERVICE_ROLE_KEY` is what lets the server actually save/delete videos on your behalf after checking your admin session. It's server-only: never prefixed with `NEXT_PUBLIC_`, never sent to the browser, and never committed.

Never commit `.env.local` — it's already in `.gitignore`.

## 5. Create your admin account

There is no public sign-up — by design, only one admin account should exist, and you create it yourself:

1. In Supabase: **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter your email and a password.
3. Leave "Auto Confirm User" checked (or confirm it manually) so you can sign in immediately.

That's the only account that will ever be able to log in to `/admin`.

## 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, or [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to sign in with the account you just created.

## 7. Deploy to Vercel

1. Push this project to a GitHub repository.
2. Import the repository in [Vercel](https://vercel.com/new).
3. In the Vercel project's **Environment Variables** settings, add the same two variables from `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
4. Deploy.
5. (Optional) Point your `shh.ge` domain at the Vercel project under **Domains**.

Every future `git push` to your main branch automatically redeploys the site.

## How to upload a video (after deploying)

1. Go to `shh.ge/admin` (you'll be redirected to log in if needed).
2. Click **New video**.
3. Upload a thumbnail image and the video file directly in the form.
4. Add a title and description.
5. Choose **Public** (shows on the homepage) or **Unlisted** (link-only).
6. Optionally check **Featured** to feature it on the homepage — this automatically un-features whatever was featured before.
7. Click **Publish**.

The video appears immediately — no redeploy needed, since it's stored in Supabase, not in code.

## Editing or deleting a video

In `/admin`, hover any video card and use the pencil (edit) or trash (delete) icon. Deleting a video also removes its uploaded files from storage.

## Visibility

- **Public** — appears on the homepage and in search.
- **Unlisted** — hidden from the homepage and search, but still watchable by anyone with the direct link (`shh.ge/watch/[id]`). This is convenience, not real security — don't use it for anything truly sensitive.

## Likes

Likes are stored in each visitor's browser via `localStorage`. There is no global like counter — it's a personal "I liked this" toggle per visitor, not tied to an account.

## Notes on file size

Supabase's free tier defaults to a 50MB per-file upload limit. For larger videos, raise the limit under **Storage** → **Settings** in the Supabase dashboard (subject to your plan), or host longer videos elsewhere and keep using this project for lighter clips.
