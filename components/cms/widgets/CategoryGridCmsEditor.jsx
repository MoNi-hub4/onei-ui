"use client";

import { useEffect, useState } from "react";

export default function CategoryGridCmsEditor({
  data,
  setData,
  onDelete,
  onBack,
}) {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function loadAssets() {
      const res = await fetch("/api/cms/assets");
      const result = await res.json();

      setAssets(result.assets || []);
    }

    loadAssets();
  }, []);

  const updateCategory = (index, field, value) => {
    const updatedCategories = [...(data.categories || [])];

    updatedCategories[index] = {
      ...updatedCategories[index],
      [field]: value,
    };

    setData({
      ...data,
      categories: updatedCategories,
    });
  };

  const addCategory = () => {
    setData({
      ...data,
      categories: [
        ...(data.categories || []),
        {
          title: "New Category",
          image: "",
        },
      ],
    });
  };

  const deleteCategory = (index) => {
    setData({
      ...data,
      categories: data.categories.filter((_, i) => i !== index),
    });
  };

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
          <h2 className="text-lg font-bold">Category Grid Settings</h2>
          <p className="text-xs text-neutral-400">Configure category widget</p>
        </div>
      </div>

      <div className="space-y-5">
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

        <button
          onClick={addCategory}
          className="w-full h-11 rounded-xl bg-black text-white font-medium"
        >
          Add Category
        </button>

        {(data.categories || []).map((category, index) => (
          <div
            key={index}
            className="rounded-2xl border border-black/5 bg-neutral-50 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">Category #{index + 1}</p>

              <button
                onClick={() => deleteCategory(index)}
                className="text-xs text-red-500 font-medium"
              >
                Delete
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-500">
                Title
              </label>

              <input
                value={category.title}
                onChange={(e) =>
                  updateCategory(index, "title", e.target.value)
                }
                className="mt-1 w-full h-10 rounded-xl border px-3 outline-none"
                placeholder="Apple"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-500">
                Image URL
              </label>

              <input
                value={category.image}
                onChange={(e) =>
                  updateCategory(index, "image", e.target.value)
                }
                className="mt-1 w-full h-10 rounded-xl border px-3 outline-none"
                placeholder="/categories/apple.webp"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-neutral-500">
                Choose Image From Assets
              </label>

              <select
                value={category.image || ""}
                onChange={(e) =>
                  updateCategory(index, "image", e.target.value)
                }
                className="mt-1 w-full h-10 rounded-xl border px-3 outline-none"
              >
                <option value="">Select image</option>

                {assets.map((asset) => (
                  <option key={asset._id} value={asset.url}>
                    {asset.name}
                  </option>
                ))}
              </select>
            </div>

            {category.image && (
              <div className="rounded-xl border bg-white p-3">
                <p className="text-xs text-neutral-400 mb-2">Mini Preview</p>

                <img
                  src={category.image}
                  alt={category.title}
                  className="h-24 w-full object-contain"
                />
              </div>
            )}
          </div>
        ))}

        <div className="pt-6 border-t">
          <button
            onClick={onDelete}
            className="w-full h-11 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
          >
            Delete Widget
          </button>
        </div>
      </div>
    </div>
  );
}