'use client';

import React from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { PRODUCTS } from '@/data/products';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Star, ShoppingBag } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { addToCart, openQuickView } = useShop();
  const heroProduct = PRODUCTS[0]; // LevitaGlow Lamp

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 via-red-50/20 to-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Decorative subtle light background orbs in Red & Yellow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-5 w-80 h-80 bg-yellow-400/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text / Info Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950 border border-zinc-800 text-yellow-400 text-xs sm:text-sm font-bold tracking-wide shadow-sm">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>নতুন উদ্ভাবনী স্মার্ট গ্যাজেট ২০২৬</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 leading-[1.15] tracking-tight">
              আপনার ঘরকে করুন{' '}
              <span className="bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                স্মার্ট ও নান্দনিক
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              স্মার্ট হোম অটোমেশন, ম্যাগনেটিক গ্যাজেট ও লাইফস্টাইল টেকনোলজি — দৈনন্দিন জীবনকে আরও আরামদায়ক ও প্রিমিয়াম করতে{' '}
              <strong className="text-zinc-950 font-bold">SmartGhor</strong> নিয়ে এসেছে সেরা মানের অরিজিনাল গ্যাজেট।
            </p>

            {/* CTAs - Red & Black/Yellow */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#products-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-600/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                <span>কালেকশন এক্সপ্লোর করুন</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#flash-deals"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-yellow-400 font-bold rounded-2xl shadow-md transition hover:border-red-600"
              >
                <span>🔥 আজকের সেরা ডিলস</span>
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-zinc-200 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-black text-zinc-950">২০,০০০+</span>
                <span className="text-xs text-zinc-500 font-semibold">সন্তুষ্ট গ্রাহক</span>
              </div>
              <div className="flex flex-col items-center lg:items-start border-x border-zinc-200 px-3">
                <span className="text-xl sm:text-2xl font-black text-red-600">১০০%</span>
                <span className="text-xs text-zinc-500 font-semibold">অরিজিনাল গ্যাজেট</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-black text-zinc-950">৭ দিন</span>
                <span className="text-xs text-zinc-500 font-semibold">রিপ্লেসমেন্ট গ্যারান্টি</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Hero Card */}
          <div className="lg:col-span-5 relative">
            {/* Main Product Feature Card */}
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-5 shadow-2xl shadow-zinc-300/60 border border-zinc-200 group">
              {/* Product Badge in Fiery Red & Yellow */}
              <div className="absolute top-8 left-8 z-10 bg-red-600 text-yellow-300 text-xs font-black px-3.5 py-1 rounded-full shadow-md border border-red-500">
                🔥 ট্রেন্ডিং গ্যাজেট
              </div>

              {/* Product Image */}
              <div className="relative h-72 w-full rounded-2xl overflow-hidden bg-zinc-100 mb-5">
                <Image
                  src={heroProduct.images[0]}
                  alt={heroProduct.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>

              {/* Product Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold text-zinc-900">{heroProduct.rating}</span>
                    <span className="text-xs text-zinc-400 font-medium">({heroProduct.reviewsCount} রিভিউ)</span>
                  </div>
                  <span className="text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                    স্টকে আছে ({heroProduct.stockCount} টি)
                  </span>
                </div>

                <h3 className="font-bold text-zinc-950 text-lg leading-snug">
                  {heroProduct.name}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  {heroProduct.shortDescription}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                  <div>
                    <span className="text-2xl font-black text-zinc-950">
                      ৳{heroProduct.price.toLocaleString('en-US')}
                    </span>
                    <span className="text-xs text-zinc-400 line-through ml-2">
                      ৳{heroProduct.originalPrice.toLocaleString('en-US')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openQuickView(heroProduct)}
                      className="px-3.5 py-2 text-xs font-bold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition"
                    >
                      ডিটেইলস
                    </button>
                    <button
                      onClick={() => addToCart(heroProduct)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 transition hover:scale-105"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-yellow-300" />
                      অর্ডার করুন
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating micro widgets in Black & Red/Yellow */}
            <div className="hidden sm:flex items-center gap-3 absolute -bottom-6 -left-6 bg-zinc-950/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-zinc-800 text-white">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">ক্যাশ অন ডেলিভারি</p>
                <p className="text-[11px] text-yellow-400">পণ্য হাতে পেয়ে পেমেন্ট করুন</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 absolute -top-4 -right-4 bg-zinc-950/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-zinc-800 text-white">
              <div className="w-9 h-9 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">জেনুইন কোয়ালিটি</p>
                <p className="text-[11px] text-zinc-300">১০০% টেস্টেড ও ভেরিফাইড</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
