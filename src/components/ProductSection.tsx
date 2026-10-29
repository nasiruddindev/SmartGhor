'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/types';
import { PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

interface ProductSectionProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'discount'>('featured');

  const categories = [
    { label: 'সকল প্রোডাক্ট', value: 'all' },
    { label: 'স্মার্ট হোম', value: 'smart-home' },
    { label: 'কিচেন টেক', value: 'kitchen-gadgets' },
    { label: 'অডিও ও ওয়্যারেবলস', value: 'audio-wearables' },
    { label: 'স্মার্ট লাইটিং', value: 'lighting' },
    { label: 'লাইফস্টাইল', value: 'lifestyle' },
  ];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      default:
        // featured
        break;
    }

    return result;
  }, [selectedCategory, sortBy]);

  return (
    <section id="products-section" className="py-14 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>এক্সক্লুসিভ আইটেমস</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              আমাদের সকল ইউনিক কালেকশন
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              মোট {filteredAndSortedProducts.length} টি উদ্ভাবনী প্রোডাক্ট প্রদর্শিত হচ্ছে
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-white px-3 py-2 rounded-2xl border border-slate-200/80 shadow-xs">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-500">সর্ট করুন:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="featured">ফিচার্ড / ট্রেন্ডিং</option>
              <option value="price-low">দাম: কম থেকে বেশি</option>
              <option value="price-high">দাম: বেশি থেকে কম</option>
              <option value="rating">সর্বোচ্চ রেটিং</option>
              <option value="discount">সর্বোচ্চ ছাড়</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onSelectCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-base font-semibold text-slate-700">এই ক্যাটাগরিতে কোনো প্রোডাক্ট পাওয়া যায়নি</p>
            <button
              onClick={() => onSelectCategory('all')}
              className="mt-3 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              সব প্রোডাক্ট দেখুন
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
