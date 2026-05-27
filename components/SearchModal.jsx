"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

const popularSearches = [
  "iPhone 16 Pro Max",
  "AirPods Pro",
  "PS5",
  "JBL Speaker",
  "Dyson Airwrap",
];

export default function SearchModal({ open, setOpen }) {
  const [search, setSearch] = useState("");

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.aside
            drag="y"
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={(event, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) {
                setOpen(false);
              }
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 32,
              mass: 0.7,
            }}
            className="absolute bottom-0 left-0 h-[80vh] w-full overflow-y-auto rounded-t-[2rem] bg-white px-6 py-5 shadow-2xl"
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-300" />

            <div className="flex items-center gap-3 rounded-2xl bg-gray-100 px-4 py-4">
              <Search size={22} className="text-gray-500" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products"
                className="w-full bg-transparent text-xl font-medium outline-none placeholder:text-gray-400"
              />

              {search.length > 0 && (
                <button onClick={() => setSearch("")}>
                  <X size={22} className="text-gray-500" />
                </button>
              )}
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                Popular searches
              </h3>

              <div className="space-y-3">
                {popularSearches.map((item, index) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.2 + index * 0.06,
                      duration: 0.35,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="block text-left text-[24px] font-semibold leading-tight"
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}