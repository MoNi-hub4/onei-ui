"use client";

import { useLayoutEffect } from "react";
import { motion } from "framer-motion";

export default function ProductPageMotion({ children }) {
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
    <motion.div
      initial={{
        opacity: 0,
        y: 18,
        scale: 0.992,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.36,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
