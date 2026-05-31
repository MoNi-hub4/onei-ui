"use client";

import { useEffect, useState } from "react";
import {
  Image,
  Save,
  Eye,
  Plus,
  LogOut,
  Monitor,
  Smartphone,
} from "lucide-react";

import VideoModule from "@/components/widgets/VideoModule";
import VideoModuleCmsEditor from "@/components/cms/widgets/VideoModuleCmsEditor";

const handleLogout = () => {
  document.cookie =
    "admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

  window.location.href = "/admin/login";
};

export default function PageBuilder() {
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [widgets, setWidgets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCmsPage() {
      try {
        const res = await fetch("/api/cms/page-builder");
        const data = await res.json();

        setWidgets(data.widgets || []);
      } catch (error) {
        console.error("Failed to load CMS page:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCmsPage();
  }, []);

  const addVideoModule = () => {
    const newWidget = {
      id: Date.now(),
      type: "video-module",
      data: {
        videoUrl: "/hero-video.mp4",
        posterUrl: "/video-poster.jpg",
        spacingTop: 0,
        spacingBottom: 0,
      },
    };

    setWidgets([...widgets, newWidget]);
    setSelectedWidget(newWidget.id);
  };

  const selectedWidgetData = widgets.find(
    (widget) => widget.id === selectedWidget,
  );

  const updateSelectedWidgetData = (newData) => {
    setWidgets(
      widgets.map((widget) =>
        widget.id === selectedWidget ? { ...widget, data: newData } : widget,
      ),
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const res = await fetch("/api/cms/page-builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          widgets,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save CMS layout");
      }

      alert("CMS layout saved to MongoDB");
    } catch (error) {
      console.error(error);
      alert("Failed to save CMS layout");
    } finally {
      setSaving(false);
    }
  };

  const deleteSelectedWidget = () => {
    setWidgets(widgets.filter((widget) => widget.id !== selectedWidget));

    setSelectedWidget(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-100">
        <p className="text-neutral-500">Loading CMS...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-neutral-100">
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        <h1 className="font-bold text-lg">Onei CMS</h1>

        <div className="flex items-center gap-3">
          <div className="h-10 rounded-xl border bg-neutral-100 p-1 flex items-center">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`h-8 px-3 rounded-lg flex items-center gap-2 text-sm ${
                previewMode === "desktop"
                  ? "bg-white shadow-sm text-black"
                  : "text-neutral-500"
              }`}
            >
              <Monitor size={15} />
              Desktop
            </button>

            <button
              onClick={() => setPreviewMode("mobile")}
              className={`h-8 px-3 rounded-lg flex items-center gap-2 text-sm ${
                previewMode === "mobile"
                  ? "bg-white shadow-sm text-black"
                  : "text-neutral-500"
              }`}
            >
              <Smartphone size={15} />
              Mobile
            </button>
          </div>

          <button className="h-10 px-4 rounded-xl border bg-white flex items-center gap-2">
            <Eye size={16} />
            Preview
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="h-10 px-4 rounded-xl bg-black text-white flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleLogout}
            className="h-10 px-4 rounded-xl border flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-[280px_1fr_360px] overflow-hidden">
        <aside className="bg-white border-r p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Homepage Layout</h2>

            <button
              onClick={addVideoModule}
              className="w-9 h-9 rounded-xl border flex items-center justify-center"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {widgets.map((widget, index) => (
              <button
                key={widget.id}
                onClick={() => setSelectedWidget(widget.id)}
                className={`w-full p-4 rounded-2xl border text-left ${
                  selectedWidget === widget.id
                    ? "border-black bg-neutral-100"
                    : "bg-neutral-50"
                }`}
              >
                Video Module #{index + 1}
              </button>
            ))}
          </div>
        </aside>

        <main className="overflow-y-auto p-6">
          <div
            className={`mx-auto transition-all duration-300 ${
              previewMode === "mobile" ? "w-[414px]" : "max-w-5xl w-full"
            }`}
          >
            <div
              className={`bg-white shadow-sm border overflow-hidden ${
                previewMode === "mobile"
                  ? "rounded-[2.5rem] border-neutral-300"
                  : "rounded-3xl"
              }`}
            >
              <div className="p-5 border-b">
                <h2 className="font-bold text-xl">Homepage Preview</h2>

                <p className="text-sm text-neutral-500 mt-1">
                  {previewMode === "mobile"
                    ? "iPhone XR preview - 414px"
                    : "Desktop preview"}
                </p>
              </div>

              <div
                className={
                  previewMode === "mobile"
                    ? "min-h-[896px] bg-white"
                    : "bg-white"
                }
              >
                {widgets.length === 0 ? (
                  <div className="h-72 flex items-center justify-center text-neutral-400">
                    click + to add video module
                  </div>
                ) : (
                  widgets.map((widget) => {
                    if (widget.type === "video-module") {
                      return <VideoModule key={widget.id} data={widget.data} />;
                    }

                    return null;
                  })
                )}
              </div>
            </div>
          </div>
        </main>

        <aside className="bg-white border-l overflow-y-auto">
          {!selectedWidgetData ? (
            <div className="p-5">
              <h2 className="font-semibold mb-5">Available Widgets</h2>

              <button
                onClick={addVideoModule}
                className="w-full p-4 rounded-2xl border hover:bg-neutral-50 cursor-pointer flex items-center gap-3 text-left"
              >
                <Image size={18} />
                <span>Video Module</span>
              </button>
            </div>
          ) : (
            <VideoModuleCmsEditor
              data={selectedWidgetData.data}
              setData={updateSelectedWidgetData}
              onDelete={deleteSelectedWidget}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
