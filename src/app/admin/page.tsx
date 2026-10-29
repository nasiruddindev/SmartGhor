'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle,
  Clock,
  Truck,
  ArrowLeft,
  Database,
  ExternalLink,
  Phone,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { Product } from '@/types';
import { CATEGORIES } from '@/data/products';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'database'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Form State for Adding Product
  const [newProduct, setNewProduct] = useState({
    name: '',
    banglaName: '',
    category: 'smart-home',
    price: '',
    originalPrice: '',
    stockCount: '15',
    imageUrl: '',
    shortDescription: '',
    description: '',
    warranty: '১ বছরের অফিসিয়াল ওয়ারেন্টি',
    feature1: '',
    feature2: '',
    feature3: '',
  });

  // Fetch initial products and orders from Next.js API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
      ]);
      const prodData = await prodRes.json();
      const orderData = await orderRes.json();

      if (prodData.success) setProducts(prodData.products);
      if (orderData.success) setOrders(orderData.orders);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Add Product submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    try {
      const features = [newProduct.feature1, newProduct.feature2, newProduct.feature3].filter(Boolean);

      const categoryObj = CATEGORIES.find((c) => c.slug === newProduct.category);

      const payload = {
        name: newProduct.name,
        banglaName: newProduct.banglaName,
        category: newProduct.category,
        categoryLabel: categoryObj?.name || 'Smart Gadgets',
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice || newProduct.price),
        stockCount: Number(newProduct.stockCount || 10),
        images: newProduct.imageUrl
          ? [newProduct.imageUrl]
          : ['https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'],
        shortDescription: newProduct.shortDescription || newProduct.name,
        description: newProduct.description || newProduct.shortDescription || newProduct.name,
        warranty: newProduct.warranty,
        features: features.length > 0 ? features : ['প্রিমিয়াম কোয়ালিটি পণ্য', 'সহজ ব্যবহারযোগ্য'],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setProducts([result.product, ...products]);
        setIsAddingProduct(false);
        setNewProduct({
          name: '',
          banglaName: '',
          category: 'smart-home',
          price: '',
          originalPrice: '',
          stockCount: '15',
          imageUrl: '',
          shortDescription: '',
          description: '',
          warranty: '১ বছরের অফিসিয়াল ওয়ারেন্টি',
          feature1: '',
          feature2: '',
          feature3: '',
        });
      }
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${name}" প্রোডাক্টটি ডিলিট করতে চান?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (result.success) {
        setProducts(products.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  // Handle Order Status Change
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        setOrders(
          orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  // Calculations for dashboard
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_payable) || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 12).length;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.banglaName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ওয়েবসাইটে ফিরুন</span>
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 leading-tight">
                  Smart<span className="text-emerald-600">Ghor</span> অ্যাডমিন প্যানেল
                </h1>
                <span className="text-[10px] text-slate-400 block -mt-0.5">কন্ট্রোল ড্যাশবোর্ড</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                setActiveTab('products');
                setIsAddingProduct(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন প্রোডাক্ট যোগ করুন</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            ওভারভিউ (Dashboard)
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>প্রোডাক্ট ম্যানেজমেন্ট</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px]">
              {products.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>কাস্টমার অর্ডারসমূহ</span>
            {pendingOrders > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] animate-pulse">
                {pendingOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'database'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            <span>Supabase ডাটাবেস সেটিংস</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold">মোট সেলস (বিক্রি)</span>
                  <p className="text-2xl font-black text-slate-900">৳{totalRevenue.toLocaleString('en-US')}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold">পেন্ডিং অর্ডার</span>
                  <p className="text-2xl font-black text-amber-600">{pendingOrders} টি</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold">লাইভ প্রোডাক্ট</span>
                  <p className="text-2xl font-black text-slate-900">{products.length} টি</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold">লো স্টক অ্যালার্ট</span>
                  <p className="text-2xl font-black text-rose-600">{lowStockProducts} টি</p>
                </div>
              </div>
            </div>

            {/* Quick Recent Orders */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-slate-900">সাম্প্রতিক কাস্টমার অর্ডারসমূহ</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  সব অর্ডার দেখুন →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="pb-3">অর্ডার আইডি</th>
                      <th className="pb-3">কাস্টমার</th>
                      <th className="pb-3">ফোন নম্বর</th>
                      <th className="pb-3">পণ্য</th>
                      <th className="pb-3">টাকার পরিমাণ</th>
                      <th className="pb-3">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-mono font-bold text-slate-800">{order.id}</td>
                        <td className="py-3 font-medium text-slate-900">{order.customer_name}</td>
                        <td className="py-3 text-slate-600">{order.phone}</td>
                        <td className="py-3 text-slate-500 truncate max-w-[200px]">
                          {order.items?.map((i: any) => `${i.name} (x${i.quantity})`).join(', ')}
                        </td>
                        <td className="py-3 font-bold text-slate-900">
                          ৳{Number(order.total_payable).toLocaleString('en-US')}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                              order.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'shipped'
                                ? 'bg-indigo-100 text-indigo-800'
                                : order.status === 'delivered'
                                ? 'bg-slate-100 text-slate-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= PRODUCTS TAB ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="প্রোডাক্ট নাম দিয়ে খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={() => setIsAddingProduct(true)}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন প্রোডাক্ট যোগ করুন</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold">
                    <tr>
                      <th className="py-3 px-4">ছবি</th>
                      <th className="py-3 px-4">নাম ও বাংলা শিরোনাম</th>
                      <th className="py-3 px-4">ক্যাটাগরি</th>
                      <th className="py-3 px-4">মূল্য (বিক্রয়/নরমাল)</th>
                      <th className="py-3 px-4">স্টক</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900 leading-snug line-clamp-1">{p.name}</p>
                          <span className="text-slate-400 text-[11px] block">{p.banglaName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            {p.categoryLabel}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-extrabold text-slate-900">৳{p.price.toLocaleString('en-US')}</span>
                          {p.originalPrice > p.price && (
                            <span className="text-slate-400 line-through text-[11px] ml-1.5">
                              ৳{p.originalPrice.toLocaleString('en-US')}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                              p.stockCount <= 5
                                ? 'bg-rose-100 text-rose-700'
                                : p.stockCount <= 12
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {p.stockCount} টি অবশিষ্ট
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= ORDERS TAB ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
              {[
                { id: 'all', label: 'সকল অর্ডার' },
                { id: 'pending', label: 'পেন্ডিং' },
                { id: 'confirmed', label: 'কনফার্মড' },
                { id: 'shipped', label: 'শিপড' },
                { id: 'delivered', label: 'ডেলিভার্ড' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setOrderStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl border transition ${
                    orderStatusFilter === f.id
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Orders Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4"
                >
                  {/* Order Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="font-mono font-black text-slate-900 text-sm">#{order.id}</span>
                      <span className="text-[11px] text-slate-400 block">
                        {new Date(order.created_at).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Change Status Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">স্ট্যাটাস:</span>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-bold outline-none cursor-pointer"
                      >
                        <option value="pending">পেন্ডিং (Pending)</option>
                        <option value="confirmed">কনফার্মড (Confirmed)</option>
                        <option value="shipped">অন দ্য ওয়ে (Shipped)</option>
                        <option value="delivered">ডেলিভার্ড (Delivered)</option>
                        <option value="cancelled">ক্যান্সেলড (Cancelled)</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-900 text-sm">{order.customer_name}</p>
                    <div className="flex items-center gap-3 text-slate-600 pt-0.5">
                      <a
                        href={`tel:${order.phone}`}
                        className="flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{order.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/88${order.phone.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold"
                      >
                        হোয়াটসঅ্যাপ মেসেজ
                      </a>
                    </div>
                    <p className="text-slate-500 pt-1 leading-relaxed">
                      📍 {order.address} ({order.delivery_zone === 'inside-dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'})
                    </p>
                    {order.notes && (
                      <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-1">
                        নোট: {order.notes}
                      </p>
                    )}
                  </div>

                  {/* Items Ordered List */}
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 mb-1">অর্ডারকৃত পণ্যসমূহ:</p>
                    <div className="space-y-1">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-slate-800">
                            {item.name} <strong className="text-emerald-700">x{item.quantity}</strong>
                          </span>
                          <span className="font-semibold text-slate-900">
                            ৳{(item.price * item.quantity).toLocaleString('en-US')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment & Total Amount */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">পেমেন্ট মেথড: </span>
                      <strong className="uppercase text-slate-800">{order.payment_method}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">মোট বিল: </span>
                      <span className="text-base font-black text-emerald-700">
                        ৳{Number(order.total_payable).toLocaleString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= DATABASE / SUPABASE SETTINGS TAB ================= */}
        {activeTab === 'database' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Supabase ডাটাবেস ইন্টিগ্রেশন</h3>
                  <p className="text-xs text-slate-500">আপনার ক্লায়েন্টের জন্য বিনামূল্যে রিয়েল-টাইম ক্লাউড ডাটাবেস</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <p className="font-bold text-slate-900">কিভাবে ২ মিনিটে Supabase কানেক্ট করবেন:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                  <li><a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-600 font-bold hover:underline">supabase.com</a>-এ একটি ফ্রি একাউন্ট তৈরি করে নতুন প্রোজেক্ট খুলুন।</li>
                  <li>বাম পাশের মেনু থেকে <strong>SQL Editor</strong>-এ যান।</li>
                  <li>নিচের বাটনে ক্লিক করে তৈরি করা SQL স্ক্রিপ্টটি কপি করে সেখানে পেস্ট করুন এবং <strong>Run</strong> চাপুন।</li>
                  <li>প্রোজেক্টের <strong>Project Settings → API</strong> থেকে URL এবং anon key কপি করে প্রজেক্টের <code className="bg-white px-1.5 py-0.5 rounded border font-mono">.env.local</code> ফাইলে বসিয়ে দিন।</li>
                </ol>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`-- SmartGhor Database Tables
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
  warranty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
  status TEXT DEFAULT 'pending',
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public All Products" ON public.products FOR ALL USING (true);
CREATE POLICY "Public Orders" ON public.orders FOR ALL USING (true);
`);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 3000);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'SQL স্ক্রিপ্ট কপি হয়েছে!' : 'Supabase SQL স্ক্রিপ্ট কপি করুন'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= ADD PRODUCT MODAL ================= */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setIsAddingProduct(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">নতুন ইউনিক প্রোডাক্ট যোগ করুন</h3>
                <p className="text-xs text-slate-500">কোনো কোডিং ছাড়া তথ্য লিখে সরাসরি ওয়েবসাইটে প্রদর্শন করুন</p>
              </div>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    প্রোডাক্টের নাম (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: Smart WiFi Ambient Light"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বাংলা নাম / শিরোনাম
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: স্মার্ট ওয়াইফাই অ্যাম্বিয়েন্ট লাইট"
                    value={newProduct.banglaName}
                    onChange={(e) => setNewProduct({ ...newProduct, banglaName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.banglaName} ({cat.name})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">স্টক পরিমাণ *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProduct.stockCount}
                    onChange={(e) => setNewProduct({ ...newProduct, stockCount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বিক্রয় মূল্য (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    আগের মূল মূল্য (৳) (ছাড় দেখানোর জন্য)
                  </label>
                  <input
                    type="number"
                    placeholder="3200"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ছবির লিংক (Image URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    সংক্ষিপ্ত বিবরণ (Short Description)
                  </label>
                  <input
                    type="text"
                    placeholder="এক লাইনে প্রোডাক্টের মূল আকর্ষণ লিখুন..."
                    value={newProduct.shortDescription}
                    onChange={(e) => setNewProduct({ ...newProduct, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বিস্তারিত বিবরণ (Full Description)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="পণ্যটির বিস্তারিত তথ্য ও সুবিধা..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ওয়ারেন্টি পলিসি
                  </label>
                  <input
                    type="text"
                    value={newProduct.warranty}
                    onChange={(e) => setNewProduct({ ...newProduct, warranty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মূল বৈশিষ্ট্য ১</label>
                  <input
                    type="text"
                    placeholder="যেমন: ওয়াইফাই অ্যাপ কন্ট্রোল"
                    value={newProduct.feature1}
                    onChange={(e) => setNewProduct({ ...newProduct, feature1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">মূল বৈশিষ্ট্য ২</label>
                  <input
                    type="text"
                    placeholder="যেমন: টাইপ-সি ফাস্ট চার্জিং"
                    value={newProduct.feature2}
                    onChange={(e) => setNewProduct({ ...newProduct, feature2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  প্রোডাক্ট পাবলিশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
