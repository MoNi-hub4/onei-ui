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
    product.variants?.map((variant) => variant.image).filter(Boolean) || [],
});

export default function ProductShowcase() {
  const router = useTransitionRouter();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [openingProductId, setOpeningProductId] = useState(null);
  const [reveal, setReveal] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      try {
        const cached = sessionStorage.getItem("cms-products-cache");

        if (cached) {
          const parsed = JSON.parse(cached);

          setProducts(parsed.products || []);
          setTabs(parsed.tabs || []);
          setActiveTab((current) => current || parsed.tabs?.[0] || "");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/cms/products");
        const data = await res.json();

        const activeProducts = (data.products || []).filter(
          (product) => product.isActive !== false,
        );

        const productTypes = [
          ...new Set(
            activeProducts
              .map((product) => product.productType)
              .filter(Boolean),
          ),
        ];

        sessionStorage.setItem(
          "cms-products-cache",
          JSON.stringify({
            products: activeProducts,
            tabs: productTypes,
          }),
        );

        setProducts(activeProducts);
        setTabs(productTypes);
        setActiveTab((current) => current || productTypes[0] || "");
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
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

  const handleProductClick = (event, product) => {
    const href = getProductHref(product);
    const productId = getProductKey(product);

    if (!href || href.includes("undefined") || isPending || reveal) return;

    const rect = event.currentTarget.getBoundingClientRect();

    setOpeningProductId(productId);
    setReveal({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });

    window.setTimeout(() => {
      startTransition(() => {
        router.push(href);
      });
    }, 420);
  };

  if (!loading && !products.length) {
    return null;
  }

  return (
    <section className="relative bg-[#f7f7f7] px-4 py-8">
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
                      scale: isOpening ? 1.055 : 1,
                      y: isOpening ? -8 : 0,
                      opacity: openingProductId && !isOpening ? 0.35 : 1,
                      filter:
                        openingProductId && !isOpening
                          ? "blur(5px)"
                          : "blur(0px)",
                    }}
                    transition={{
                      duration: 0.24,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={!reveal ? { y: -6, scale: 1.02 } : {}}
                    whileTap={!reveal ? { scale: 0.97 } : {}}
                    onClick={(event) => handleProductClick(event, product)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleProductClick(event, product);
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

      <AnimatePresence>
        {reveal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.16 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9998] bg-black"
            />

            <motion.div
              initial={{
                left: reveal.x,
                top: reveal.y,
                width: reveal.width,
                height: reveal.height,
                borderRadius: 32,
                opacity: 1,
              }}
              animate={{
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                borderRadius: 0,
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.46,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="fixed z-[9999] overflow-hidden bg-white shadow-2xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.24,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex h-full w-full items-center justify-center bg-[#f7f7f7]"
              >
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-neutral-200 border-t-black" />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
