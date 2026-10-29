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
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-emerald-50/20 to-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Decorative subtle light background orbs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-5 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text / Info Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>নতুন উদ্ভাবনী স্মার্ট গ্যাজেট ২০২৬</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
              আপনার ঘরকে করুন{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
                স্মার্ট ও নান্দনিক
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              স্মার্ট হোম অটোমেশন, ম্যাগনেটিক গ্যাজেট ও লাইফস্টাইল টেকনোলজি — দৈনন্দিন জীবনকে আরও আরামদায়ক ও প্রিমিয়াম করতে{' '}
              <strong className="text-slate-900 font-semibold">SmartGhor</strong> নিয়ে এসেছে সেরা মানের অরিজিনাল গ্যাজেট।
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#products-section"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span>কালেকশন এক্সপ্লোর করুন</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#flash-deals"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-2xl shadow-xs transition hover:border-slate-300"
              >
                <span>🔥 আজকের সেরা ডিলস</span>
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-black text-slate-900">২০,০০০+</span>
                <span className="text-xs text-slate-500 font-medium">সন্তুষ্ট গ্রাহক</span>
              </div>
              <div className="flex flex-col items-center lg:items-start border-x border-slate-200 px-3">
                <span className="text-xl sm:text-2xl font-black text-emerald-600">১০০%</span>
                <span className="text-xs text-slate-500 font-medium">অরিজিনাল গ্যাজেট</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-black text-slate-900">৭ দিন</span>
                <span className="text-xs text-slate-500 font-medium">রিপ্লেসমেন্ট গ্যারান্টি</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Hero Card */}
          <div className="lg:col-span-5 relative">
            {/* Main Product Feature Card */}
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-5 shadow-2xl shadow-slate-200/70 border border-slate-100 group">
              {/* Product Badge */}
              <div className="absolute top-8 left-8 z-10 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                🔥 ট্রেন্ডিং গ্যাজেট
              </div>

              {/* Product Image */}
              <div className="relative h-72 w-full rounded-2xl overflow-hidden bg-slate-100 mb-5">
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
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold text-slate-800">{heroProduct.rating}</span>
                    <span className="text-xs text-slate-400">({heroProduct.reviewsCount} রিভিউ)</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    স্টকে আছে ({heroProduct.stockCount} টি)
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-lg leading-snug">
                  {heroProduct.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {heroProduct.shortDescription}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900">
                      ৳{heroProduct.price.toLocaleString('en-US')}
                    </span>
                    <span className="text-xs text-slate-400 line-through ml-2">
                      ৳{heroProduct.originalPrice.toLocaleString('en-US')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openQuickView(heroProduct)}
                      className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                    >
                      ডিটেইলস
                    </button>
                    <button
                      onClick={() => addToCart(heroProduct)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition hover:scale-105"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      অর্ডার করুন
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating micro widgets */}
            <div className="hidden sm:flex items-center gap-3 absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">ক্যাশ অন ডেলিভারি</p>
                <p className="text-[11px] text-slate-500">পণ্য হাতে পেয়ে পেমেন্ট করুন</p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">জেনুইন কোয়ালিটি</p>
                <p className="text-[11px] text-slate-500">টেস্টেড ও ভেরিফাইড</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
