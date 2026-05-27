"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";

const cartItems = [
  {
    name: "iPhone 16 Pro Max",
    price: "Rs 459,000",
    qty: 1,
  },
  {
    name: "AirPods Pro",
    price: "Rs 79,000",
    qty: 2,
  },
  {
    name: "JBL Speaker",
    price: "Rs 52,000",
    qty: 1,
  },
];

export default function CartModal({ open, setOpen }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, delay: 0.08 }}
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
              delay: 0.08,
            }}
            className="absolute bottom-0 left-0 flex h-[65vh] w-full flex-col rounded-t-[2rem] bg-white px-6 py-5 shadow-2xl"
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-300" />

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h2 className="text-[28px] font-black leading-none">Cart</h2>

              <p className="mt-1 text-sm text-gray-500">3 items in your cart</p>
            </motion.div>

            <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.34 + index * 0.06,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex gap-4 rounded-3xl bg-gray-100 p-4"
                >
                  <div className="h-20 w-20 rounded-2xl bg-white" />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-base font-semibold">{item.name}</h3>

                      <p className="mt-1 text-sm font-medium text-gray-500">
                        {item.price}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2">
                        <Minus size={15} />

                        <span className="text-sm font-semibold">
                          {item.qty}
                        </span>

                        <Plus size={15} />
                      </div>

                      <button>
                        <Trash2 size={18} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="border-t pt-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-base font-semibold text-gray-500">
                  Total
                </span>

                <span className="text-2xl font-black">Rs 590,000</span>
              </div>

              <button className="w-full rounded-2xl bg-black py-4 text-base font-bold text-white">
                Checkout
              </button>
            </motion.div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
