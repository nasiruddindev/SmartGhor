'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { Mail, Gift, Check, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useShop();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('অনুগ্রহ করে সঠিক ইমেইল এড্রেস লিখুন', 'error');
      return;
    }

    setSubscribed(true);
    showToast('অভিনন্দন! আপনার ডিসকাউন্ট কুপন আনলক হয়েছে', 'success');

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <section className="py-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-emerald-100 text-xs font-semibold mb-4">
          <Gift className="w-3.5 h-3.5 text-amber-300" />
          <span>প্রথম অর্ডারে ১০% ইনস্ট্যান্ট ছাড়</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
          নতুন সব গ্যাজেট ও অফারের আপডেট পান সবার আগে
        </h2>
        <p className="text-emerald-100 text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal">
          আমাদের নিউজলেটারে সাবস্ক্রাইব করলেই পাচ্ছেন{' '}
          <strong className="text-white underline font-bold">SMART10</strong> প্রোমোকোড।
        </p>

        {subscribed ? (
          <div className="bg-white/15 backdrop-blur-md p-6 rounded-3xl border border-white/30 max-w-md mx-auto animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 bg-white text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold">সাবস্ক্রিপশন সফল হয়েছে!</h3>
            <p className="text-xs text-emerald-100 mt-1">
              আপনার প্রোমোকোড: <span className="bg-white/20 px-2 py-0.5 rounded font-mono font-bold text-amber-300">SMART10</span>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto bg-white/15 backdrop-blur-md p-2 rounded-2xl border border-white/25 shadow-xl"
          >
            <div className="flex items-center gap-2.5 px-3 w-full">
              <Mail className="w-5 h-5 text-emerald-200 shrink-0" />
              <input
                type="email"
                placeholder="আপনার ইমেইল এড্রেস লিখুন..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white placeholder-emerald-200/70 text-sm outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-emerald-800 text-xs sm:text-sm font-bold rounded-xl shrink-0 transition-all duration-200 shadow-md flex items-center justify-center gap-1.5"
            >
              <span>সাবস্ক্রাইব</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
