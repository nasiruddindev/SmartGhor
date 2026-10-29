'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const perks = [
    {
      icon: <Truck className="w-6 h-6 text-emerald-600" />,
      title: 'সারাদেশে হোম ডেলিভারি',
      desc: 'ঢাকায় ২৪-৪৮ ঘণ্টা এবং দেশের যেকোনো প্রান্তে দ্রুত নির্ভরযোগ্য হোম ডেলিভারি।',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
      title: 'ক্যাশ অন ডেলিভারি সুবিধা',
      desc: 'অগ্রিম কোনো টাকা দিতে হবে না, পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করুন।',
      bgColor: 'bg-teal-50',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-indigo-600" />,
      title: '৭ দিনের সহজ রিপ্লেসমেন্ট',
      desc: 'প্রোডাক্টে কোনো ম্যানুফ্যাকচারিং ত্রুটি থাকলে কোনো ঝামেলা ছাড়াই পরিবর্তন সুবিধা।',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: <Headphones className="w-6 h-6 text-amber-600" />,
      title: '২৪/৭ কাস্টমার সাপোর্ট',
      desc: 'অর্ডার, ট্র্যাকিং বা টেকনিক্যাল যেকোনো তথ্যের জন্য আমাদের টিম সার্বক্ষণিক প্রস্তুত।',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <section className="py-14 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            কেন SmartGhor সেরা
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            নিশ্চিন্ত ও বিশ্বস্ত অনলাইন কেনাকাটার অভিজ্ঞতা
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, index) => (
            <div
              key={index}
              className="p-6 rounded-3xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${perk.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xs`}
              >
                {perk.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">{perk.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
