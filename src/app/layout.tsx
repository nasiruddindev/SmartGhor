import type { Metadata } from 'next';
import './globals.css';
import { ShopProvider } from '@/context/ShopContext';
import { Toast } from '@/components/ui/Toast';
import { CartDrawer } from '@/components/modals/CartDrawer';
import { QuickViewModal } from '@/components/modals/QuickViewModal';
import { SearchModal } from '@/components/modals/SearchModal';
import { CheckoutModal } from '@/components/modals/CheckoutModal';

export const metadata: Metadata = {
  title: 'SmartGhor | স্মার্ট হোম ও ইউনিক গ্যাজেট শপ',
  description: 'SmartGhor - বাংলাদেশের সেরা উদ্ভাবনী ও ইউনিক স্মার্ট গ্যাজেটের কালেকশন। ক্যাশ অন ডেলিভারি ও দ্রুত হোম ডেলিভারি সুবিধা।',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
        <ShopProvider>
          {children}
          {/* Global Interactive Overlays */}
          <Toast />
          <CartDrawer />
          <QuickViewModal />
          <SearchModal />
          <CheckoutModal />
        </ShopProvider>
      </body>
    </html>
  );
}
