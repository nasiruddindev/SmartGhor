-- =========================================================
-- SmartGhor (স্মার্টঘর) - Supabase Database Schema
-- Run this in your Supabase SQL Editor: https://app.supabase.com
-- =========================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bangla_name TEXT,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  category_label TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC NOT NULL,
  discount_percentage NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  stock_count INT DEFAULT 10,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_flash_sale BOOLEAN DEFAULT false,
  images TEXT[] NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]'::jsonb,
  warranty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  delivery_zone TEXT NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  payment_method TEXT NOT NULL,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  delivery_charge NUMERIC NOT NULL,
  total_payable NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, confirmed, shipped, delivered, cancelled
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Set Policies for Products (Everyone can view, anyone or admin can insert/update/delete)
CREATE POLICY "Allow public read access to products"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Allow insert/update/delete to products"
  ON public.products FOR ALL
  USING (true);

-- 5. Set Policies for Orders
CREATE POLICY "Allow public insert to orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow read/update orders"
  ON public.orders FOR ALL
  USING (true);

-- 6. Insert Initial SmartGhor Seed Products
INSERT INTO public.products (
  id, name, bangla_name, slug, category, category_label, price, original_price, 
  discount_percentage, rating, reviews_count, in_stock, stock_count, 
  is_featured, is_trending, is_flash_sale, images, short_description, description, features, warranty
) VALUES 
(
  'sg-01',
  'LevitaGlow Magnetic Floating Moon Lamp',
  'ম্যাগনেটিক ভাসমান থ্রিডি মুন ল্যাম্প',
  'levitaglow-magnetic-floating-moon-lamp',
  'lighting',
  'Ambient Lighting',
  3450,
  4800,
  28,
  4.9,
  128,
  true,
  14,
  true,
  true,
  true,
  ARRAY['https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=800&q=80'],
  'ম্যাগনেটিক লেভিটেশন টেকনোলজিতে বাতাসে ভেসে থাকা থ্রিডি প্রিন্টেড ওয়্যারলেস মুন ল্যাম্প।',
  'LevitaGlow হলো আধুনিক ঘরের ড্রয়িংরুম বা বেডরুমের জন্য এক দৃষ্টিনন্দন গ্যাজেট। কোনো তারের সংযোগ ছাড়াই শূন্যে ভেসে ৩৬০ ডিগ্রি ঘুরতে পারে।',
  ARRAY['ম্যাগনেটিক লেভিটেশন - শূন্যে ভেসে ৩৬০ ডিগ্রি ঘূর্ণন', 'ওয়্যারলেস পাওয়ার ট্রান্সফার প্রযুক্তি', 'প্রিমিয়াম উডেন ফিনিশ বেস'],
  '১ বছরের অফিসিয়াল রিপ্লেসমেন্ট ওয়ারেন্টি'
),
(
  'sg-02',
  'CyberAcoustics Transparent Cyberpunk ANC Earbuds',
  'ট্রান্সপারেন্ট সাইবারপাঙ্ক ট্রু ওয়্যারলেস ইয়ারবাডস',
  'cyberacoustics-transparent-anc-earbuds',
  'audio-wearables',
  'Audio & Wearables',
  2890,
  3950,
  26,
  4.8,
  94,
  true,
  22,
  true,
  true,
  false,
  ARRAY['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'],
  'স্বচ্ছ আধুনিক ডিজাইনের এক্টিভ নয়েজ ক্যান্সেলেশন (ANC) ও সুপার ব্যাস অডিও।',
  'ফিউচারিস্টিক মেকানিজম এবং স্বচ্ছ কেসের সাইবারপাঙ্ক স্টাইলের ইয়ারবাডস। এতে রয়েছে ৪০ ডেসিবেল পর্যন্ত ANC।',
  ARRAY['40dB Active Noise Cancellation', '35ms Ultra-low Latency', 'IPX5 Water Resistant'],
  '৬ মাসের রিপ্লেসমেন্ট গ্যারান্টি'
),
(
  'sg-03',
  'SmartShield 2K WiFi Video Doorbell with Chime',
  'স্মার্ট ২কে ওয়াইফাই ভিডিও ডোরবেল ও নাইট ভিশন',
  'smartshield-2k-wifi-video-doorbell',
  'smart-home',
  'Smart Home Automation',
  4950,
  6500,
  23,
  4.9,
  65,
  true,
  9,
  true,
  false,
  false,
  ARRAY['https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'],
  'মোবাইলেই দরজার বাইরের লাইভ ২কে ফুটেজ, টু-ওয়ে কথা বলার সুযোগ ও এআই মোশন ডিটেকশন।',
  'ঘরে বা বাইরে যেখানেই থাকুন না কেন, আপনার দরজায় কে আসছে তা জানুন তাৎক্ষণিক নোটিফিকেশনে।',
  ARRAY['2K Ultra HD রেজ্যুলেশন', 'PIR Motion Detection', 'দ্বিমুখী রিয়েল-টাইম ভয়েস ইন্টারকম'],
  '১ বছরের ফুল সার্ভিস ওয়ারেন্টি'
)
ON CONFLICT (id) DO NOTHING;
