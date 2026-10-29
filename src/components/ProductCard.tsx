'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView } = useShop();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-3xl p-4 border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges & Action Buttons */}
        <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-slate-50 mb-3.5">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.discountPercentage > 0 && (
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                {product.discountPercentage}% OFF
              </span>
            )}
            {product.isNew && (
              <span className="bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                নতুন
              </span>
            )}
          </div>

          {/* Action Buttons (Wishlist & Quick View) */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-2 rounded-xl backdrop-blur-md shadow-xs transition duration-200 ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-500'
                  : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
              }`}
              title="উইশলিস্টে যুক্ত করুন"
            >
              <Heart
                className={`w-4 h-4 transition-all ${
                  isWishlisted ? 'fill-rose-500 scale-110' : ''
                }`}
              />
            </button>

            <button
              onClick={() => openQuickView(product)}
              className="p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-emerald-600 backdrop-blur-md shadow-xs opacity-0 group-hover:opacity-100 transition duration-200"
              title="এক নজরে দেখুন"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Color Preview Swatches (if any) */}
          {product.colors && product.colors.length > 0 && (
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-2 py-1 rounded-full border border-slate-200/50">
              {product.colors.map((c, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-medium">{product.categoryLabel}</span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold text-slate-800">{product.rating}</span>
            <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => openQuickView(product)}
          className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-emerald-700 transition cursor-pointer"
        >
          {product.name}
        </h3>

        {/* Bangla Subtitle */}
        {product.banglaName && (
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {product.banglaName}
          </p>
        )}
      </div>

      {/* Price & Add to Cart Action */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-lg font-black text-slate-900">
            ৳{product.price.toLocaleString('en-US')}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-slate-400 line-through ml-1.5">
              ৳{product.originalPrice.toLocaleString('en-US')}
            </span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-all duration-200 hover:scale-105 active:scale-95"
          title="কার্টে যোগ করুন"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>কার্ট</span>
        </button>
      </div>
    </div>
  );
};
