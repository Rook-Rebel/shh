"use client";

import { useEffect, useMemo, useState, type DragEvent, type FormEvent } from "react";
import Image from "next/image";
import { ImagePlus, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { uploadToBucket } from "@/lib/supabase/storage";
import GlassButton from "@/components/ui/GlassButton";
import { cn } from "@/lib/cn";
import type { Video, Visibility } from "@/types/video";

export default function VideoForm({
  video,
  onSaved,
  onCancel,
}: {
  video?: Video;
  onSaved: (video: Video) => void;
  onCancel: () => void;
}) {
  const isEditing = Boolean(video);

  const [title, setTitle] = useState(video?.title ?? "");
  const [description, setDescription] = useState(video?.description ?? "");
  const [visibility, setVisibility] = useState<Visibility>(video?.visibility ?? "public");
  const [featured, setFeatured] = useState(video?.featured ?? false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [draggingThumb, setDraggingThumb] = useState(false);
  const [draggingVideo, setDraggingVideo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const thumbnailPreview = useMemo(() => {
    if (thumbnailFile) return URL.createObjectURL(thumbnailFile);
    return video?.thumbnail_url ?? "";
  }, [thumbnailFile, video?.thumbnail_url]);

  // Only revoke object URLs we created for a live file preview — never the
  // persisted thumbnail_url, which isn't a blob and isn't ours to revoke.
  useEffect(() => {
    if (!thumbnailPreview.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(thumbnailPreview);
  }, [thumbnailPreview]);

  function handleThumbDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDraggingThumb(false);
    const file = event.dataTransfer.files?.[0];
    if (file) setThumbnailFile(file);
  }

  function handleVideoDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDraggingVideo(false);
    const file = event.dataTransfer.files?.[0];
    if (file) setVideoFile(file);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const supabase = createClient();

      const thumbnail_url = thumbnailFile
        ? await uploadToBucket("thumbnails", thumbnailFile)
        : (video?.thumbnail_url ?? "");

      const video_url = videoFile
        ? await uploadToBucket("videos", videoFile)
        : (video?.video_url ?? "");

      const payload = { title, description, thumbnail_url, video_url, featured, visibility };

      const { data, error: saveError } = isEditing
        ? await supabase.from("videos").update(payload).eq("id", video!.id).select().single()
        : await supabase.from("videos").insert(payload).select().single();

      if (saveError) throw saveError;

      const saved = data as Video;

      // Only one video should ever be featured — quietly un-feature the rest.
      if (saved.featured) {
        await supabase.from("videos").update({ featured: false }).neq("id", saved.id);
      }

      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "something went wrong. please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="panel-enter flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-ink">{isEditing ? "edit video" : "new video"}</h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-zinc-100"
        >
          <X size={18} strokeWidth={1.75} />
        </button>
      </div>

      <label
        onDragOver={(event) => {
          event.preventDefault();
          setDraggingVideo(true);
        }}
        onDragLeave={() => setDraggingVideo(false)}
        onDrop={handleVideoDrop}
        className={cn(
          "flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border border-dashed px-6 py-8 text-center transition-colors",
          draggingVideo ? "border-violet-300/60 bg-violet-400/[0.07]" : "border-white/15 bg-white/[0.02] hover:border-rose-200/30"
        )}
      >
        <div className="rounded-full border border-white/10 bg-white/5 p-3">
          <Upload size={18} strokeWidth={1.5} className="text-zinc-400" />
        </div>
        {videoFile ? (
          <p className="max-w-full truncate px-4 text-sm text-zinc-200">{videoFile.name}</p>
        ) : (
          <>
            <p className="text-sm text-zinc-300">
              {video?.video_url ? "drop a new video here" : "drop a video here"}
            </p>
            <p className="text-xs text-zinc-600">or choose a file</p>
          </>
        )}
        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          className="sr-only"
          onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-zinc-400">thumbnail</span>
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDraggingThumb(true);
            }}
            onDragLeave={() => setDraggingThumb(false)}
            onDrop={handleThumbDrop}
            className={cn(
              "group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors",
              draggingThumb ? "border-violet-300/60 bg-violet-400/[0.07]" : "border-white/15 bg-white/[0.02] hover:border-rose-200/30"
            )}
          >
            {thumbnailPreview ? (
              <Image
                src={thumbnailPreview}
                alt=""
                fill
                unoptimized={thumbnailPreview.startsWith("blob:")}
                className="object-cover"
              />
            ) : (
              <ImagePlus size={16} strokeWidth={1.5} className="text-zinc-600 group-hover:text-zinc-400" />
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => setThumbnailFile(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-xs font-medium text-zinc-400">
              title
            </label>
            <input
              id="title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:border-violet-200/40 focus:outline-none focus:ring-2 focus:ring-violet-200/15"
              placeholder="a quiet afternoon"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-xs font-medium text-zinc-400">
              description
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors focus:border-violet-200/40 focus:outline-none focus:ring-2 focus:ring-violet-200/15"
              placeholder="a short, tasteful description."
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-8 border-t border-white/10 pt-5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-zinc-400">visibility</span>
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              type="button"
              onClick={() => setVisibility("public")}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                visibility === "public" ? "bg-white/10 text-ink" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              public
            </button>
            <button
              type="button"
              onClick={() => setVisibility("unlisted")}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                visibility === "unlisted" ? "bg-white/10 text-ink" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              unlisted
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
            className="peer sr-only"
          />
          <span className="relative h-6 w-11 shrink-0 rounded-full bg-white/10 transition-colors duration-200 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 peer-checked:bg-gradient-to-r peer-checked:from-rose-300 peer-checked:to-violet-300 peer-checked:after:translate-x-5" />
          <span className="text-sm text-zinc-400">featured</span>
        </label>
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}

      {saving && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-zinc-500">uploading…</p>
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
            <div className="indeterminate-bar h-full w-1/3 rounded-full bg-gradient-to-r from-rose-300 to-violet-300" />
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
        <GlassButton type="button" variant="ghost" onClick={onCancel}>
          cancel
        </GlassButton>
        <GlassButton type="submit" variant="primary" disabled={saving} className="sheen">
          {saving ? "uploading…" : isEditing ? "save changes" : "publish"}
        </GlassButton>
      </div>
    </form>
  );
}
