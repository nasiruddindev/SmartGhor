'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import {
  X,
  Star,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
} from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useShop();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedColor);
    closeQuickView();
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, quantity, selectedColor);
    closeQuickView();
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeQuickView}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 border border-zinc-200">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="p-6 bg-zinc-50 flex flex-col justify-between border-r border-zinc-100">
            <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-xs mb-3">
              <Image
                src={quickViewProduct.images[activeImageIdx] || quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail selector */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {quickViewProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      activeImageIdx === i ? 'border-red-600 ring-2 ring-red-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="Thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Purchase actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-red-600 font-black uppercase tracking-wider text-[11px]">
                  {quickViewProduct.categoryLabel}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-zinc-900">{quickViewProduct.rating}</span>
                  <span className="text-zinc-400">({quickViewProduct.reviewsCount} রিভিউ)</span>
                </div>
              </div>

              <h2 className="text-xl font-black text-zinc-950 leading-snug">
                {quickViewProduct.name}
              </h2>
              {quickViewProduct.banglaName && (
                <p className="text-xs text-zinc-500 mt-0.5">
                  {quickViewProduct.banglaName}
                </p>
              )}

              {/* Price & Savings */}
              <div className="flex items-baseline gap-2.5 my-3">
                <span className="text-2xl font-black text-zinc-950">
                  ৳{quickViewProduct.price.toLocaleString('en-US')}
                </span>
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <>
                    <span className="text-sm text-zinc-400 line-through">
                      ৳{quickViewProduct.originalPrice.toLocaleString('en-US')}
                    </span>
                    <span className="text-xs font-black text-yellow-300 bg-red-600 px-2.5 py-0.5 rounded-full shadow-xs">
                      {quickViewProduct.discountPercentage}% ছাড়
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs text-zinc-600 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Features list */}
              <div className="mt-4 space-y-1.5">
                <p className="text-xs font-bold text-zinc-800">মূল বৈশিষ্ট্যসমূহ:</p>
                {quickViewProduct.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-600">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Color Selection (if any) */}
              {quickViewProduct.colors && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-zinc-800 mb-1.5">কালার সিলেক্ট করুন:</p>
                  <div className="flex items-center gap-2">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition ${
                          selectedColor === c.name
                            ? 'border-red-600 bg-red-50 text-red-950 font-bold'
                            : 'border-zinc-200 text-zinc-700 hover:border-zinc-300'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-zinc-300 shadow-xs"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty */}
              {quickViewProduct.warranty && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-600 mt-3 pt-3 border-t border-zinc-100">
                  <ShieldCheck className="w-4 h-4 text-yellow-500 fill-yellow-100" />
                  <span>ওয়ারেন্টি: {quickViewProduct.warranty}</span>
                </div>
              )}
            </div>

            {/* Actions: Quantity + Add to Cart + Buy Now */}
            <div className="pt-4 border-t border-zinc-100 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-700">পরিমাণ:</span>
                <div className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-xl border border-zinc-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-zinc-600 hover:text-red-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-zinc-900 min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-zinc-600 hover:text-red-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-95 border border-zinc-800"
                >
                  <ShoppingBag className="w-4 h-4 text-yellow-400" />
                  <span>কার্টে যোগ করুন</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-red-600/30"
                >
                  <Zap className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span>সরাসরি কিনুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
