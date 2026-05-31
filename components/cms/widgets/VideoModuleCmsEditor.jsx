"use client";

export default function VideoModuleCmsEditor({
  data,
  setData,
  onDelete,
  onBack,
}) {
  return (
    <div className="p-5">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl border flex items-center justify-center hover:bg-neutral-100"
        >
          ←
        </button>

        <div>
          <h2 className="text-lg font-bold">Video Module Settings</h2>

          <p className="text-xs text-neutral-500">Configure widget</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium">Video URL</label>

          <input
            value={data.videoUrl}
            onChange={(e) =>
              setData({
                ...data,
                videoUrl: e.target.value,
              })
            }
            placeholder="/hero-video.mp4"
            className="mt-2 w-full h-11 rounded-xl border px-4 outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Poster URL</label>

          <input
            value={data.posterUrl}
            onChange={(e) =>
              setData({
                ...data,
                posterUrl: e.target.value,
              })
            }
            placeholder="/video-poster.jpg"
            className="mt-2 w-full h-11 rounded-xl border px-4 outline-none"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Top Spacing (px)</label>

        <input
          type="number"
          value={data.spacingTop || 0}
          onChange={(e) =>
            setData({
              ...data,
              spacingTop: Number(e.target.value),
            })
          }
          className="mt-2 w-full h-11 rounded-xl border px-4 outline-none"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Bottom Spacing (px)</label>

        <input
          type="number"
          value={data.spacingBottom || 0}
          onChange={(e) =>
            setData({
              ...data,
              spacingBottom: Number(e.target.value),
            })
          }
          className="mt-2 w-full h-11 rounded-xl border px-4 outline-none"
        />
      </div>
      <div className="pt-6 border-t mt-6">
        <button
          onClick={onDelete}
          className="w-full h-11 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
        >
          Delete Widget
        </button>
      </div>
    </div>
  );
}
