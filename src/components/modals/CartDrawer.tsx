'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    couponDiscount,
    shippingFee,
    finalTotal,
    amountNeededForFreeShipping,
    freeShippingThreshold,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const ok = applyCoupon(couponInput);
    if (ok) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-zinc-200">
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-950 text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-bold">আপনার শপিং ব্যাগ</h2>
              <span className="text-xs bg-red-600 text-yellow-200 px-2.5 py-0.5 rounded-full font-black">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator in Red & Yellow */}
          <div className="px-5 py-3 bg-zinc-900 border-b border-zinc-800 text-zinc-200">
            {amountNeededForFreeShipping > 0 ? (
              <div>
                <p className="text-xs font-semibold mb-1.5 flex items-center gap-1.5 text-zinc-300">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  আর মাত্র <span className="font-bold text-yellow-400">৳{amountNeededForFreeShipping}</span> টাকার অর্ডার করলেই ফ্রি ডেলিভারি!
                </p>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden border border-zinc-700">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-red-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                অভিনন্দন! আপনি পাচ্ছেন ফ্রি হোম ডেলিভারি! 🚚
              </p>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4 border border-zinc-200">
                  <ShoppingBag className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-base font-bold text-zinc-800">আপনার কার্ট বর্তমানে খালি</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                  পছন্দের গ্যাজেট খুঁজে বের করতে আমাদের ইউনিক কালেকশন ঘুরে দেখুন
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-5 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl shadow-md hover:bg-red-700 transition"
                >
                  শপিং শুরু করুন
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedColor || ''}`}
                  className="flex gap-3.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 relative group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-white shrink-0 border border-zinc-200">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-zinc-950 truncate">
                      {item.product.name}
                    </h4>

                    {item.selectedColor && (
                      <span className="text-[11px] text-zinc-500 block">
                        কালার: {item.selectedColor}
                      </span>
                    )}

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-sm font-black text-zinc-950">
                        ৳{item.product.price.toLocaleString('en-US')}
                      </span>
                      {item.product.originalPrice > item.product.price && (
                        <span className="text-[11px] text-zinc-400 line-through">
                          ৳{item.product.originalPrice.toLocaleString('en-US')}
                        </span>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-white px-2 py-0.5 rounded-lg border border-zinc-200">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="text-zinc-500 hover:text-red-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-zinc-900 min-w-[14px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="text-zinc-500 hover:text-red-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-zinc-400 hover:text-red-600 p-1 transition"
                        title="রিমুভ করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-200 bg-white space-y-4">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-yellow-50 border border-yellow-300 text-xs font-bold text-zinc-900">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-red-600" />
                    <span>কুপন কোড: <strong className="text-red-600">{appliedCoupon}</strong> (-৳{couponDiscount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 hover:text-red-800 font-bold ml-2 text-[11px] underline"
                  >
                    মুছে দিন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="প্রোমোকোড (যেমন: SMART10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-zinc-200 rounded-xl outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 text-yellow-400 text-xs font-bold rounded-xl transition"
                  >
                    অ্যাপ্লাই
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600 font-medium">{couponError}</p>}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>সাবটোটাল</span>
                  <span className="font-semibold text-zinc-900">৳{subtotal.toLocaleString('en-US')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>ডিসকাউন্ট</span>
                    <span>- ৳{couponDiscount.toLocaleString('en-US')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-semibold text-zinc-900">
                    {shippingFee === 0 ? (
                      <span className="text-yellow-600 font-black">ফ্রি (৳০)</span>
                    ) : (
                      `৳${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-zinc-200 flex justify-between text-sm font-black text-zinc-950">
                  <span>সর্বমোট প্রদেয়</span>
                  <span className="text-lg text-red-600">৳{finalTotal.toLocaleString('en-US')}</span>
                </div>
              </div>

              {/* Checkout CTA in Red */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>অর্ডার সম্পন্ন করুন</span>
                <ArrowRight className="w-4 h-4 text-yellow-300" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
