"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Package } from "lucide-react";
import ProductCard from "@/components/ProductCard";

export default function ProductManagerPage() {
  const [assets, setAssets] = useState([]);
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    image: "",
    variants: [],
    category: "",
    productType: "",
    productSubType: "",
    brand: "",
    sku: "",
    stockStatus: "in-stock",
    description: "",
    gallery: [],
    specifications: [],
    warranty: "",
    isActive: true,
  });

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      const [assetRes, productRes] = await Promise.all([
        fetch("/api/cms/assets"),
        fetch("/api/cms/products"),
      ]);

      const assetData = await assetRes.json();
      const productData = await productRes.json();

      if (!ignore) {
        setAssets(assetData.assets || []);
        setProducts(productData.products || []);
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const addVariant = () => {
    setForm({
      ...form,
      variants: [...form.variants, { name: "", image: "" }],
    });
  };

  const updateVariant = (index, field, value) => {
    const updated = [...form.variants];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, variants: updated });
  };

  const removeVariant = (index) => {
    setForm({
      ...form,
      variants: form.variants.filter((_, i) => i !== index),
    });
  };

  const addGalleryImage = () => {
    setForm({
      ...form,
      gallery: [...form.gallery, ""],
    });
  };

  const updateGalleryImage = (index, value) => {
    const updated = [...form.gallery];
    updated[index] = value;
    setForm({ ...form, gallery: updated });
  };

  const removeGalleryImage = (index) => {
    setForm({
      ...form,
      gallery: form.gallery.filter((_, i) => i !== index),
    });
  };

  const addSpecification = () => {
    setForm({
      ...form,
      specifications: [
        ...form.specifications,
        { label: "", value: "" },
      ],
    });
  };

  const updateSpecification = (index, field, value) => {
    const updated = [...form.specifications];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, specifications: updated });
  };

  const removeSpecification = (index) => {
    setForm({
      ...form,
      specifications: form.specifications.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.image) {
      alert("Product name, price and main image are required");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch("/api/cms/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save product");
      }

      setProducts([data.product, ...products]);

      alert("Product saved successfully");
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const previewProduct = {
    name: form.name || "Product Name",
    price: form.price || "Rs 0.00",
    image: form.image || "/products/sample.png",
    colors: form.variants.map((item) => item.image).filter(Boolean),
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Product Manager</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Create product card data now, PDP data later.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[460px_1fr]">
          <section className="space-y-5 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <SectionTitle title="Basic Information" />

            <Input label="Product Name" value={form.name} onChange={(v) => updateField("name", v)} />
            <Input label="Slug" value={form.slug} onChange={(v) => updateField("slug", v)} placeholder="iphone-16-pro" />
            <Input label="Price" value={form.price} onChange={(v) => updateField("price", v)} placeholder="Rs 399,900.00" />

            <AssetSelect
              label="Main Image"
              value={form.image}
              assets={assets}
              onChange={(v) => updateField("image", v)}
            />

            <SectionTitle title="Taxonomy" />

            <Input label="Category" value={form.category} onChange={(v) => updateField("category", v)} placeholder="Apple" />
            <Input label="Product Type" value={form.productType} onChange={(v) => updateField("productType", v)} placeholder="iPhone" />
            <Input label="Product Sub Type" value={form.productSubType} onChange={(v) => updateField("productSubType", v)} placeholder="Pro Series" />
            <Input label="Brand" value={form.brand} onChange={(v) => updateField("brand", v)} placeholder="Apple" />

            <SectionTitle title="Variants" />

            <button
              onClick={addVariant}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-black text-white"
            >
              <Plus size={16} />
              Add Variant
            </button>

            {form.variants.map((variant, index) => (
              <div key={index} className="space-y-3 rounded-2xl bg-neutral-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Variant #{index + 1}</p>
                  <button onClick={() => removeVariant(index)} className="text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>

                <Input
                  label="Variant Name"
                  value={variant.name}
                  onChange={(v) => updateVariant(index, "name", v)}
                  placeholder="Black Titanium"
                />

                <AssetSelect
                  label="Variant Image"
                  value={variant.image}
                  assets={assets}
                  onChange={(v) => updateVariant(index, "image", v)}
                />
              </div>
            ))}

            <SectionTitle title="PDP Information" />

            <Input label="SKU" value={form.sku} onChange={(v) => updateField("sku", v)} />

            <div>
              <label className="text-sm font-medium">Stock Status</label>
              <select
                value={form.stockStatus}
                onChange={(e) => updateField("stockStatus", e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border px-4 outline-none"
              >
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
                <option value="pre-order">Pre Order</option>
                <option value="coming-soon">Coming Soon</option>
              </select>
            </div>

            <Textarea label="Description" value={form.description} onChange={(v) => updateField("description", v)} />
            <Input label="Warranty" value={form.warranty} onChange={(v) => updateField("warranty", v)} />

            <SectionTitle title="Gallery" />

            <button
              onClick={addGalleryImage}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border"
            >
              <Plus size={16} />
              Add Gallery Image
            </button>

            {form.gallery.map((image, index) => (
              <div key={index} className="rounded-2xl bg-neutral-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-medium">Gallery Image #{index + 1}</p>
                  <button onClick={() => removeGalleryImage(index)} className="text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>

                <AssetSelect
                  label="Image"
                  value={image}
                  assets={assets}
                  onChange={(v) => updateGalleryImage(index, v)}
                />
              </div>
            ))}

            <SectionTitle title="Specifications" />

            <button
              onClick={addSpecification}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border"
            >
              <Plus size={16} />
              Add Specification
            </button>

            {form.specifications.map((spec, index) => (
              <div key={index} className="space-y-3 rounded-2xl bg-neutral-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Spec #{index + 1}</p>
                  <button onClick={() => removeSpecification(index)} className="text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>

                <Input
                  label="Label"
                  value={spec.label}
                  onChange={(v) => updateSpecification(index, "label", v)}
                  placeholder="Display"
                />

                <Input
                  label="Value"
                  value={spec.value}
                  onChange={(v) => updateSpecification(index, "value", v)}
                  placeholder="6.3-inch Super Retina XDR"
                />
              </div>
            ))}

            <label className="flex items-center gap-3 rounded-2xl border p-4">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
              />
              Active Product
            </label>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-black text-white disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Product"}
            </button>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                <Package size={18} />
              </div>

              <div>
                <h2 className="font-bold">Product Card Preview</h2>
                <p className="text-xs text-neutral-400">
                  Uses your existing production ProductCard
                </p>
              </div>
            </div>

            <div className="mb-8 rounded-[2rem] bg-[#f7f7f7] p-5">
              <ProductCard product={previewProduct} />
            </div>

            <h2 className="mb-4 font-bold">Saved Products</h2>

            <div className="flex gap-5 overflow-x-auto pb-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={{
                    ...product,
                    colors: product.variants?.map((v) => v.image).filter(Boolean) || [],
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return <h2 className="border-t pt-5 text-lg font-bold first:border-t-0 first:pt-0">{title}</h2>;
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-xl border px-4 outline-none focus:border-black"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
      />
    </div>
  );
}

function AssetSelect({ label, value, assets, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 h-11 w-full rounded-xl border px-4 outline-none"
      >
        <option value="">Select asset</option>

        {assets.map((asset) => (
          <option key={asset._id} value={asset.url}>
            {asset.name}
          </option>
        ))}
      </select>

      {value && (
        <div className="mt-3 rounded-2xl bg-neutral-50 p-3">
          <img
            src={value}
            alt=""
            className="h-28 w-full rounded-xl bg-white object-contain"
          />
        </div>
      )}
    </div>
  );
}