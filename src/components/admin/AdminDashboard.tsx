"use client";

import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import VideoForm from "@/components/admin/VideoForm";
import AdminVideoCard from "@/components/admin/AdminVideoCard";
import ConfirmDeleteModal from "@/components/admin/ConfirmDeleteModal";
import GlassPanel from "@/components/ui/GlassPanel";
import GlassButton from "@/components/ui/GlassButton";
import { createClient } from "@/lib/supabase/client";
import { removeFromBucket } from "@/lib/supabase/storage";
import type { Video } from "@/types/video";

export default function AdminDashboard({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState(initialVideos);
  const [formOpen, setFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<Video | null>(null);

  function openNewForm() {
    setEditingVideo(null);
    setFormOpen(true);
  }

  function openEditForm(video: Video) {
    setEditingVideo(video);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingVideo(null);
  }

  function handleSaved(saved: Video) {
    setVideos((prev) => {
      const withoutSaved = prev.filter((v) => v.id !== saved.id);
      // Mirror the un-featuring side effect VideoForm already applied in the database.
      const cleared = saved.featured
        ? withoutSaved.map((v) => ({ ...v, featured: false }))
        : withoutSaved;
      return [saved, ...cleared].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
    closeForm();
  }

  async function confirmDelete() {
    const video = deletingVideo;
    if (!video) return;
    setDeletingVideo(null);

    const supabase = createClient();
    if (!supabase) {
      alert("admin isn't connected yet.");
      return;
    }

    const { error } = await supabase.from("videos").delete().eq("id", video.id);
    if (error) {
      alert("Couldn't delete this video. Please try again.");
      return;
    }

    setVideos((prev) => prev.filter((v) => v.id !== video.id));

    if (video.thumbnail_url) await removeFromBucket("thumbnails", video.thumbnail_url);
    if (video.video_url) await removeFromBucket("videos", video.video_url);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-wide text-ink-soft/70">
          {videos.length} {videos.length === 1 ? "video" : "videos"}
        </h2>
        {!formOpen && (
          <GlassButton variant="primary" onClick={openNewForm} className="sheen">
            <Plus size={16} strokeWidth={2} />
            upload
          </GlassButton>
        )}
      </div>

      {formOpen && (
        <VideoForm video={editingVideo ?? undefined} onSaved={handleSaved} onCancel={closeForm} />
      )}

      {videos.length === 0 ? (
        <GlassPanel
          intensity="soft"
          className="mx-auto flex max-w-md flex-col items-center justify-center px-10 py-20 text-center"
        >
          <div className="mb-4 rounded-full border border-white/10 bg-white/5 p-4">
            <Sparkles size={22} strokeWidth={1.5} className="text-rose-200/60" />
          </div>
          <p className="text-lg text-zinc-400">nothing uploaded yet.</p>
          <p className="mt-1.5 text-sm text-zinc-600">add your first video.</p>
        </GlassPanel>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <AdminVideoCard
              key={video.id}
              video={video}
              onEdit={() => openEditForm(video)}
              onDelete={() => setDeletingVideo(video)}
            />
          ))}
        </div>
      )}

      <ConfirmDeleteModal video={deletingVideo} onCancel={() => setDeletingVideo(null)} onConfirm={confirmDelete} />
    </div>
  );
}
