"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";

const ProductPageMotionContext = createContext(null);

export function useProductPageMotion() {
  const context = useContext(ProductPageMotionContext);

  if (!context) {
    throw new Error("useProductPageMotion must be used inside ProductPageMotion");
  }

  return context;
}

export default function ProductPageMotion({ children }) {
  const [closing, setClosing] = useState(false);

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    });
  }, []);

  return (
    <ProductPageMotionContext.Provider value={{ closing, setClosing }}>
      <motion.div
        initial={{
          opacity: 0,
          y: 18,
          scale: 0.992,
        }}
        animate={
          closing
            ? {
                opacity: 0,
                y: 46,
                scale: 0.982,
                filter: "blur(8px)",
              }
            : {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              }
        }
        transition={{
          duration: closing ? 0.34 : 0.42,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </ProductPageMotionContext.Provider>
  );
}
