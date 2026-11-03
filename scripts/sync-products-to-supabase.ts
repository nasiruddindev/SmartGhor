import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { PRODUCTS } from '../src/data/products';

// Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
let supabaseUrl = '';
let supabaseKey = '';

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = trimmed.split('=')[1].trim();
  }
  if (trimmed.startsWith('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=')) {
    supabaseKey = trimmed.split('=')[1].trim();
  }
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
  console.log(`Syncing ${PRODUCTS.length} products to Supabase (${supabaseUrl})...`);

  for (const p of PRODUCTS) {
    const row = {
      id: p.id,
      name: p.name,
      bangla_name: p.banglaName || null,
      slug: p.slug,
      category: p.category,
      category_label: p.categoryLabel,
      price: p.price,
      original_price: p.originalPrice,
      discount_percentage: p.discountPercentage,
      rating: p.rating,
      reviews_count: p.reviewsCount,
      in_stock: p.inStock,
      stock_count: p.stockCount,
      is_featured: p.isFeatured,
      is_trending: p.isTrending,
      is_new: p.isNew,
      is_flash_sale: p.isFlashSale,
      images: p.images,
      short_description: p.shortDescription,
      description: p.description,
      features: p.features || [],
      colors: p.colors || [],
      warranty: p.warranty || null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('products').upsert(row, { onConflict: 'id' });
    if (error) {
      console.error(`Failed to upsert product ${p.id} (${p.name}):`, error.message);
    } else {
      console.log(`✓ Upserted ${p.id}: ${p.name}`);
    }
  }

  // Count final rows
  const { data, count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact' });

  if (error) {
    console.error('Count error:', error.message);
  } else {
    console.log(`\n🎉 Success! Total products now in Supabase: ${data?.length || count}`);
  }
}

sync();
