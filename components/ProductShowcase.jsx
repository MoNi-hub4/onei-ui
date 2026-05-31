"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";

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

const getProductKey = (product) =>
  product?.slug || product?._id || product?.id || product?.name;

const getProductHref = (product) =>
  `/products/${product?.slug || product?._id || product?.id}`;

const mapProductForCard = (product) => ({
  ...product,
  colors:
    product.variants
      ?.map((variant) => variant.image)
      .filter(Boolean) || [],
});

export default function ProductShowcase() {
  const router = useTransitionRouter();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [openingProductId, setOpeningProductId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        const res = await fetch("/api/cms/products", {
          cache: "no-store",
        });

        const data = await res.json();
        const activeProducts = (data.products || []).filter(
          (product) => product.isActive !== false
        );

        const productTypes = [
          ...new Set(
            activeProducts
              .map((product) => product.productType)
              .filter(Boolean)
          ),
        ];

        if (!ignore) {
          setProducts(activeProducts);
          setTabs(productTypes);
          setActiveTab((current) => current || productTypes[0] || "");
        }
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => product.productType === activeTab);
  }, [products, activeTab]);

  const sectionTitle = useMemo(() => {
    const firstProduct = products.find(Boolean);
    return firstProduct?.category || "Products";
  }, [products]);

  const handleProductClick = (product) => {
    const href = getProductHref(product);
    const productId = getProductKey(product);

    if (!href || href.includes("undefined")) return;

    setOpeningProductId(productId);

    window.setTimeout(() => {
      startTransition(() => {
        router.push(href);
      });
    }, 90);
  };

  if (!loading && !products.length) {
    return null;
  }

  return (
    <section className="bg-[#f7f7f7] px-4 py-8">
      <h2 className="mb-6 text-[32px] font-medium leading-none text-black">
        {sectionTitle}
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
              {visibleProducts.map((product) => {
                const productId = getProductKey(product);
                const isOpening = openingProductId === productId;

                return (
                  <motion.div
                    key={productId}
                    variants={cardVariants}
                    animate={{
                      scale: isOpening ? 1.06 : 1,
                      y: isOpening ? -8 : 0,
                      opacity: openingProductId && !isOpening ? 0.45 : 1,
                      filter:
                        openingProductId && !isOpening
                          ? "blur(4px)"
                          : "blur(0px)",
                    }}
                    transition={{
                      duration: 0.22,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => !isPending && handleProductClick(product)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !isPending) {
                        handleProductClick(product);
                      }
                    }}
                    className="snap-start cursor-pointer rounded-[2rem]"
                  >
                    <ProductCard product={mapProductForCard(product)} />
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
