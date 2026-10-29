'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Phone, Mail, MapPin } from 'lucide-react';
import { CATEGORIES } from '@/data/products';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Smart<span className="text-emerald-400">Ghor</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              SmartGhor বাংলাদেশের শীর্ষস্থানীয় প্রিমিয়াম স্মার্ট হোম ও উদ্ভাবনী ইউনিক গ্যাজেট শপ। দৈনন্দিন জীবনকে প্রযুক্তির ছোঁয়ায় সহজ ও নান্দনিক করাই আমাদের মূল লক্ষ্য।
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-emerald-600 hover:text-white text-slate-400 flex items-center justify-center transition duration-200"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-emerald-600 hover:text-white text-slate-400 flex items-center justify-center transition duration-200"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-emerald-600 hover:text-white text-slate-400 flex items-center justify-center transition duration-200"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              ক্যাটাগরি
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <a href={`#${cat.slug}`} className="hover:text-emerald-400 transition">
                    {cat.banglaName}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              গ্রাহক সেবা
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <a href="#flash-deals" className="hover:text-emerald-400 transition">
                  ফ্ল্যাশ ডিলস ও অফার
                </a>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition cursor-pointer">
                  অর্ডার ট্র্যাকিং
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition cursor-pointer">
                  রিটার্ন ও রিফান্ড পলিসি
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition cursor-pointer">
                  ওয়ারেন্টি ক্লেইম গাইড
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-400 transition cursor-pointer">
                  প্রাইভেসি ও পলিসি
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              যোগাযোগ
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>ধানমন্ডি ৮/এ, ঢাকা - ১২০৯, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+৮৮০ ১৮০০-৭৬২৭৮৪</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@smartghor.com</span>
              </li>
            </ul>

            {/* Payment Methods */}
            <div className="pt-3">
              <p className="text-[11px] font-semibold text-slate-400 mb-2">নিরাপদ পেমেন্ট মেথড:</p>
              <div className="flex flex-wrap items-center gap-1.5">
                {['bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard', 'COD'].map((method) => (
                  <span
                    key={method}
                    className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-semibold text-slate-300"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SmartGhor. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            ডিজাইন ও ডেভেলপমেন্ট: <span className="text-emerald-400 font-semibold">SmartGhor Tech Team</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
