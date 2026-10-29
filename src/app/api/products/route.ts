import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';

// In-memory cache fallback for demo/offline use
let localProducts: Product[] = [...PRODUCTS];

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Map database columns to Product type
        const mapped: Product[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          banglaName: row.bangla_name,
          slug: row.slug,
          category: row.category,
          categoryLabel: row.category_label,
          price: Number(row.price),
          originalPrice: Number(row.original_price),
          discountPercentage: Number(row.discount_percentage || 0),
          rating: Number(row.rating || 5.0),
          reviewsCount: Number(row.reviews_count || 0),
          inStock: Boolean(row.in_stock),
          stockCount: Number(row.stock_count || 0),
          isFeatured: Boolean(row.is_featured),
          isTrending: Boolean(row.is_trending),
          isNew: Boolean(row.is_new),
          isFlashSale: Boolean(row.is_flash_sale),
          images: row.images || [],
          shortDescription: row.short_description,
          description: row.description,
          features: row.features || [],
          colors: row.colors || [],
          warranty: row.warranty,
        }));
        return NextResponse.json({ success: true, products: mapped, source: 'supabase' });
      }
    }

    return NextResponse.json({
      success: true,
      products: localProducts,
      source: 'local',
      message: isSupabaseConfigured ? 'Fallback to local' : 'Supabase credentials not configured in .env.local yet',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message, products: localProducts },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newProduct: Product = {
      id: body.id || `sg-${Date.now().toString().slice(-6)}`,
      name: body.name,
      banglaName: body.banglaName || '',
      slug: (body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(/^-|-$/g, ''),
      category: body.category || 'smart-home',
      categoryLabel: body.categoryLabel || 'Smart Gadgets',
      price: Number(body.price),
      originalPrice: Number(body.originalPrice || body.price),
      discountPercentage: body.originalPrice > body.price
        ? Math.round(((body.originalPrice - body.price) / body.originalPrice) * 100)
        : 0,
      rating: Number(body.rating || 5.0),
      reviewsCount: 1,
      inStock: Number(body.stockCount) > 0,
      stockCount: Number(body.stockCount || 10),
      isFeatured: Boolean(body.isFeatured),
      isTrending: Boolean(body.isTrending),
      isNew: true,
      isFlashSale: Boolean(body.isFlashSale),
      images: Array.isArray(body.images) && body.images.length > 0 
        ? body.images 
        : ['https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'],
      shortDescription: body.shortDescription || body.description?.slice(0, 80) || '',
      description: body.description || '',
      features: body.features || ['প্রিমিয়াম কোয়ালিটি জেনুইন প্রোডাক্ট', 'স্মার্ট কন্ট্রোল প্রযুক্তি'],
      warranty: body.warranty || '১ বছরের রিপ্লেসমেন্ট ওয়ারেন্টি',
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').insert([
        {
          id: newProduct.id,
          name: newProduct.name,
          bangla_name: newProduct.banglaName,
          slug: newProduct.slug,
          category: newProduct.category,
          category_label: newProduct.categoryLabel,
          price: newProduct.price,
          original_price: newProduct.originalPrice,
          discount_percentage: newProduct.discountPercentage,
          rating: newProduct.rating,
          reviews_count: newProduct.reviewsCount,
          in_stock: newProduct.inStock,
          stock_count: newProduct.stockCount,
          is_featured: newProduct.isFeatured,
          is_trending: newProduct.isTrending,
          is_new: newProduct.isNew,
          is_flash_sale: newProduct.isFlashSale,
          images: newProduct.images,
          short_description: newProduct.shortDescription,
          description: newProduct.description,
          features: newProduct.features,
          warranty: newProduct.warranty,
        },
      ]);

      if (error) {
        console.error('Supabase product insert error:', error);
      }
    }

    // Always update local memory store as well
    localProducts = [newProduct, ...localProducts];

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Product added successfully!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
