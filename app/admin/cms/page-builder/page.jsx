"use client";

import { useEffect, useState } from "react";
import { Reorder, useDragControls } from "framer-motion";
import {
  Image,
  Save,
  Eye,
  Plus,
  LogOut,
  Monitor,
  Smartphone,
  GripVertical,
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
  const [previewMode, setPreviewMode] = useState("mobile");
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
        body: JSON.stringify({ widgets }),
      });

      if (!res.ok) throw new Error("Failed to save CMS layout");

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
      <div className="h-screen flex items-center justify-center bg-[#f6f7f9]">
        <p className="text-sm text-neutral-500">Loading CMS...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[linear-gradient(180deg,#f8fafc_0%,#f1f3f6_100%)] text-neutral-900">
      <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-black/5 flex items-center justify-between px-6 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div>
          <h1 className="font-bold text-lg tracking-tight">Onei CMS</h1>
          <p className="text-xs text-neutral-400 -mt-0.5">Homepage builder</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 rounded-2xl border border-black/5 bg-neutral-100/80 p-1 flex items-center shadow-inner">
            <button
              onClick={() => setPreviewMode("desktop")}
              className={`h-8 px-3 rounded-xl flex items-center gap-2 text-sm transition-all ${
                previewMode === "desktop"
                  ? "bg-white shadow-sm text-black"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              <Monitor size={15} />
              Desktop
            </button>

            <button
              onClick={() => setPreviewMode("mobile")}
              className={`h-8 px-3 rounded-xl flex items-center gap-2 text-sm transition-all ${
                previewMode === "mobile"
                  ? "bg-white shadow-sm text-black"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              <Smartphone size={15} />
              Mobile
            </button>
          </div>

          <button className="h-10 px-4 rounded-2xl border border-black/5 bg-white hover:bg-neutral-50 transition flex items-center gap-2 shadow-sm">
            <Eye size={16} />
            Preview
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="h-10 px-5 rounded-2xl bg-black text-white flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-black/10 hover:bg-neutral-800 transition"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleLogout}
            className="h-10 px-4 rounded-2xl border border-black/5 bg-white hover:bg-red-50 hover:text-red-600 transition flex items-center gap-2 shadow-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-[300px_1fr_380px] gap-4 overflow-hidden p-4">
        <aside className="bg-white/90 backdrop-blur-xl rounded-[1.75rem] border border-black/5 shadow-sm p-5 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold tracking-tight">Homepage Layout</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Drag handle to reorder widgets
              </p>
            </div>

            <button
              onClick={addVideoModule}
              className="w-10 h-10 rounded-2xl border border-black/5 bg-black text-white flex items-center justify-center shadow-lg shadow-black/10 hover:scale-105 transition"
            >
              <Plus size={17} />
            </button>
          </div>

          {widgets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50 p-5 text-center">
              <p className="text-sm text-neutral-400">No widgets added yet.</p>
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={widgets}
              onReorder={setWidgets}
              className="space-y-3"
            >
              {widgets.map((widget, index) => (
                <DraggableWidgetItem
                  key={widget.id}
                  widget={widget}
                  index={index}
                  selectedWidget={selectedWidget}
                  setSelectedWidget={setSelectedWidget}
                />
              ))}
            </Reorder.Group>
          )}
        </aside>

        <main className="overflow-y-auto">
          <div
            className={`mx-auto transition-all duration-300 ${
              previewMode === "mobile" ? "w-[414px]" : "max-w-6xl w-full"
            }`}
          >
            <div
              className={`bg-white border border-black/5 overflow-hidden shadow-xl shadow-black/[0.04] ${
                previewMode === "mobile"
                  ? "rounded-[2.75rem] border-neutral-200"
                  : "rounded-[2rem]"
              }`}
            >
              <div className="p-5 border-b border-black/5 bg-white/80 backdrop-blur flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-xl tracking-tight">
                    Homepage Preview
                  </h2>

                  <p className="text-sm text-neutral-400 mt-1">
                    {previewMode === "mobile"
                      ? "iPhone XR preview - 414px"
                      : "Desktop preview"}
                  </p>
                </div>

                <span className="text-xs px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-500">
                  {widgets.length} widget{widgets.length === 1 ? "" : "s"}
                </span>
              </div>

              <div
                className={
                  previewMode === "mobile"
                    ? "min-h-[896px] bg-white"
                    : "bg-white"
                }
              >
                {widgets.length === 0 ? (
                  <div className="h-72 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mb-3">
                        <Plus size={18} className="text-neutral-400" />
                      </div>
                      <p className="text-sm text-neutral-400">
                        click + to add video module
                      </p>
                    </div>
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

        <aside className="bg-white/90 backdrop-blur-xl rounded-[1.75rem] border border-black/5 shadow-sm overflow-y-auto">
          {!selectedWidgetData ? (
            <div className="p-5">
              <div className="mb-5">
                <h2 className="font-semibold tracking-tight">
                  Available Widgets
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Add reusable modules
                </p>
              </div>

              <button
                onClick={addVideoModule}
                className="w-full p-4 rounded-2xl bg-[#f7f7f8] hover:bg-white hover:shadow-sm ring-1 ring-black/5 cursor-pointer flex items-center gap-3 text-left transition-all"
              >
                <div className="w-10 h-10 rounded-2xl bg-white ring-1 ring-black/5 flex items-center justify-center">
                  <Image size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold">Video Module</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    autoplay video banner
                  </p>
                </div>
              </button>
            </div>
          ) : (
            <VideoModuleCmsEditor
              data={selectedWidgetData.data}
              setData={updateSelectedWidgetData}
              onDelete={deleteSelectedWidget}
              onBack={() => setSelectedWidget(null)}
            />
          )}
        </aside>
      </div>
    </div>
  );
}

function DraggableWidgetItem({
  widget,
  index,
  selectedWidget,
  setSelectedWidget,
}) {
  const dragControls = useDragControls();
  const isSelected = selectedWidget === widget.id;

  return (
    <Reorder.Item
      value={widget}
      dragListener={false}
      dragControls={dragControls}
      layout
      transition={{
        layout: {
          type: "spring",
          stiffness: 500,
          damping: 35,
        },
      }}
      whileDrag={{
        scale: 1.03,
        zIndex: 50,
        boxShadow: "0 18px 40px rgba(0,0,0,0.14)",
      }}
      className={`group w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-colors ${
        isSelected
          ? "bg-black text-white shadow-lg shadow-black/10 ring-1 ring-black"
          : "bg-[#f7f7f8] hover:bg-white hover:shadow-sm ring-1 ring-black/5"
      }`}
      onClick={() => setSelectedWidget(widget.id)}
    >
      <button
        type="button"
        onPointerDown={(event) => {
          event.preventDefault();
          dragControls.start(event);
        }}
        className={`w-8 h-8 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0 ${
          isSelected
            ? "bg-white/10 text-white/60"
            : "bg-white text-neutral-400 ring-1 ring-black/5"
        }`}
      >
        <GripVertical size={16} />
      </button>

      <div>
        <p className="text-sm font-semibold">Video Module #{index + 1}</p>

        <p
          className={`text-xs mt-0.5 ${
            isSelected ? "text-white/50" : "text-neutral-400"
          }`}
        >
          video widget
        </p>
      </div>
    </Reorder.Item>
  );
}
