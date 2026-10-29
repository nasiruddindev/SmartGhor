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
    <section id="flash-deals" className="py-12 bg-rose-50/40 border-y border-rose-100/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Countdown Timer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold tracking-wide mb-2">
              <Flame className="w-3.5 h-3.5 fill-rose-600 animate-bounce" />
              <span>লিমিটেড টাইম মেগা অফার</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              আজকের ধামাকা ফ্ল্যাশ ডিল 🔥
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              স্টক শেষ হওয়ার আগেই লুফে নিন আপনার পছন্দের ইউনিক স্মার্ট গ্যাজেট!
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white px-4 py-2.5 rounded-2xl border border-rose-200/80 shadow-xs">
            <Clock className="w-5 h-5 text-rose-600" />
            <span className="text-xs font-semibold text-slate-600 mr-2">অফার শেষ হতে বাকি:</span>
            <div className="flex items-center gap-1.5 font-mono text-base font-black text-rose-600">
              <div className="bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 text-center min-w-[36px]">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span>:</span>
              <div className="bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 text-center min-w-[36px]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span>:</span>
              <div className="bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 text-center min-w-[36px]">
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
                className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-50 mb-4">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-md">
                      {product.discountPercentage}% ছাড়
                    </div>

                    {/* Quick View Button */}
                    <button
                      onClick={() => openQuickView(product)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition duration-200"
                      title="কুইক ভিউ"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Rating & Stock */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400 font-medium">{product.categoryLabel}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold text-slate-800">{product.rating}</span>
                    </div>
                  </div>

                  {/* Product Title */}
                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-rose-600 transition">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {product.shortDescription}
                  </p>

                  {/* Stock Left Progress */}
                  <div className="mt-4 mb-4">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-rose-600">⚡ শুধুমাত্র {product.stockCount}টি স্টকে বাকি</span>
                      <span className="text-slate-400">{soldPercentage}% বিক্রি</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${soldPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Price and Cart Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-slate-900">
                      ৳{product.price.toLocaleString('en-US')}
                    </span>
                    <span className="text-xs text-slate-400 line-through ml-1.5">
                      ৳{product.originalPrice.toLocaleString('en-US')}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition hover:scale-105 active:scale-95"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
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
