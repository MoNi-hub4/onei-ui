"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const menuData = [
  { title: "Apple", links: ["iPhone", "iPad", "MacBook", "Apple Watch"] },
  { title: "Android", links: ["Samsung", "Pixel", "Redmi", "OnePlus"] },
  { title: "Gaming", links: ["PS5", "Controllers", "Headsets"] },
  { title: "Sounds", links: ["JBL", "Sony", "Marshall"] },
  { title: "Dyson", links: ["Airwrap", "Hair Dryer", "Vacuum Cleaner"] },
  { title: "Wearables", links: ["Smart Watches", "Fitness Bands", "Rings"] },
  { title: "Accessories", links: ["Chargers", "Cases", "Cables"] },
  { title: "Cameras", links: ["DJI", "Insta360", "Action Cameras"] },
  { title: "Smart Home", links: ["Lights", "Sensors", "Security Cameras"] },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.22,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function MenuDrawer({ open, setOpen }) {
  const [active, setActive] = useState(null);

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
            className="absolute bottom-0 left-0 h-[65vh] w-full overflow-y-auto rounded-t-[2rem] bg-white px-6 py-5 shadow-2xl"
          >
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-300" />

            <motion.div variants={containerVariants} initial="hidden" animate="show">
              {menuData.map((menu, index) => (
                <motion.div key={menu.title} variants={itemVariants}>
                  <button
                    onClick={() => setActive(active === index ? null : index)}
                    className="flex w-full items-center justify-between py-2"
                  >
                    <span className="text-[26px] font-semibold leading-none">
                      {menu.title}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 text-gray-400 ${
                        active === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {active === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-2 pt-1">
                          {menu.links.map((link) => (
                            <a
                              key={link}
                              href="#"
                              className="block py-1 text-base text-gray-500 hover:text-black"
                            >
                              {link}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}