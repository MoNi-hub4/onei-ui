import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductPageMotion from "./ProductPageMotion";

async function getProduct(slug) {
  await connectDB();

  const query = {
    isActive: { $ne: false },
    slug,
  };

  if (mongoose.Types.ObjectId.isValid(slug)) {
    query.$or = [{ slug }, { _id: slug }];
    delete query.slug;
  }

  const product = await Product.findOne(query).lean();

  if (!product) return null;

  return JSON.parse(JSON.stringify(product));
}

export default async function ProductDisplayPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const variants = product.variants?.filter((variant) => variant.image) || [];
  const gallery = product.gallery?.filter(Boolean) || [];
  const displayImages = [
    product.image,
    ...variants.map((variant) => variant.image),
    ...gallery,
  ].filter(Boolean);

  return (
    <ProductPageMotion>
      <main className="min-h-screen bg-[#f7f7f7] px-4 py-5 text-black">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Back to products
          </Link>

          <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="overflow-hidden rounded-[2.25rem] bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[1.75rem] bg-[#f4f4f4]">
                <div className="absolute left-5 top-5 rounded-full bg-black px-4 py-2 text-xs font-medium text-white">
                  {product.productType || product.category || "Product"}
                </div>

                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-[360px] w-full object-contain p-8 transition duration-700 hover:scale-105"
                  />
                )}
              </div>

              {displayImages.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
                  {displayImages.slice(0, 6).map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="flex h-20 items-center justify-center rounded-2xl bg-[#f4f4f4] p-2 ring-1 ring-black/5"
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[2.25rem] bg-white p-6 shadow-sm ring-1 ring-black/5 lg:p-8">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {product.brand && (
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                    {product.brand}
                  </span>
                )}

                {product.stockStatus && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {product.stockStatus.replaceAll("-", " ")}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-black sm:text-5xl">
                {product.name}
              </h1>

              <p className="mt-4 text-3xl font-semibold tracking-[-0.03em]">
                {product.price}
              </p>

              {product.description && (
                <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600">
                  {product.description}
                </p>
              )}

              {variants.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 text-sm font-semibold">
                    Available variants
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((variant, index) => (
                      <div
                        key={`${variant.name}-${index}`}
                        className="flex items-center gap-3 rounded-2xl border border-black/5 bg-neutral-50 p-2 pr-4"
                      >
                        <img
                          src={variant.image}
                          alt={variant.name}
                          className="h-12 w-12 rounded-xl bg-white object-contain p-1"
                        />
                        <span className="text-sm font-medium">
                          {variant.name || `Variant ${index + 1}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <InfoPill
                  icon={<CheckCircle2 size={18} />}
                  title="Genuine product"
                />
                <InfoPill icon={<Truck size={18} />} title="Fast delivery" />
                <InfoPill
                  icon={<ShieldCheck size={18} />}
                  title="Warranty support"
                />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="h-14 rounded-2xl bg-black px-8 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl sm:flex-1">
                  Add to cart
                </button>
                <button className="h-14 rounded-2xl border border-black/10 bg-white px-8 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-neutral-50 sm:flex-1">
                  Buy now
                </button>
              </div>

              {product.warranty && (
                <p className="mt-5 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600">
                  <span className="font-semibold text-black">Warranty:</span>{" "}
                  {product.warranty}
                </p>
              )}
            </div>
          </section>

          {product.specifications?.length > 0 && (
            <section className="mt-5 rounded-[2.25rem] bg-white p-6 shadow-sm ring-1 ring-black/5 lg:p-8">
              <h2 className="mb-5 text-2xl font-semibold tracking-[-0.03em]">
                Specifications
              </h2>

              <div className="overflow-hidden rounded-3xl border border-black/5">
                {product.specifications.map((spec, index) => (
                  <div
                    key={`${spec.label}-${index}`}
                    className="grid border-b border-black/5 last:border-b-0 sm:grid-cols-[240px_1fr]"
                  >
                    <div className="bg-neutral-50 px-5 py-4 text-sm font-semibold">
                      {spec.label || "-"}
                    </div>
                    <div className="px-5 py-4 text-sm text-neutral-700">
                      {spec.value || "-"}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </ProductPageMotion>
  );
}

function InfoPill({ icon, title }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-700">
      {icon}
      {title}
    </div>
  );
}
