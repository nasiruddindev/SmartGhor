'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { Search, X, TrendingUp, ShoppingBag, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, openQuickView, addToCart } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isSearchOpen]);

  // Keyboard shortcut (Escape to close, Cmd+K to open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const popularTags = [
    'ম্যাগনেটিক ল্যাম্প',
    'ইয়ারবাডস',
    'ডোরবেল',
    'ব্লেন্ডার',
    'আরজিবি প্যানেল',
    'ডিফিউজার',
    'ওয়্যারলেস চার্জার',
  ];

  const searchResults = searchTerm.trim()
    ? PRODUCTS.filter((p) => {
        const query = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.banglaName?.toLowerCase().includes(query) ||
          p.categoryLabel.toLowerCase().includes(query) ||
          p.shortDescription.toLowerCase().includes(query)
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Search Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="ইউনিক গ্যাজেট, নাম বা ক্যাটাগরি লিখুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-base sm:text-lg font-medium text-slate-900 placeholder-slate-400 outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg text-xs"
            >
              ক্লিয়ার
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-semibold shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>জনপ্রিয়:</span>
          </div>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200/80 shrink-0 transition"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {searchTerm.trim() ? (
            searchResults.length > 0 ? (
              searchResults.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 group"
                >
                  <div
                    onClick={() => {
                      setIsSearchOpen(false);
                      openQuickView(product);
                    }}
                    className="flex items-center gap-3.5 flex-1 cursor-pointer min-w-0"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-extrabold text-slate-800">
                          ৳{product.price.toLocaleString('en-US')}
                        </span>
                        {product.discountPercentage > 0 && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">
                            {product.discountPercentage}% ছাড়
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        addToCart(product);
                        setIsSearchOpen(false);
                      }}
                      className="p-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white rounded-xl transition"
                      title="কার্টে যুক্ত করুন"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-500">
                <p className="text-sm font-semibold">"{searchTerm}" দিয়ে কোনো প্রোডাক্ট খুঁজে পাওয়া যায়নি</p>
                <p className="text-xs text-slate-400 mt-1">ভিন্ন শব্দ লিখে আবার চেষ্টা করুন</p>
              </div>
            )
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              সার্চ করতে প্রোডাক্টের নাম টাইপ করুন অথবা উপরের যেকোনো ট্যাগ ক্লিক করুন
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
