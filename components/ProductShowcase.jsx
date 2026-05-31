"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";

const tabs = ["iPhone", "MacBook", "Apple Watch", "iPad", "iMac"];

const productsByTab = {
  iPhone: [
    {
      name: "iPhone 17e",
      price: "Rs 274,900.00",
      image: "/products/iphone-17e.webp",
      colors: [
        "/products/iphone-17e.webp",
        "/products/iphone-white.webp",
        "/products/iphone-black.webp",
      ],
    },
    {
      name: "iPhone 16 Pro",
      price: "Rs 399,900.00",
      image: "/products/iphone-16-pro.webp",
      colors: [
        "/products/iphone-16-pro.webp",
        "/products/iphone-white.webp",
        "/products/iphone-black.webp",
      ],
    },
    {
      name: "iPhone 17e4",
      price: "Rs 274,900.00",
      image: "/products/iphone-17e.webp",
      colors: [
        "/products/iphone-17e.webp",
        "/products/iphone-white.webp",
        "/products/iphone-black.webp",
      ],
    },
    {
      name: "iPhone 17e3",
      price: "Rs 274,900.00",
      image: "/products/iphone-17e.webp",
      colors: [
        "/products/iphone-17e.webp",
        "/products/iphone-white.webp",
        "/products/iphone-black.webp",
      ],
    },
    {
      name: "iPhone 17e2",
      price: "Rs 274,900.00",
      image: "/products/iphone-17e.webp",
      colors: [
        "/products/iphone-17e.webp",
        "/products/iphone-white.webp",
        "/products/iphone-black.webp",
      ],
    },
    {
      name: "iPhone 17e1",
      price: "Rs 274,900.00",
      image: "/products/iphone-17e.webp",
      colors: [
        "/products/iphone-17e.webp",
        "/products/iphone-white.webp",
        "/products/iphone-black.webp",
      ],
    },
  ],

  MacBook: [
    {
      name: "MacBook Air M4",
      price: "Rs 329,900.00",
      image: "/products/macbook-air.webp",
      colors: [
        "/products/macbook-air.webp",
        "/products/macbook-silver.webp",
        "/products/macbook-midnight.webp",
      ],
    },
    {
      name: "MacBook Pro M4",
      price: "Rs 629,900.00",
      image: "/products/macbook-pro.webp",
      colors: [
        "/products/macbook-pro.webp",
        "/products/macbook-silver.webp",
        "/products/macbook-spaceblack.webp",
      ],
    },
  ],

  "Apple Watch": [
    {
      name: "Apple Watch Series 10",
      price: "Rs 159,900.00",
      image: "/products/apple-watch.webp",
      colors: [
        "/products/apple-watch.webp",
        "/products/watch-black.webp",
        "/products/watch-silver.webp",
      ],
    },
    {
      name: "Apple Watch Ultra 2",
      price: "Rs 299,900.00",
      image: "/products/apple-watch-ultra.webp",
      colors: [
        "/products/apple-watch-ultra.webp",
        "/products/watch-black.webp",
        "/products/watch-orange.webp",
      ],
    },
  ],

  iPad: [
    {
      name: "iPad Air",
      price: "Rs 249,900.00",
      image: "/products/ipad-air.webp",
      colors: [
        "/products/ipad-air.webp",
        "/products/ipad-blue.webp",
        "/products/ipad-purple.webp",
      ],
    },
    {
      name: "iPad Pro",
      price: "Rs 419,900.00",
      image: "/products/ipad-pro.webp",
      colors: [
        "/products/ipad-pro.webp",
        "/products/ipad-silver.webp",
        "/products/ipad-black.webp",
      ],
    },
  ],

  iMac: [
    {
      name: "iMac 24-inch",
      price: "Rs 469,900.00",
      image: "/products/imac.webp",
      colors: [
        "/products/imac.webp",
        "/products/imac-blue.webp",
        "/products/imac-green.webp",
      ],
    },
    {
      name: "iMac M4",
      price: "Rs 529,900.00",
      image: "/products/imac-m4.webp",
      colors: [
        "/products/imac-m4.webp",
        "/products/imac-pink.webp",
        "/products/imac-yellow.webp",
      ],
    },
  ],
};

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.98,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -18,
    scale: 0.98,
    filter: "blur(8px)",
    transition: {
      duration: 0.22,
      ease: "easeInOut",
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState("iPhone");

  return (
    <section className="bg-[#f7f7f7] px-4 py-8">
      <h2 className="mb-6 text-[32px] font-medium leading-none text-black">
        Apple
      </h2>

      {/* TABS */}
      <div className="-mx-4 mb-8 overflow-x-auto scroll-smooth px-4 scrollbar-hide">
        <div className="flex w-max gap-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-[15px] font-medium transition-colors duration-300 ${
                  isActive ? "text-white" : "text-gray-500"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeProductTab"
                    className="absolute inset-0 rounded-[18px] bg-black shadow-lg"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 34,
                    }}
                  />
                )}

                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="-mx-4 overflow-hidden px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-x-auto scroll-smooth scrollbar-hide"
          >
            <motion.div className="flex snap-x snap-mandatory gap-4">
              {productsByTab[activeTab].map((product) => (
                <motion.div
                  key={product.name}
                  variants={cardVariants}
                  className="snap-start"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
