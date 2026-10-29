import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Product ${id} deleted successfully`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (isSupabaseConfigured && supabase) {
      const updateData: any = {};
      if (body.price !== undefined) updateData.price = Number(body.price);
      if (body.originalPrice !== undefined) {
        updateData.original_price = Number(body.originalPrice);
        if (Number(body.originalPrice) > Number(body.price || 0)) {
          updateData.discount_percentage = Math.round(
            ((Number(body.originalPrice) - Number(body.price)) / Number(body.originalPrice)) * 100
          );
        }
      }
      if (body.stockCount !== undefined) {
        updateData.stock_count = Number(body.stockCount);
        updateData.in_stock = Number(body.stockCount) > 0;
      }
      if (body.name !== undefined) updateData.name = body.name;
      if (body.banglaName !== undefined) updateData.bangla_name = body.banglaName;
      if (body.category !== undefined) updateData.category = body.category;
      if (body.categoryLabel !== undefined) updateData.category_label = body.categoryLabel;
      if (body.shortDescription !== undefined) updateData.short_description = body.shortDescription;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.warranty !== undefined) updateData.warranty = body.warranty;
      if (body.images !== undefined) updateData.images = body.images;
      if (body.isFeatured !== undefined) updateData.is_featured = Boolean(body.isFeatured);
      if (body.isTrending !== undefined) updateData.is_trending = Boolean(body.isTrending);
      if (body.isFlashSale !== undefined) updateData.is_flash_sale = Boolean(body.isFlashSale);

      const { error } = await supabase.from('products').update(updateData).eq('id', id);
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Product ${id} updated successfully`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
