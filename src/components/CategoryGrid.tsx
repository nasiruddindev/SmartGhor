'use client';

import React from 'react';
import Image from 'next/image';
import { CATEGORIES } from '@/data/products';
import { ArrowUpRight } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (categorySlug: string) => void;
  selectedCategory: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
              কালেকশন সমূহ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight mt-1">
              পছন্দের ক্যাটাগরি বেছে নিন
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xs sm:text-right">
            আপনার ঘরের প্রতিটি রুমের প্রয়োজন অনুসারে বাছাইকৃত স্মার্ট ডিভাইস
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;

            return (
              <div
                key={cat.id}
                id={cat.slug}
                onClick={() => {
                  onSelectCategory(cat.slug);
                  const el = document.getElementById('products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative overflow-hidden rounded-3xl p-4 cursor-pointer transition-all duration-300 border ${
                  isSelected
                    ? 'border-red-600 ring-2 ring-red-600/30 bg-red-50/30 shadow-md'
                    : 'border-zinc-200/90 hover:border-red-500 bg-zinc-50/70 hover:bg-white shadow-xs hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Category Image */}
                <div className="relative h-28 sm:h-36 w-full rounded-2xl overflow-hidden mb-3 bg-white">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-zinc-950/90 text-yellow-400 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 shadow-xs border border-zinc-800">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Category Info */}
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-bold text-zinc-950 text-sm group-hover:text-red-600 transition line-clamp-1">
                    {cat.banglaName}
                  </h3>
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-zinc-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                    <span>{cat.itemCount}+ প্রোডাক্টস</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
