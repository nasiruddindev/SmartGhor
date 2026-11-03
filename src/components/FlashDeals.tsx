'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { Flame, Clock, ShoppingCart, Eye, Star } from 'lucide-react';

export const FlashDeals: React.FC = () => {
  const { addToCart, openQuickView } = useShop();

  // 12-hour countdown timer logic
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashProducts = PRODUCTS.filter((p) => p.isFlashSale);

  return (
    <section id="flash-deals" className="py-14 bg-zinc-950 text-white border-y border-zinc-800 relative overflow-hidden">
      {/* Background glow in Red & Yellow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Title and Countdown Timer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-yellow-300 text-xs font-bold tracking-wide mb-2 shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-red-500 text-yellow-300 animate-bounce" />
              <span>লিমিটেড টাইম মেগা অফার</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              আজকের ধামাকা ফ্ল্যাশ ডিল 🔥
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              স্টক শেষ হওয়ার আগেই লুফে নিন আপনার পছন্দের ইউনিক স্মার্ট গ্যাজেট!
            </p>
          </div>

          {/* Countdown Clock - Black, Red & Yellow */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-black/90 px-4 py-2.5 rounded-2xl border border-red-600/40 shadow-lg">
            <Clock className="w-5 h-5 text-red-500" />
            <span className="text-xs font-bold text-zinc-300 mr-2">অফার শেষ হতে বাকি:</span>
            <div className="flex items-center gap-1.5 font-mono text-base font-black text-yellow-400">
              <div className="bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 text-center min-w-[36px] text-yellow-400">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="text-red-500">:</span>
              <div className="bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 text-center min-w-[36px] text-yellow-400">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="text-red-500">:</span>
              <div className="bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 text-center min-w-[36px] text-yellow-400">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Flash Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashProducts.map((product) => {
            const soldPercentage = Math.min(85, Math.max(30, 100 - product.stockCount * 3));

            return (
              <div
                key={product.id}
                className="bg-white text-zinc-950 rounded-3xl p-5 border border-zinc-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-zinc-100 mb-4">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Discount Badge in Red & Yellow */}
                    <div className="absolute top-3 left-3 bg-red-600 text-yellow-300 text-xs font-black px-3 py-1 rounded-xl shadow-md border border-red-500">
                      {product.discountPercentage}% ছাড়
                    </div>

                    {/* Quick View Button */}
                    <button
                      onClick={() => openQuickView(product)}
                      className="absolute top-3 right-3 p-2 bg-zinc-950/80 hover:bg-black text-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition duration-200"
                      title="কুইক ভিউ"
                    >
                      <Eye className="w-4 h-4 text-yellow-400" />
                    </button>
                  </div>

                  {/* Rating & Stock */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider">{product.categoryLabel}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold text-zinc-900">{product.rating}</span>
                    </div>
                  </div>

                  {/* Product Title */}
                  <h3 className="font-bold text-zinc-950 text-base leading-snug line-clamp-1 group-hover:text-red-600 transition">
                    {product.name}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
                    {product.shortDescription}
                  </p>

                  {/* Stock Left Progress */}
                  <div className="mt-4 mb-4">
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-red-600">⚡ শুধুমাত্র {product.stockCount}টি স্টকে বাকি</span>
                      <span className="text-zinc-500">{soldPercentage}% বিক্রি</span>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200">
                      <div
                        className="bg-gradient-to-r from-yellow-400 via-amber-500 to-red-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${soldPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Price and Cart Button */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-zinc-950">
                      ৳{product.price.toLocaleString('en-US')}
                    </span>
                    <span className="text-xs text-zinc-400 line-through ml-1.5 font-medium">
                      ৳{product.originalPrice.toLocaleString('en-US')}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 transition hover:scale-105 active:scale-95"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-yellow-300" />
                    <span>কার্ট এ যোগ</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
