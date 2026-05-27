"use client";

import { ShoppingBag } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <div className="w-[44vw] min-w-[175px] max-w-[210px] shrink-0">
      {/* IMAGE AREA */}
      <div className="relative flex aspect-[0.92] items-center justify-center overflow-hidden rounded-[28px] bg-white">
        {/* FIXED IMAGE BOX */}
        <div className="relative flex h-[72%] w-[72%] items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="
              absolute inset-0
              h-full w-full
              object-contain
              transition-transform duration-500
              hover:scale-[1.03]
            "
          />
        </div>

        {/* MODERN ADD TO CART */}
        <button
          className="
            absolute bottom-3 right-3
            flex h-11 w-11 items-center justify-center
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
          <ShoppingBag size={18} strokeWidth={1.9} />
        </button>
      </div>

      {/* TEXT AREA */}
      <div className="px-1 pb-2 pt-4 text-center">
        <h3 className="text-[17px] font-medium leading-tight text-black">
          {product.name}
        </h3>

        <p className="mt-2 text-[15px] text-black">
          <span className="text-[12px] text-gray-500">From</span>{" "}
          <span>{product.price}</span>
        </p>

        <div className="mt-4 flex justify-center gap-2">
          {product.colors.map((color, index) => (
            <button
              key={index}
              className="
                flex h-7 w-7 items-center justify-center
                rounded-lg border border-gray-200 bg-white
                transition-all duration-300
                hover:scale-105
                hover:border-gray-400
              "
            >
              <img
                src={color}
                alt=""
                className="h-5 w-5 object-contain"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}