"use client";

import { useTransition } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useProductPageMotion } from "./ProductPageMotion";

export default function BackRevealButton() {
  const router = useTransitionRouter();
  const [isPending, startTransition] = useTransition();
  const { closing, setClosing } = useProductPageMotion();

  const handleBack = () => {
    if (isPending || closing) return;

    setClosing(true);

    window.setTimeout(() => {
      startTransition(() => {
        router.back();
      });
    }, 300);
  };

  return (
    <motion.button
      type="button"
      onClick={handleBack}
      disabled={isPending || closing}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="mb-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium shadow-sm ring-1 ring-black/5 transition hover:shadow-md disabled:pointer-events-none disabled:opacity-70"
    >
      <ArrowLeft size={16} />
      Back to products
    </motion.button>
  );
}
