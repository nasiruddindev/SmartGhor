'use client';

import React from 'react';
import { useShop } from '@/context/ShopContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useShop();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-yellow-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-yellow-400 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-zinc-950 border-red-600/50 text-yellow-300 shadow-2xl',
    error: 'bg-zinc-950 border-red-600 text-red-300 shadow-2xl',
    info: 'bg-zinc-950 border-zinc-700 text-zinc-100 shadow-2xl',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${bgStyles[toast.type]}`}
      >
        {icons[toast.type]}
        <p className="text-sm font-bold">{toast.message}</p>
      </div>
    </div>
  );
};
