import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

// In-memory fallback mock orders
let localOrders: any[] = [
  {
    id: 'SG-948123',
    customer_name: 'সাকিব মাহমুদ',
    phone: '01712345678',
    delivery_zone: 'inside-dhaka',
    address: 'বাড়ি #১২, রোড #৫, ধানমন্ডি, ঢাকা',
    notes: 'কল দিয়ে আসবেন',
    payment_method: 'cod',
    subtotal: 3450,
    discount: 345,
    delivery_charge: 0,
    total_payable: 3105,
    status: 'pending',
    items: [
      {
        name: 'LevitaGlow Magnetic Floating Moon Lamp',
        quantity: 1,
        price: 3450,
      },
    ],
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'SG-812904',
    customer_name: 'ফারজানা আক্তার',
    phone: '01898765432',
    delivery_zone: 'outside-dhaka',
    address: 'জিইসি মোড়, চট্টগ্রাম',
    notes: 'বিকেলের পর ডেলিভারি দেবেন',
    payment_method: 'bkash',
    subtotal: 2890,
    discount: 0,
    delivery_charge: 120,
    total_payable: 3010,
    status: 'confirmed',
    items: [
      {
        name: 'CyberAcoustics Transparent Cyberpunk ANC Earbuds',
        quantity: 1,
        price: 2890,
      },
    ],
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
];

export async function GET() {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return NextResponse.json({ success: true, orders: data, source: 'supabase' });
      }
    }

    return NextResponse.json({
      success: true,
      orders: localOrders,
      source: 'local',
      message: isSupabaseConfigured ? 'Fallback to local orders' : 'Using local store until Supabase keys provided',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newOrder = {
      id: body.id || `SG-${Math.floor(100000 + Math.random() * 900000)}`,
      customer_name: body.customerName,
      phone: body.phone,
      delivery_zone: body.deliveryZone,
      address: body.address,
      notes: body.notes || '',
      payment_method: body.paymentMethod,
      subtotal: Number(body.subtotal),
      discount: Number(body.discount || 0),
      delivery_charge: Number(body.deliveryCharge || 0),
      total_payable: Number(body.totalPayable),
      status: 'pending',
      items: body.items,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('orders').insert([newOrder]);
      if (error) {
        console.error('Supabase order insert error:', error);
      }
    }

    localOrders = [newOrder, ...localOrders];

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: 'Order created successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
