"use client";

import { ShoppingBag } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <div className="w-[280px] shrink-0">
      {/* IMAGE AREA */}
      <div className="relative flex h-[280px] items-center justify-center overflow-hidden rounded-2xl bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="h-[72%] w-[72%] object-contain transition-transform duration-500 hover:scale-[1.03]"
        />

        {/* MODERN ADD TO CART */}
        <button
          className="
            absolute bottom-4 right-4
            flex h-14 w-14 items-center justify-center
            rounded-2xl
            border border-white/70
            bg-white/85
            text-black
            backdrop-blur-2xl
            shadow-[0_8px_30px_rgba(0,0,0,0.08)]
            transition-all duration-300
            hover:scale-105
            hover:bg-white
            active:scale-95
          "
        >
          <ShoppingBag size={20} strokeWidth={1.9} />
        </button>
      </div>

      {/* TEXT AREA */}
      <div className="px-2 pb-2 pt-5 text-center">
        <h3 className="text-[22px] font-medium leading-none text-black">
          {product.name}
        </h3>

        <p className="mt-3 text-lg text-black">
          <span className="text-sm text-gray-500">From</span>{" "}
          <span>{product.price}</span>
        </p>

        <div className="mt-5 flex justify-center gap-2">
          {product.colors.map((color, index) => (
            <button
              key={index}
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg border border-gray-200 bg-white
                transition-all duration-300
                hover:scale-105
                hover:border-gray-400
              "
            >
              <img
                src={color}
                alt=""
                className="h-6 w-6 object-contain"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}