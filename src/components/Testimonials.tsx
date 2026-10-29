'use client';

import React from 'react';
import Image from 'next/image';
import { TESTIMONIALS } from '@/data/products';
import { Star, CheckCircle, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-14 bg-gradient-to-b from-white to-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            কাস্টমারদের ভালোবাসা
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            গ্রাহকরা যা বলছেন আমাদের সম্পর্কে
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            হাজারো স্মার্ট ক্রেতাদের রিভিউ ও বাস্তব অভিজ্ঞতার এক ঝলক
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between group"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-100 group-hover:text-emerald-100 transition-colors" />

              <div>
                {/* Rating */}
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-slate-700 leading-relaxed italic mb-4">
                  "{item.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                  <Image
                    src={item.avatar}
                    alt={item.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900">{item.author}</h4>
                    {item.verified && (
                      <span title="ভেরিফাইড ক্রেতা">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{item.productName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
