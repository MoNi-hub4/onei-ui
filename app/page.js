"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { Menu, Search, ShoppingBag } from "lucide-react";
import MenuDrawer from "@/components/MenuDrawer";
import SearchModal from "@/components/SearchModal";
import CartModal from "@/components/CartModal";
import VideoModule from "@/components/VideoModule";
import CategoryGrid from "@/components/CategoryGrid";
import ProductShowcase from "@/components/ProductShowcase";
import CmsBottomClient from "@/components/cms/CmsBottomClient";


export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f7f7]">
      <header className="sticky top-0 z-40 bg-black">
        <div className="relative flex h-[64px] items-center px-5">
          {/* Left Menu */}
          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center text-white"
          >
            <Menu size={24} strokeWidth={1.9} />
          </button>

          {/* Properly Centered Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-[30px] font-black leading-none tracking-tight">
              <span className="bg-gradient-to-r from-orange-200 via-pink-300 to-violet-500 bg-clip-text text-transparent">
                iMobile
              </span>
            </h1>
          </div>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-2 text-white">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center"
            >
              <Search size={22} strokeWidth={1.9} />
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center"
            >
              <ShoppingBag size={22} strokeWidth={1.9} />

              <span className="absolute -right-1 -top-1 text-[11px] font-medium">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      <VideoModule />
      <CategoryGrid />
      <ProductShowcase />
      <CmsBottomClient />

      <MenuDrawer open={menuOpen} setOpen={setMenuOpen} />
      <SearchModal open={searchOpen} setOpen={setSearchOpen} />
      <CartModal open={cartOpen} setOpen={setCartOpen} />
    </main>
  );
}
