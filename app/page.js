"use client";

import { useState } from "react";
import { Menu, Search, ShoppingBag } from "lucide-react";
import MenuDrawer from "@/components/MenuDrawer";
import SearchModal from "@/components/SearchModal";
import CartModal from "@/components/CartModal";
import VideoModule from "@/components/VideoModule";
import CategoryGrid from "@/components/CategoryGrid";
import ProductShowcase from "@/components/ProductShowcase";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <header className="sticky top-0 z-40 bg-black">
        <div className="relative flex h-[108px] items-center justify-between px-8">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-12 w-12 items-center justify-center text-white"
          >
            <Menu size={34} strokeWidth={1.7} />
          </button>

          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-[44px] font-black leading-none tracking-tight">
              <span className="bg-gradient-to-r from-orange-200 via-pink-300 to-violet-500 bg-clip-text text-transparent">
                MoNi
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-7 text-white">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-12 w-12 items-center justify-center"
            >
              <Search size={32} strokeWidth={1.8} />
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex h-12 w-12 items-center justify-center"
            >
              <ShoppingBag size={31} strokeWidth={1.8} />

              <span className="absolute -right-2 -top-1 text-lg font-medium">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      <VideoModule />
      <CategoryGrid />
      <ProductShowcase />

      <MenuDrawer open={menuOpen} setOpen={setMenuOpen} />
      <SearchModal open={searchOpen} setOpen={setSearchOpen} />
      <CartModal open={cartOpen} setOpen={setCartOpen} />
    </main>
  );
}
