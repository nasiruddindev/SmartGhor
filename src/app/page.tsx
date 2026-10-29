'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FlashDeals } from '@/components/FlashDeals';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ProductSection } from '@/components/ProductSection';
import { WhyChooseUs } from '@/components/WhyChooseUs';
import { Testimonials } from '@/components/Testimonials';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';
import { useShop } from '@/context/ShopContext';
import { ShoppingBag, MessageCircle } from 'lucide-react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { totalCartItems, setIsCartOpen } = useShop();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Category Tiles */}
        <CategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Flash Deals with Live Countdown Timer */}
        <FlashDeals />

        {/* Main Product Showcase with Filters & Sorting */}
        <ProductSection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Trust Badges & Guarantees */}
        <WhyChooseUs />

        {/* Customer Testimonials & Reviews */}
        <Testimonials />

        {/* Newsletter Signup with Discount Voucher */}
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
        {/* WhatsApp / Direct Support Float */}
        <a
          href="https://wa.me/8801800000000"
          target="_blank"
          rel="noreferrer"
          className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
          title="হোয়াটসঅ্যাপে সরাসরি মেসেজ দিন"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </a>
      </div>

      {/* Floating Cart Button for Mobile View */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-6 right-6 z-40 sm:hidden">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-full font-bold shadow-2xl hover:bg-emerald-700 transition-all animate-bounce"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>({totalCartItems}) দেখুন</span>
          </button>
        </div>
      )}
    </div>
  );
}
