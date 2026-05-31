"use client";

import { useEffect, useState } from "react";
import { Upload, X } from "lucide-react";

export default function AssetManagerPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const loadAssets = async () => {
    const res = await fetch("/api/cms/assets");
    const data = await res.json();

    setAssets(data.assets || []);
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files || []));
    setMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    setUploading(true);
    setMessage("");

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    const res = await fetch("/api/cms/assets", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setUploading(false);

    if (data.success) {
      setMessage("Images uploaded successfully");
      setSelectedFiles([]);
      await loadAssets();
    } else {
      setMessage(data.message || "Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9] p-6">
      <div className="mx-auto max-w-5xl bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden">
        <div className="h-16 border-b border-black/5 px-6 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl">
              Asset Manager
            </h1>
            <p className="text-sm text-neutral-400">
              Upload and manage CMS images
            </p>
          </div>

          <button
            onClick={() => window.close()}
            className="h-10 px-4 rounded-2xl border border-black/5 flex items-center gap-2"
          >
            <X size={16} />
            Close
          </button>
        </div>

        <div className="p-6">
          <label className="block border border-dashed border-black/10 rounded-3xl p-8 text-center cursor-pointer bg-neutral-50">
            <Upload className="mx-auto mb-3 text-neutral-400" />
            <p className="font-medium">
              Add Images
            </p>
            <p className="text-sm text-neutral-400 mt-1">
              Select images from your PC or Mac
            </p>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {selectedFiles.length > 0 && (
            <div className="mt-6 rounded-2xl border border-black/5 p-4">
              <h2 className="font-semibold mb-3">
                Selected Images
              </h2>

              <div className="space-y-2">
                {selectedFiles.map((file) => (
                  <p
                    key={file.name}
                    className="text-sm text-neutral-600 bg-neutral-50 rounded-xl px-4 py-2"
                  >
                    {file.name}
                  </p>
                ))}
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="h-11 px-5 rounded-2xl bg-black text-white disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>

                <button
                  onClick={() => window.close()}
                  className="h-11 px-5 rounded-2xl border border-black/5"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {message && (
            <p className="mt-5 text-sm font-medium text-green-600">
              {message}
            </p>
          )}

          <div className="mt-8">
            <h2 className="font-bold mb-4">
              Uploaded Assets
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <div
                  key={asset._id}
                  className="rounded-2xl border border-black/5 bg-neutral-50 p-3"
                >
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="h-32 w-full object-contain bg-white rounded-xl"
                  />

                  <p className="text-xs mt-3 truncate">
                    {asset.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}