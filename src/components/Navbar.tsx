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
} from 'lucide-react';
import { CATEGORIES } from '@/data/products';

export const Navbar: React.FC = () => {
  const { totalCartItems, subtotal, setIsCartOpen, wishlist, setIsSearchOpen } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all duration-200">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border-b border-slate-100 text-xs text-slate-700 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-800">
              ⚡ স্পেশাল অফার: ২৫০০ টাকার অর্ডারে সারাদেশে ফ্রি হোম ডেলিভারি!
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-slate-600">
            <span className="flex items-center gap-1.5 hover:text-emerald-600 transition cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ৭ দিনের সহজ রিটার্ন
            </span>
            <span className="flex items-center gap-1.5 hover:text-emerald-600 transition cursor-pointer">
              <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
              হটলাইন: 01800-SMARTG
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-700 bg-clip-text text-transparent">
                Smart<span className="text-emerald-600">Ghor</span>
              </span>
              <span className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase -mt-1">
                স্মার্ট হোম ও ইউনিক গ্যাজেট
              </span>
            </div>
          </Link>

          {/* Quick Search Bar trigger */}
          <div
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:flex flex-1 max-w-lg items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-full cursor-pointer transition-all duration-200 group shadow-xs"
          >
            <div className="flex items-center gap-2.5 text-slate-400 group-hover:text-slate-600">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
              <span className="text-sm">ইউনিক গ্যাজেট বা স্মার্ট প্রোডাক্ট সার্চ করুন...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-md shadow-xs">
              ⌘K
            </kbd>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Search Button for Mobile */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-full transition"
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
              className="relative p-2.5 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-full transition group"
              title="উইশলিস্ট"
            >
              <Heart className="w-5 h-5 group-hover:fill-rose-500 transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center animate-bounce shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 rounded-full text-emerald-950 font-medium transition-all duration-200 shadow-xs hover:shadow-md"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-sm font-semibold">
                {subtotal > 0 ? `৳${subtotal.toLocaleString('en-US')}` : 'কার্ট'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        <nav className="hidden md:flex items-center justify-between border-t border-slate-100 py-2.5 text-sm font-medium text-slate-600 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-6">
            <Link
              href="#products-section"
              className="text-emerald-700 font-semibold flex items-center gap-1.5 hover:text-emerald-800 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              সকল কালেকশন
            </Link>
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.slug}`}
                className="hover:text-emerald-600 transition whitespace-nowrap"
              >
                {cat.banglaName}
              </a>
            ))}
          </div>

          <a
            href="#flash-deals"
            className="flex items-center gap-1 text-rose-600 font-semibold hover:text-rose-700 transition animate-pulse"
          >
            🔥 আজকের ফ্ল্যাশ ডিল
          </a>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            ক্যাটাগরি সমূহ
          </p>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-slate-700 hover:text-emerald-600 font-medium border-b border-slate-50"
              >
                <span>{cat.banglaName}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href="#flash-deals"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-rose-50 text-rose-600 rounded-xl font-medium text-sm border border-rose-200/60"
            >
              🔥 ফ্ল্যাশ ডিল এক্সপ্লোর করুন
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
