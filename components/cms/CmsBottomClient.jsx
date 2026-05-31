"use client";

import { useEffect, useState } from "react";

import VideoModule from "@/components/widgets/VideoModule";
import CategoryGridModule from "@/components/widgets/CategoryGridModule";

export default function CmsBottomClient() {
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    async function loadWidgets() {
      try {
        const res = await fetch("/api/cms/page-builder");

        if (!res.ok) {
          throw new Error("Failed to fetch CMS widgets");
        }

        const data = await res.json();

        setWidgets(data.widgets || []);
      } catch (error) {
        console.error("CMS bottom render error:", error);
      }
    }

    loadWidgets();
  }, []);

  if (!widgets.length) return null;

  return (
    <div className="w-full">
      {widgets.map((widget) => {
        if (widget.type === "video-module") {
          return (
            <VideoModule
              key={widget.id}
              data={widget.data}
            />
          );
        }

        if (widget.type === "category-grid") {
          return (
            <CategoryGridModule
              key={widget.id}
              data={widget.data}
            />
          );
        }

        return null;
      })}
    </div>
  );
}