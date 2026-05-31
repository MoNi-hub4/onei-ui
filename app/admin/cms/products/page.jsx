"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Package, Sparkles, X, Eye, Pencil } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const emptyProductForm = {
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
};

const getProductId = (product) => product?._id || product?.id;

const cleanProductForForm = (product) => ({
  name: product?.name || "",
  slug: product?.slug || "",
  price: product?.price || "",
  image: product?.image || "",
  variants: product?.variants || [],
  category: product?.category || "",
  productType: product?.productType || "",
  productSubType: product?.productSubType || "",
  brand: product?.brand || "",
  sku: product?.sku || "",
  stockStatus: product?.stockStatus || "in-stock",
  description: product?.description || "",
  gallery: product?.gallery || [],
  specifications: product?.specifications || [],
  warranty: product?.warranty || "",
  isActive: product?.isActive ?? true,
});

export default function ProductManagerPage() {
  const [assets, setAssets] = useState([]);
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDraftPreview, setShowDraftPreview] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  const [aiInput, setAiInput] = useState({
    productName: "",
    officialUrl: "",
  });

  const [form, setForm] = useState(emptyProductForm);

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

  const handleAiGenerate = async () => {
    if (!aiInput.productName || !aiInput.officialUrl) {
      alert("Enter product name and official/product URL");
      return;
    }

    try {
      setGenerating(true);

      const res = await fetch("/api/cms/products/ai-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aiInput),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "AI generation failed");
      }

      setForm({
        ...form,
        name: data.product.name || form.name,
        slug: data.product.slug || form.slug,
        price: data.product.price || form.price,
        category: data.product.category || form.category,
        productType: data.product.productType || form.productType,
        productSubType: data.product.productSubType || form.productSubType,
        brand: data.product.brand || form.brand,
        sku: data.product.sku || form.sku,
        stockStatus: data.product.stockStatus || form.stockStatus,
        description: data.product.description || form.description,
        specifications: data.product.specifications || form.specifications,
        warranty: data.product.warranty || form.warranty,
        isActive: data.product.isActive ?? form.isActive,

        image: form.image,
        variants: form.variants,
        gallery: form.gallery,
      });

      alert("AI generated product text. Review before saving.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setGenerating(false);
    }
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
      specifications: [...form.specifications, { label: "", value: "" }],
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

  const resetForm = () => {
    setForm(emptyProductForm);
    setEditingProductId(null);
  };

  const handleEditProduct = (product) => {
    const productId = getProductId(product);

    if (!productId) {
      alert("Product ID not found");
      return;
    }

    setForm(cleanProductForForm(product));
    setEditingProductId(productId);
    setSelectedProduct(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteProduct = async (product) => {
    const productId = getProductId(product);

    if (!productId) {
      alert("Product ID not found");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${product.name || "this product"}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingProductId(productId);

      const res = await fetch(`/api/cms/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete product");
      }

      setProducts(products.filter((item) => getProductId(item) !== productId));

      if (editingProductId === productId) {
        resetForm();
      }

      if (getProductId(selectedProduct) === productId) {
        setSelectedProduct(null);
      }

      alert("Product deleted successfully");
    } catch (error) {
      alert(error.message);
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.image) {
      alert("Product name, price and main image are required");
      return;
    }

    try {
      setSaving(true);

      const isEditing = Boolean(editingProductId);

      const res = await fetch(
        isEditing ? `/api/cms/products/${editingProductId}` : "/api/cms/products",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            (isEditing ? "Failed to update product" : "Failed to save product")
        );
      }

      if (isEditing) {
        setProducts(
          products.map((product) =>
            getProductId(product) === editingProductId ? data.product : product
          )
        );
        alert("Product updated successfully");
      } else {
        setProducts([data.product, ...products]);
        alert("Product saved successfully");
      }

      resetForm();
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='28'%3EProduct%3C/text%3E%3C/svg%3E";

  const draftProduct = {
    ...form,
    name: form.name || "Product Name",
    slug: form.slug || "product-slug",
    price: form.price || "Rs 0.00",
    image: form.image || placeholderImage,
    variants: form.variants || [],
    gallery: form.gallery || [],
    specifications: form.specifications || [],
  };

  const previewProduct = {
    name: draftProduct.name,
    price: draftProduct.price,
    image: draftProduct.image,
    colors: draftProduct.variants.map((item) => item.image).filter(Boolean),
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
            <div className="space-y-4 rounded-2xl bg-neutral-50 p-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                <h2 className="font-bold">AI Product Generator</h2>
              </div>

              <input
                value={aiInput.productName}
                onChange={(e) =>
                  setAiInput({
                    ...aiInput,
                    productName: e.target.value,
                  })
                }
                placeholder="Product name, e.g. iPhone 17e"
                className="h-11 w-full rounded-xl border px-4 outline-none"
              />

              <input
                value={aiInput.officialUrl}
                onChange={(e) =>
                  setAiInput({
                    ...aiInput,
                    officialUrl: e.target.value,
                  })
                }
                placeholder="Official or product URL"
                className="h-11 w-full rounded-xl border px-4 outline-none"
              />

              <button
                onClick={handleAiGenerate}
                disabled={generating}
                className="h-11 w-full rounded-xl bg-black text-white disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate Product Text"}
              </button>
            </div>

            <SectionTitle title="Basic Information" />

            <Input
              label="Product Name"
              value={form.name}
              onChange={(v) => updateField("name", v)}
            />
            <Input
              label="Slug"
              value={form.slug}
              onChange={(v) => updateField("slug", v)}
              placeholder="iphone-16-pro"
            />
            <Input
              label="Price"
              value={form.price}
              onChange={(v) => updateField("price", v)}
              placeholder="Rs 399,900.00"
            />

            <AssetSelect
              label="Main Image"
              value={form.image}
              assets={assets}
              onChange={(v) => updateField("image", v)}
            />

            <SectionTitle title="Taxonomy" />

            <Input
              label="Category"
              value={form.category}
              onChange={(v) => updateField("category", v)}
              placeholder="Apple"
            />
            <Input
              label="Product Type"
              value={form.productType}
              onChange={(v) => updateField("productType", v)}
              placeholder="iPhone"
            />
            <Input
              label="Product Sub Type"
              value={form.productSubType}
              onChange={(v) => updateField("productSubType", v)}
              placeholder="Pro Series"
            />
            <Input
              label="Brand"
              value={form.brand}
              onChange={(v) => updateField("brand", v)}
              placeholder="Apple"
            />

            <SectionTitle title="Variants" />

            <button
              onClick={addVariant}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-black text-white"
            >
              <Plus size={16} />
              Add Variant
            </button>

            {form.variants.map((variant, index) => (
              <div
                key={index}
                className="space-y-3 rounded-2xl bg-neutral-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">Variant #{index + 1}</p>
                  <button
                    onClick={() => removeVariant(index)}
                    className="text-red-500"
                  >
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

            <Input
              label="SKU"
              value={form.sku}
              onChange={(v) => updateField("sku", v)}
            />

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

            <Textarea
              label="Description"
              value={form.description}
              onChange={(v) => updateField("description", v)}
            />
            <Input
              label="Warranty"
              value={form.warranty}
              onChange={(v) => updateField("warranty", v)}
            />

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
                  <button
                    onClick={() => removeGalleryImage(index)}
                    className="text-red-500"
                  >
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
              <div
                key={index}
                className="space-y-3 rounded-2xl bg-neutral-50 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">Spec #{index + 1}</p>
                  <button
                    onClick={() => removeSpecification(index)}
                    className="text-red-500"
                  >
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

            <div className="space-y-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-black text-white disabled:opacity-50"
              >
                <Save size={16} />
                {saving
                  ? editingProductId
                    ? "Updating..."
                    : "Saving..."
                  : editingProductId
                    ? "Update Product"
                    : "Save Product"}
              </button>

              {editingProductId && (
                <button
                  onClick={resetForm}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border bg-white font-medium hover:bg-neutral-50"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
                <Package size={18} />
              </div>

              <div>
                <h2 className="font-bold">Live Product Preview</h2>
                <p className="text-xs text-neutral-400">
                  Card preview and PDP preview before saving
                </p>
              </div>
            </div>

            <div className="mb-5 rounded-[2rem] bg-[#f7f7f7] p-5">
              <ProductCard product={previewProduct} />
            </div>

            <button
              onClick={() => setShowDraftPreview(true)}
              className="mb-8 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border bg-white font-medium hover:bg-neutral-50"
            >
              <Eye size={16} />
              Preview PDP Before Save
            </button>

            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-bold">Saved Products</h2>

              {editingProductId && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  Editing product
                </span>
              )}
            </div>

            <div className="flex gap-5 overflow-x-auto pb-4">
              {products.map((product) => {
                const productId = getProductId(product);
                const isDeleting = deletingProductId === productId;

                return (
                  <div
                    key={productId}
                    className="w-[260px] shrink-0 rounded-[2rem] border bg-white p-3 shadow-sm"
                  >
                    <div
                      onClick={() => setSelectedProduct(product)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setSelectedProduct(product);
                        }
                      }}
                      className="cursor-pointer text-left"
                    >
                      <ProductCard
                        product={{
                          ...product,
                          colors:
                            product.variants
                              ?.map((variant) => variant.image)
                              .filter(Boolean) || [],
                        }}
                      />
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        className="flex h-10 items-center justify-center gap-1 rounded-xl border text-xs font-medium hover:bg-neutral-50"
                      >
                        <Eye size={14} />
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEditProduct(product)}
                        className="flex h-10 items-center justify-center gap-1 rounded-xl border text-xs font-medium hover:bg-neutral-50"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product)}
                        disabled={isDeleting}
                        className="flex h-10 items-center justify-center gap-1 rounded-xl border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        {isDeleting ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {showDraftPreview && (
        <ProductPreviewModal
          product={draftProduct}
          onClose={() => setShowDraftPreview(false)}
        />
      )}

      {selectedProduct && (
        <ProductPreviewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

function ProductPreviewModal({ product, onClose }) {
  const colors =
    product.variants?.map((variant) => variant.image).filter(Boolean) || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4 backdrop-blur-sm">
      <div className="mx-auto flex max-h-[92vh] max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-sm text-neutral-500">
              Full product data preview
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border hover:bg-neutral-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div>
              <div className="rounded-[2rem] bg-[#f7f7f7] p-5">
                <ProductCard
                  product={{
                    ...product,
                    colors,
                  }}
                />
              </div>

              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="mt-5 h-56 w-full rounded-2xl bg-neutral-100 object-contain p-4"
                />
              )}
            </div>

            <div className="space-y-5">
              <DataSection title="Basic Info">
                <DataRow label="Name" value={product.name} />
                <DataRow label="Slug" value={product.slug} />
                <DataRow label="Price" value={product.price} />
                <DataRow label="SKU" value={product.sku} />
                <DataRow label="Stock Status" value={product.stockStatus} />
                <DataRow
                  label="Active"
                  value={product.isActive ? "Yes" : "No"}
                />
              </DataSection>

              <DataSection title="Taxonomy">
                <DataRow label="Category" value={product.category} />
                <DataRow label="Product Type" value={product.productType} />
                <DataRow
                  label="Product Sub Type"
                  value={product.productSubType}
                />
                <DataRow label="Brand" value={product.brand} />
              </DataSection>

              <DataSection title="Description">
                <p className="text-sm leading-6 text-neutral-700">
                  {product.description || "No description added."}
                </p>
              </DataSection>

              <DataSection title="Warranty">
                <p className="text-sm text-neutral-700">
                  {product.warranty || "No warranty added."}
                </p>
              </DataSection>

              <DataSection title="Variants">
                {product.variants?.length ? (
                  <div className="grid grid-cols-2 gap-3">
                    {product.variants.map((variant, index) => (
                      <div
                        key={index}
                        className="rounded-2xl bg-neutral-50 p-3"
                      >
                        <p className="text-sm font-medium">
                          {variant.name || `Variant ${index + 1}`}
                        </p>

                        {variant.image && (
                          <img
                            src={variant.image}
                            alt={variant.name}
                            className="mt-3 h-24 w-full rounded-xl bg-white object-contain"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">No variants added.</p>
                )}
              </DataSection>

              <DataSection title="Gallery">
                {product.gallery?.filter(Boolean).length ? (
                  <div className="grid grid-cols-3 gap-3">
                    {product.gallery.filter(Boolean).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt=""
                        className="h-28 w-full rounded-xl bg-neutral-100 object-contain p-2"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">
                    No gallery images added.
                  </p>
                )}
              </DataSection>

              <DataSection title="Specifications">
                {product.specifications?.length ? (
                  <div className="overflow-hidden rounded-2xl border">
                    {product.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[160px_1fr] border-b last:border-b-0"
                      >
                        <div className="bg-neutral-50 px-4 py-3 text-sm font-medium">
                          {spec.label || "-"}
                        </div>

                        <div className="px-4 py-3 text-sm text-neutral-700">
                          {spec.value || "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">
                    No specifications added.
                  </p>
                )}
              </DataSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataSection({ title, children }) {
  return (
    <section className="rounded-2xl border bg-white p-4">
      <h3 className="mb-3 font-bold">{title}</h3>
      {children}
    </section>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="grid grid-cols-[140px_1fr] border-b py-2 last:border-b-0">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="text-sm font-medium text-neutral-900">{value || "-"}</p>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h2 className="border-t pt-5 text-lg font-bold first:border-t-0 first:pt-0">
      {title}
    </h2>
  );
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