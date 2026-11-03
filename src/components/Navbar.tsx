'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { CATEGORIES } from '@/data/products';

export const Navbar: React.FC = () => {
  const { totalCartItems, subtotal, setIsCartOpen, wishlist, setIsSearchOpen } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all duration-200 shadow-xs">
      {/* Top Announcement Bar - Sleek Black & Yellow & Red */}
      <div className="bg-zinc-950 border-b border-zinc-800 text-xs text-zinc-300 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            <span className="font-medium text-zinc-200">
              <span className="text-yellow-400 font-bold">⚡ স্পেশাল অফার:</span> ২৫০০ টাকার অর্ডারে সারাদেশে ফ্রি হোম ডেলিভারি!
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-zinc-400">
            <span className="flex items-center gap-1.5 hover:text-yellow-400 transition cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
              ৭ দিনের সহজ রিপ্লেসমেন্ট
            </span>
            <span className="flex items-center gap-1.5 hover:text-red-400 transition cursor-pointer">
              <PhoneCall className="w-3.5 h-3.5 text-red-500" />
              হটলাইন: 01800-SMARTG
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo - Black, Red & Yellow */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-black via-zinc-900 to-red-600 flex items-center justify-center text-yellow-400 shadow-md shadow-red-600/20 group-hover:scale-105 group-hover:shadow-red-600/30 transition-all duration-300 border border-zinc-800">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-zinc-950">
                Smart<span className="text-red-600">Ghor</span>
              </span>
              <span className="block text-[10px] font-bold tracking-widest text-zinc-500 uppercase -mt-1">
                স্মার্ট হোম ও ইউনিক গ্যাজেট
              </span>
            </div>
          </Link>

          {/* Quick Search Bar trigger */}
          <div
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex flex-1 max-w-lg items-center justify-between px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100/90 border border-zinc-200 rounded-full cursor-pointer transition-all duration-200 group shadow-xs hover:border-red-300"
          >
            <div className="flex items-center gap-2.5 text-zinc-400 group-hover:text-zinc-600">
              <Search className="w-4 h-4 text-zinc-400 group-hover:text-red-600 transition" />
              <span className="text-sm">ইউনিক গ্যাজেট বা স্মার্ট প্রোডাক্ট সার্চ করুন...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-[11px] font-bold text-zinc-700 bg-white border border-zinc-200 rounded-md shadow-xs">
              ⌘K
            </kbd>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Search Button for Mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2.5 text-zinc-700 hover:text-red-600 hover:bg-zinc-100 rounded-full transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => {
                const el = document.getElementById('products-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative p-2.5 text-zinc-700 hover:text-red-600 hover:bg-red-50 rounded-full transition group"
              title="উইশলিস্ট"
            >
              <Heart className="w-5 h-5 group-hover:fill-red-600 transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-yellow-300 text-[11px] font-bold flex items-center justify-center animate-bounce shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button - Bold Black & Yellow & Red */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-full text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:border-red-600"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-yellow-400" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 text-yellow-200 text-[10px] font-black flex items-center justify-center border border-zinc-950">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-sm font-bold text-yellow-400">
                {subtotal > 0 ? `৳${subtotal.toLocaleString('en-US')}` : 'কার্ট'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-700 hover:bg-zinc-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        <nav className="hidden md:flex items-center justify-between border-t border-zinc-100 py-2.5 text-sm font-medium text-zinc-600 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-6">
            <Link
              href="#products-section"
              className="text-zinc-950 font-bold flex items-center gap-1.5 hover:text-red-600 transition"
            >
              <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-400" />
              সকল কালেকশন
            </Link>
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.slug}`}
                className="hover:text-red-600 transition whitespace-nowrap font-medium"
              >
                {cat.banglaName}
              </a>
            ))}
          </div>

          <a
            href="#flash-deals"
            className="flex items-center gap-1.5 text-red-600 font-extrabold hover:text-red-700 transition"
          >
            <Flame className="w-4 h-4 fill-red-600 animate-pulse text-yellow-400" />
            <span>আজকের ফ্ল্যাশ ডিল</span>
          </a>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-3">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            ক্যাটাগরি সমূহ
          </p>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-zinc-700 hover:text-red-600 font-medium border-b border-zinc-50"
              >
                <span>{cat.banglaName}</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href="#flash-deals"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 text-yellow-300 rounded-xl font-bold text-sm shadow-md"
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>ফ্ল্যাশ ডিল এক্সপ্লোর করুন</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
