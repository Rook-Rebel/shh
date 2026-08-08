-- Run once in the Supabase SQL editor: Dashboard → SQL Editor → New query → paste → Run.

-- 1. Table -------------------------------------------------------------

create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  video_url text not null default '',
  thumbnail_url text not null default '',
  created_at timestamptz not null default now(),
  featured boolean not null default false,
  visibility text not null default 'public' check (visibility in ('public', 'unlisted'))
);

alter table public.videos enable row level security;

-- Anyone can read any row directly by id — this is what makes unlisted
-- links work. The app itself decides what's shown on the homepage/search;
-- this is not meant to be high-security DRM, just "not listed."
create policy "Public read access" on public.videos
  for select using (true);

-- Only a signed-in user may write. There is only ever one admin account
-- (created manually below), so "authenticated" effectively means "admin."
create policy "Authenticated insert" on public.videos
  for insert to authenticated with check (true);

create policy "Authenticated update" on public.videos
  for update to authenticated using (true);

create policy "Authenticated delete" on public.videos
  for delete to authenticated using (true);

-- 2. Storage buckets -----------------------------------------------------

insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

create policy "Public read videos bucket" on storage.objects
  for select using (bucket_id = 'videos');

create policy "Authenticated write videos bucket" on storage.objects
  for insert to authenticated with check (bucket_id = 'videos');

create policy "Authenticated update videos bucket" on storage.objects
  for update to authenticated using (bucket_id = 'videos');

create policy "Authenticated delete videos bucket" on storage.objects
  for delete to authenticated using (bucket_id = 'videos');

create policy "Public read thumbnails bucket" on storage.objects
  for select using (bucket_id = 'thumbnails');

create policy "Authenticated write thumbnails bucket" on storage.objects
  for insert to authenticated with check (bucket_id = 'thumbnails');

create policy "Authenticated update thumbnails bucket" on storage.objects
  for update to authenticated using (bucket_id = 'thumbnails');

create policy "Authenticated delete thumbnails bucket" on storage.objects
  for delete to authenticated using (bucket_id = 'thumbnails');
