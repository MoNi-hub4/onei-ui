"use client";

import ProductCard from "./ProductCard";

const tabs = ["iPhone", "MacBook", "Apple Watch", "iPad", "iMac"];

const products = [
  {
    name: "iPhone 17e",
    price: "Rs 274,900.00",
    image: "/products/iphone-17e.png",
    colors: [
      "/products/iphone-17e.png",
      "/products/iphone-white.png",
      "/products/iphone-black.png",
    ],
  },
  {
    name: "iPhone 16 Pro",
    price: "Rs 399,900.00",
    image: "/products/iphone-16-pro.png",
    colors: [
      "/products/iphone-16-pro.png",
      "/products/iphone-white.png",
      "/products/iphone-black.png",
    ],
  },
  {
    name: "iPhone 16e",
    price: "Rs 274,900.00",
    image: "/products/iphone-17e.png",
    colors: [
      "/products/iphone-17e.png",
      "/products/iphone-white.png",
      "/products/iphone-black.png",
    ],
  },
  {
    name: "iPhone 17 Pro",
    price: "Rs 399,900.00",
    image: "/products/iphone-16-pro.png",
    colors: [
      "/products/iphone-16-pro.png",
      "/products/iphone-white.png",
      "/products/iphone-black.png",
    ],
  },
];

export default function ProductShowcase() {
  return (
    <section className="bg-[#f7f7f7] px-4 py-8">
      <h2 className="mb-6 text-[40px] font-medium leading-none text-black">
        Apple
      </h2>

      {/* TABS */}
      <div className="-mx-4 mb-8 overflow-x-auto scroll-smooth px-4 scrollbar-hide">
        <div className="flex w-max gap-3">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`whitespace-nowrap rounded-full px-6 py-3 text-lg font-medium ${
                index === 0 ? "bg-black text-white shadow-lg" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="-mx-4 overflow-x-auto scroll-smooth px-4 scrollbar-hide">
        <div className="flex snap-x snap-mandatory gap-4">
          {products.map((product) => (
            <div key={product.name} className="snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}