"use client";

import { useEffect, useState } from "react";
import VideoModule from "@/components/widgets/VideoModule";

export default function CmsBottomClient() {
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    async function loadWidgets() {
      const res = await fetch("/api/cms/page-builder");
      const data = await res.json();

      setWidgets(data.widgets || []);
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

        return null;
      })}
    </div>
  );
}