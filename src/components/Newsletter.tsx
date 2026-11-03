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
    <section className="py-16 bg-gradient-to-r from-black via-zinc-950 to-neutral-950 text-white relative overflow-hidden border-y border-zinc-800">
      {/* Decorative background shapes in Red & Yellow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-yellow-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400 text-zinc-950 text-xs font-black mb-4 shadow-md">
          <Gift className="w-3.5 h-3.5 fill-current" />
          <span>প্রথম অর্ডারে ১০% ইনস্ট্যান্ট ছাড়</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3 text-white">
          নতুন সব গ্যাজেট ও অফারের আপডেট পান সবার আগে
        </h2>
        <p className="text-zinc-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal">
          আমাদের নিউজলেটারে সাবস্ক্রাইব করলেই পাচ্ছেন{' '}
          <strong className="text-yellow-400 underline font-black">SMART10</strong> প্রোমোকোড।
        </p>

        {subscribed ? (
          <div className="bg-zinc-900/90 backdrop-blur-md p-6 rounded-3xl border border-red-600/40 max-w-md mx-auto animate-in fade-in zoom-in duration-300 shadow-2xl">
            <div className="w-12 h-12 bg-red-600 text-yellow-300 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold text-white">সাবস্ক্রিপশন সফল হয়েছে!</h3>
            <p className="text-xs text-zinc-300 mt-1">
              আপনার প্রোমোকোড: <span className="bg-black px-2.5 py-1 rounded font-mono font-bold text-yellow-400 border border-zinc-800">SMART10</span>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto bg-zinc-900/90 backdrop-blur-md p-2 rounded-2xl border border-zinc-800 shadow-2xl"
          >
            <div className="flex items-center gap-2.5 px-3 w-full">
              <Mail className="w-5 h-5 text-yellow-400 shrink-0" />
              <input
                type="email"
                placeholder="আপনার ইমেইল এড্রেস লিখুন..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white placeholder-zinc-400 text-sm outline-none font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold rounded-xl shrink-0 transition-all duration-200 shadow-md flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>সাবস্ক্রাইব</span>
              <ArrowRight className="w-4 h-4 text-yellow-300" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
