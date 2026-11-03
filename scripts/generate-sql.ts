import fs from 'fs';
import { PRODUCTS } from '../src/data/products';

const escapeSql = (str) => {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''")}'`;
};

const escapeArray = (arr) => {
  if (!arr || arr.length === 0) return "'{}'";
  const items = arr.map(item => `"${item.replace(/"/g, '\\"')}"`);
  return `'${JSON.stringify(arr).replace(/'/g, "''")}'::text[]`;
};

let sqlSeed = `INSERT INTO public.products (
  id, name, bangla_name, slug, category, category_label, price, original_price, 
  discount_percentage, rating, reviews_count, in_stock, stock_count, 
  is_featured, is_trending, is_new, is_flash_sale, images, short_description, description, features, warranty
) VALUES \n`;

const values = PRODUCTS.map(p => {
  const images = `ARRAY[${p.images.map(img => `'${img}'`).join(', ')}]`;
  const features = `ARRAY[${(p.features || []).map(f => `'${f.replace(/'/g, "''")}'`).join(', ')}]`;
  return `(
  ${escapeSql(p.id)},
  ${escapeSql(p.name)},
  ${escapeSql(p.banglaName)},
  ${escapeSql(p.slug)},
  ${escapeSql(p.category)},
  ${escapeSql(p.categoryLabel)},
  ${p.price},
  ${p.originalPrice},
  ${p.discountPercentage},
  ${p.rating},
  ${p.reviewsCount},
  ${p.inStock},
  ${p.stockCount},
  ${p.isFeatured},
  ${p.isTrending},
  ${p.isNew},
  ${p.isFlashSale},
  ${images},
  ${escapeSql(p.shortDescription)},
  ${escapeSql(p.description)},
  ${features},
  ${escapeSql(p.warranty)}
)`;
}).join(',\n');

sqlSeed += values + `\nON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  bangla_name = EXCLUDED.bangla_name,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  category_label = EXCLUDED.category_label,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  discount_percentage = EXCLUDED.discount_percentage,
  rating = EXCLUDED.rating,
  reviews_count = EXCLUDED.reviews_count,
  in_stock = EXCLUDED.in_stock,
  stock_count = EXCLUDED.stock_count,
  is_featured = EXCLUDED.is_featured,
  is_trending = EXCLUDED.is_trending,
  is_new = EXCLUDED.is_new,
  is_flash_sale = EXCLUDED.is_flash_sale,
  images = EXCLUDED.images,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  warranty = EXCLUDED.warranty;
`;

const schemaHeader = `-- =========================================================
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

-- 6. Insert All 18 SmartGhor Seed Products
` + sqlSeed;

fs.writeFileSync('supabase_schema.sql', schemaHeader, 'utf8');
console.log('Successfully regenerated supabase_schema.sql with 18 products.');
