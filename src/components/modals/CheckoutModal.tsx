'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import {
  X,
  ShieldCheck,
  CheckCircle,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    couponDiscount,
    clearCart,
    showToast,
  } = useShop();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    deliveryZone: 'inside-dhaka', // 'inside-dhaka' | 'outside-dhaka'
    address: '',
    notes: '',
    paymentMethod: 'cod', // 'cod' | 'bkash' | 'card'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isCheckoutOpen) return null;

  // Delivery fee logic
  const isFreeDelivery = subtotal >= 2500;
  const deliveryCharge = isFreeDelivery
    ? 0
    : formData.deliveryZone === 'inside-dhaka'
    ? 60
    : 120;

  const totalPayable = Math.max(0, subtotal - couponDiscount + deliveryCharge);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      showToast('অনুগ্রহ করে নাম, ফোন নম্বর এবং সম্পূর্ণ ঠিকানা লিখুন', 'error');
      return;
    }

    if (formData.phone.trim().length < 11) {
      showToast('অনুগ্রহ করে ১১ ডিজিটের সঠিক মোবাইল নম্বর লিখুন', 'error');
      return;
    }

    setIsSubmitting(true);

    const generatedId = `SG-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      id: generatedId,
      customerName: formData.fullName,
      phone: formData.phone,
      deliveryZone: formData.deliveryZone,
      address: formData.address,
      notes: formData.notes,
      paymentMethod: formData.paymentMethod,
      subtotal,
      discount: couponDiscount,
      deliveryCharge,
      totalPayable,
      items: cart.map((c) => ({
        id: c.product.id,
        name: c.product.name,
        price: c.product.price,
        quantity: c.quantity,
        selectedColor: c.selectedColor,
      })),
    };

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    }).catch((e) => console.error('Failed to post order:', e));

    setTimeout(() => {
      setOrderId(generatedId);
      setOrderPlaced(true);
      setIsSubmitting(false);
      clearCart();

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore
      }
    }, 1000);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderPlaced(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        {orderPlaced ? (
          /* Order Success Confirmation Screen */
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5" />
                অর্ডার সফলভাবে গ্রহণ করা হয়েছে!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                ধন্যবাদ, {formData.fullName}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                আপনার অর্ডারটি প্রক্রিয়াধীন রয়েছে। খুব শীঘ্রই আমাদের কাস্টমার রিপ্রেজেন্টেটিভ আপনার ফোনে কল করে অর্ডারটি নিশ্চিত করবেন।
              </p>
            </div>

            {/* Order Tracking Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-sm mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">অর্ডার ট্র্যাকিং আইডি:</span>
                <span className="font-mono font-bold text-slate-900">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">পেমেন্ট মেথড:</span>
                <span className="font-semibold text-slate-900 uppercase">
                  {formData.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : formData.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>সর্বমোট প্রদেয়:</span>
                <span className="text-emerald-700">৳{totalPayable.toLocaleString('en-US')}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg transition"
            >
              আরো শপিং করুন
            </button>
          </div>
        ) : (
          /* Checkout Form Screen */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  অর্ডার কনফার্মেশন ও চেকআউট
                </h2>
                <p className="text-xs text-slate-500">
                  নিচের তথ্যগুলো পূরণ করে এক ক্লিকেই অর্ডার সম্পূর্ণ করুন
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  আপনার নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ সাব্বির আহমেদ"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Delivery Zone Selection */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ডেলিভারি এরিয়া বেছে নিন
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setFormData({ ...formData, deliveryZone: 'inside-dhaka' })}
                    className={`p-3 rounded-2xl border cursor-pointer transition ${
                      formData.deliveryZone === 'inside-dhaka'
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">ঢাকার ভিতরে</span>
                      <span className="text-xs font-bold text-emerald-700">
                        {isFreeDelivery ? 'ফ্রি' : '৳৬০'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">২৪-৪৮ ঘণ্টায় ডেলিভারি</span>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, deliveryZone: 'outside-dhaka' })}
                    className={`p-3 rounded-2xl border cursor-pointer transition ${
                      formData.deliveryZone === 'outside-dhaka'
                        ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">ঢাকার বাইরে</span>
                      <span className="text-xs font-bold text-emerald-700">
                        {isFreeDelivery ? 'ফ্রি' : '৳১২০'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">২-৩ কার্যদিবসে ডেলিভারি</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  সম্পূর্ণ ডেলিভারি ঠিকানা <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="বাসা নং, রোড নং, এলাকা, থানা ও জেলা..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Payment Method */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  পেমেন্ট পদ্ধতি
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'cod', name: 'ক্যাশ অন ডেলিভারি', icon: <Banknote className="w-4 h-4 text-emerald-600" /> },
                    { id: 'bkash', name: 'বিকাশ / নগদ', icon: <Smartphone className="w-4 h-4 text-rose-500" /> },
                    { id: 'card', name: 'কার্ড পেমেন্ট', icon: <CreditCard className="w-4 h-4 text-indigo-600" /> },
                  ].map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`p-3 rounded-2xl border text-center cursor-pointer transition ${
                        formData.paymentMethod === method.id
                          ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-center mb-1">{method.icon}</div>
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {method.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Summary & Submit */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>প্রোডাক্ট সংখ্যা:</span>
                <span className="font-bold">{cart.length} টি</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>সাবটোটাল:</span>
                <span className="font-semibold text-slate-800">৳{subtotal.toLocaleString('en-US')}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600">
                  <span>ডিসকাউন্ট:</span>
                  <span>- ৳{couponDiscount.toLocaleString('en-US')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-slate-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold text-emerald-700">
                  {deliveryCharge === 0 ? 'ফ্রি' : `৳${deliveryCharge}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                <span>সর্বমোট বিল:</span>
                <span className="text-xl text-emerald-700">৳{totalPayable.toLocaleString('en-US')}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99]"
            >
              <Truck className="w-5 h-5" />
              <span>{isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
