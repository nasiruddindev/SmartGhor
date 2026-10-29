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
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between">
            <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-white border border-slate-200/60 shadow-xs mb-3">
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
                      activeImageIdx === i ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-transparent opacity-70 hover:opacity-100'
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
                <span className="text-emerald-700 font-bold uppercase tracking-wider">
                  {quickViewProduct.categoryLabel}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-slate-800">{quickViewProduct.rating}</span>
                  <span className="text-slate-400">({quickViewProduct.reviewsCount} রিভিউ)</span>
                </div>
              </div>

              <h2 className="text-xl font-black text-slate-900 leading-snug">
                {quickViewProduct.name}
              </h2>
              {quickViewProduct.banglaName && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {quickViewProduct.banglaName}
                </p>
              )}

              {/* Price & Savings */}
              <div className="flex items-baseline gap-2.5 my-3">
                <span className="text-2xl font-black text-slate-900">
                  ৳{quickViewProduct.price.toLocaleString('en-US')}
                </span>
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      ৳{quickViewProduct.originalPrice.toLocaleString('en-US')}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {quickViewProduct.discountPercentage}% ছাড়
                    </span>
                  </>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Features list */}
              <div className="mt-4 space-y-1.5">
                <p className="text-xs font-bold text-slate-800">মূল বৈশিষ্ট্যসমূহ:</p>
                {quickViewProduct.features.slice(0, 4).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Color Selection (if any) */}
              {quickViewProduct.colors && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-slate-800 mb-1.5">কালার সিলেক্ট করুন:</p>
                  <div className="flex items-center gap-2">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition ${
                          selectedColor === c.name
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                            : 'border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-slate-300 shadow-xs"
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
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>ওয়ারেন্টি: {quickViewProduct.warranty}</span>
                </div>
              )}
            </div>

            {/* Actions: Quantity + Add to Cart + Buy Now */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">পরিমাণ:</span>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-900 min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>কার্টে যোগ করুন</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-600/20"
                >
                  <Zap className="w-4 h-4 fill-current" />
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
