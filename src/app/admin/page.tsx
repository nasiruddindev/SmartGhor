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
  Phone,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Lock,
  Unlock,
  Printer,
  Download,
  Tag,
  Star,
  ExternalLink,
  SlidersHorizontal,
  X,
  MessageSquare,
  BadgePercent,
} from 'lucide-react';
import { Product } from '@/types';
import { CATEGORIES, AVAILABLE_COUPONS } from '@/data/products';

export default function AdminPage() {
  // Authentication & Security Gate
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'database'>('overview');

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<{ [code: string]: number }>(AVAILABLE_COUPONS);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<any | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Form State for Adding Product
  const [productForm, setProductForm] = useState({
    name: '',
    banglaName: '',
    category: 'smart-home',
    price: '',
    originalPrice: '',
    stockCount: '15',
    imageUrl: '',
    shortDescription: '',
    description: '',
    warranty: '১ বছরের অফিসিয়াল রিপ্লেসমেন্ট ওয়ারেন্টি',
    isFeatured: false,
    isTrending: false,
    isFlashSale: false,
    feature1: '',
    feature2: '',
    feature3: '',
  });

  // Check stored auth session
  useEffect(() => {
    const session = localStorage.getItem('smartghor_admin_session');
    if (session === 'authenticated_valid') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: admin123
    if (pinInput.trim() === 'admin123' || pinInput.trim() === 'admin' || pinInput.trim() === 'smartghor') {
      setIsAuthenticated(true);
      localStorage.setItem('smartghor_admin_session', 'authenticated_valid');
      setPinError('');
    } else {
      setPinError('ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড লিখুন (ডিফল্ট: admin123)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('smartghor_admin_session');
  };

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
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Handle Add Product submit
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    try {
      const features = [productForm.feature1, productForm.feature2, productForm.feature3].filter(Boolean);
      const categoryObj = CATEGORIES.find((c) => c.slug === productForm.category);

      const payload = {
        name: productForm.name,
        banglaName: productForm.banglaName,
        category: productForm.category,
        categoryLabel: categoryObj?.name || 'Smart Gadgets',
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice || productForm.price),
        stockCount: Number(productForm.stockCount || 10),
        images: productForm.imageUrl
          ? [productForm.imageUrl]
          : ['https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'],
        shortDescription: productForm.shortDescription || productForm.name,
        description: productForm.description || productForm.shortDescription || productForm.name,
        warranty: productForm.warranty,
        isFeatured: productForm.isFeatured,
        isTrending: productForm.isTrending,
        isFlashSale: productForm.isFlashSale,
        features: features.length > 0 ? features : ['প্রিমিয়াম কোয়ালিটি পণ্য', 'সহজ ব্যবহারযোগ্য'],
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
        setProductForm({
          name: '',
          banglaName: '',
          category: 'smart-home',
          price: '',
          originalPrice: '',
          stockCount: '15',
          imageUrl: '',
          shortDescription: '',
          description: '',
          warranty: '১ বছরের অফিসিয়াল রিপ্লেসমেন্ট ওয়ারেন্টি',
          isFeatured: false,
          isTrending: false,
          isFlashSale: false,
          feature1: '',
          feature2: '',
          feature3: '',
        });
      }
    } catch (err) {
      console.error('Failed to create product:', err);
    }
  };

  // Open Edit Product Modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
  };

  // Handle Edit Product submit
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      const result = await res.json();
      if (result.success) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
        setEditingProduct(null);
      }
    } catch (err) {
      console.error('Failed to update product:', err);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে "${name}" প্রোডাক্টটি চিরতরে ডিলিট করতে চান?`)) return;

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

  // Export orders to CSV
  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order ID', 'Customer Name', 'Phone', 'Delivery Zone', 'Address', 'Payment', 'Total (BDT)', 'Status', 'Date'];
    const rows = orders.map((o) => [
      o.id,
      `"${o.customer_name}"`,
      `"${o.phone}"`,
      `"${o.delivery_zone}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      o.payment_method,
      o.total_payable,
      o.status,
      new Date(o.created_at).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartghor_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations for dashboard
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_payable) || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const confirmedOrders = orders.filter((o) => o.status === 'confirmed').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 12).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.banglaName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesQuery =
      !orderSearchQuery.trim() ||
      o.id?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.phone?.includes(orderSearchQuery);
    return matchesStatus && matchesQuery;
  });

  // ================= SECURITY LOCK SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Smart<span className="text-emerald-600">Ghor</span> অ্যাডমিন পোর্টাল
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              অনুমোদিত অ্যাক্সেসের জন্য অ্যাডমিন সিকিউরিটি পাসওয়ার্ড লিখুন
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                অ্যাডমিন পাসওয়ার্ড / পিন
              </label>
              <input
                type="password"
                required
                placeholder="ডিফল্ট পাসওয়ার্ড: admin123"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-emerald-500 font-mono"
              />
              {pinError && <p className="text-xs text-rose-500 mt-1 font-semibold">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition active:scale-95"
            >
              ড্যাশবোর্ডে প্রবেশ করুন
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100">
            <Link href="/" className="text-xs text-slate-400 hover:text-emerald-600 font-medium inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>মূল ওয়েবসাইটে ফিরে যান</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= MAIN ADMIN DASHBOARD =================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Admin Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition"
              title="নতুন ট্যাবে স্টোর দেখুন"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">স্টোর দেখুন</span>
            </Link>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-xs">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 leading-tight">
                  Smart<span className="text-emerald-600">Ghor</span> অ্যাডমিন
                </h1>
                <span className="text-[10px] text-slate-400 block -mt-0.5">ম্যানেজমেন্ট কনসোল</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchData}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="ডাটা রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => {
                setActiveTab('products');
                setIsAddingProduct(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন প্রোডাক্ট</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition text-xs font-bold"
              title="লগআউট"
            >
              লগআউট
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto text-xs font-bold scrollbar-none">
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
            <span>প্রোডাক্ট ক্যাটালগ</span>
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
            onClick={() => setActiveTab('coupons')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'coupons'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BadgePercent className="w-3.5 h-3.5 text-amber-600" />
            <span>ডিসকাউন্ট ও কুপন</span>
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
            <span>Supabase ক্লাউড ডাটাবেস</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-semibold">মোট সেলস রেভিনিউ</span>
                  <p className="text-2xl font-black text-slate-900">৳{totalRevenue.toLocaleString('en-US')}</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
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
                  <span className="text-xs text-slate-500 font-semibold">লাইভ প্রোডাক্ট ক্যাটালগ</span>
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

            {/* Quick Actions & Recent Orders */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-base font-black text-slate-900">সর্বশেষ কাস্টমার অর্ডারসমূহ</h3>
                  <p className="text-xs text-slate-500">রিয়েল-টাইম অর্ডার স্ট্যাটাস ও তথ্য</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV এক্সপোর্ট</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 ml-2"
                  >
                    সব অর্ডার দেখুন →
                  </button>
                </div>
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
                      <th className="pb-3 text-right">ইনভয়েস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-mono font-bold text-slate-800">#{order.id}</td>
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
                        <td className="py-3 text-right">
                          <button
                            onClick={() => setInvoiceOrder(order)}
                            className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                            title="ইনভয়েস প্রিন্ট করুন"
                          >
                            <Printer className="w-3.5 h-3.5" />
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

        {/* ================= PRODUCTS TAB ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto flex-1">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="প্রোডাক্ট খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none cursor-pointer"
                >
                  <option value="all">সকল ক্যাটাগরি</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.banglaName}
                    </option>
                  ))}
                </select>
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
                      <th className="py-3 px-4">নাম ও বিবরণ</th>
                      <th className="py-3 px-4">ক্যাটাগরি</th>
                      <th className="py-3 px-4">মূল্য (বিক্রয়/আসল)</th>
                      <th className="py-3 px-4">স্টক</th>
                      <th className="py-3 px-4">ব্যাজ</th>
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
                        <td className="py-3 px-4 max-w-xs">
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
                            {p.stockCount} টি
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {p.isFlashSale && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 text-[9px] font-bold">
                                ফ্ল্যাশ সেল
                              </span>
                            )}
                            {p.isFeatured && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 text-[9px] font-bold">
                                ফিচার্ড
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => openEditModal(p)}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                              title="এডিট করুন"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="অর্ডার আইডি বা ফোন খুঁজুন..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
                  {[
                    { id: 'all', label: 'সকল' },
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
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleExportCSV}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>সব অর্ডার CSV ডাউনলোড</span>
              </button>
            </div>

            {/* Orders Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4 relative"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <span className="font-mono font-black text-slate-900 text-sm">#{order.id}</span>
                      <span className="text-[11px] text-slate-400 block">
                        {new Date(order.created_at).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
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

                      <button
                        onClick={() => setInvoiceOrder(order)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                        title="ইনভয়েস / রশিদ প্রিন্ট"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
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
                        href={`https://wa.me/88${order.phone.replace(/^0/, '')}?text=আসসালামু%20আলাইকুম,%20SmartGhor%20থেকে%20আপনার%20অর্ডার%20#${order.id}%20এর%20ব্যাপারে%20যোগাযোগ%20করছি।`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold hover:bg-emerald-100 transition"
                      >
                        হোয়াটসঅ্যাপ বার্তা
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

                  {/* Ordered Items */}
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

                  {/* Pricing Breakdown */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">পেমেন্ট: </span>
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

        {/* ================= COUPONS TAB ================= */}
        {activeTab === 'coupons' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">ডিসকাউন্ট কুপন ও প্রোমোকোড</h3>
                    <p className="text-xs text-slate-500">স্টোরে গ্রাহকদের জন্য সক্রিয় কুপনসমূহ</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(coupons).map(([code, value]) => (
                  <div
                    key={code}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-900 text-sm bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {code}
                      </span>
                      <span className="text-xs text-emerald-700 font-bold ml-3">
                        {code === 'SAVE200' ? '৳২০০ ফ্ল্যাট ছাড়' : `${value}% ইনস্ট্যান্ট ছাড়`}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">সক্রিয় (Active)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= DATABASE / SUPABASE TAB ================= */}
        {activeTab === 'database' && (
          <div className="max-w-3xl space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Supabase ক্লাউড ডাটাবেস গাইড</h3>
                  <p className="text-xs text-slate-500">আপনার নিজস্ব Supabase ডাটাবেস সহজে কানেক্ট করুন</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <p className="font-bold text-slate-900">কিভাবে ২ মিনিটে কানেক্ট করবেন:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                  <li><a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-600 font-bold hover:underline">supabase.com</a>-এ গিয়ে ফ্রি প্রজেক্ট তৈরি করুন।</li>
                  <li>বাম মেনু থেকে <strong>SQL Editor</strong>-এ যান।</li>
                  <li>নিচের বাটনে ক্লিক করে তৈরি করা SQL স্ক্রিপ্ট কপি করে সেখানে পেস্ট করে <strong>Run</strong> চাপুন।</li>
                  <li>আপনার <code className="bg-white px-1.5 py-0.5 rounded border font-mono">.env.local</code> ফাইলে URL এবং anon key বসিয়ে দিন।</li>
                </ol>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`-- SmartGhor Database Schema
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
        )}
      </main>

      {/* ================= ADD PRODUCT MODAL ================= */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div onClick={() => setIsAddingProduct(false)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">নতুন ইউনিক প্রোডাক্ট যোগ করুন</h3>
                <p className="text-xs text-slate-500">কোনো কোডিং ছাড়া তথ্য লিখে সরাসরি ওয়েবসাইটে প্রদর্শন করুন</p>
              </div>
              <button onClick={() => setIsAddingProduct(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">✕</button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">প্রোডাক্টের নাম (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Smart WiFi Lamp"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বাংলা নাম</label>
                  <input
                    type="text"
                    placeholder="স্মার্ট ওয়াইফাই ল্যাম্প"
                    value={productForm.banglaName}
                    onChange={(e) => setProductForm({ ...productForm, banglaName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
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
                    value={productForm.stockCount}
                    onChange={(e) => setProductForm({ ...productForm, stockCount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিক্রয় মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">আগের মূল্য (৳) (ছাড় দেখানোর জন্য)</label>
                  <input
                    type="number"
                    placeholder="3200"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">ছবির লিংক (Image URL)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">সংক্ষিপ্ত বিবরণ</label>
                  <input
                    type="text"
                    placeholder="এক লাইনে প্রোডাক্টের আকর্ষণ লিখুন..."
                    value={productForm.shortDescription}
                    onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">ওয়ারেন্টি পলিসি</label>
                  <input
                    type="text"
                    value={productForm.warranty}
                    onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Badges Toggles */}
                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={productForm.isFlashSale}
                      onChange={(e) => setProductForm({ ...productForm, isFlashSale: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>🔥 ফ্ল্যাশ সেল ডিল</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>⭐ ফিচার্ড প্রোডাক্ট</span>
                  </label>
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
                  পাবলিশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT PRODUCT MODAL ================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div onClick={() => setEditingProduct(null)} className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">প্রোডাক্ট এডিট করুন</h3>
                <p className="text-xs text-slate-500">মূল্য, স্টক বা বিবরণ পরিবর্তন করুন</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-2 text-slate-400 hover:text-slate-700 rounded-full">✕</button>
            </div>

            <form onSubmit={handleUpdateProduct} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">প্রোডাক্টের নাম *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বাংলা নাম</label>
                  <input
                    type="text"
                    value={editingProduct.banglaName || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, banglaName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">বিক্রয় মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">আগের মূল্য (৳)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">স্টক পরিমাণ *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stockCount}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.banglaName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">সংক্ষিপ্ত বিবরণ</label>
                  <textarea
                    rows={2}
                    value={editingProduct.shortDescription || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Badges Toggles */}
                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.isFlashSale)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFlashSale: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>🔥 ফ্ল্যাশ সেল</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.isFeatured)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>⭐ ফিচার্ড</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  আপডেট সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= INVOICE PRINT MODAL ================= */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div onClick={() => setInvoiceOrder(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 z-10 animate-in zoom-in-95 duration-200 text-slate-900">
            {/* Invoice Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-black">
                  Smart<span className="text-emerald-600">Ghor</span> ইনভয়েস
                </h2>
                <p className="text-[11px] text-slate-500">মেমো নং: #{invoiceOrder.id}</p>
              </div>
              <button
                onClick={() => setInvoiceOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            {/* Invoice Body */}
            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">গ্রাহকের নাম:</span>
                  <strong className="text-slate-900">{invoiceOrder.customer_name}</strong>
                  <span className="text-slate-600 block">{invoiceOrder.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ডেলিভারি ঠিকানা:</span>
                  <span className="text-slate-700 leading-tight block">{invoiceOrder.address}</span>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                    {invoiceOrder.delivery_zone === 'inside-dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="border border-slate-200 rounded-2xl p-3">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="pb-2">পণ্য</th>
                      <th className="pb-2 text-center">পরিমাণ</th>
                      <th className="pb-2 text-right">মূল্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoiceOrder.items?.map((item: any, i: number) => (
                      <tr key={i}>
                        <td className="py-2 text-slate-800">{item.name}</td>
                        <td className="py-2 text-center font-bold text-slate-900">{item.quantity}</td>
                        <td className="py-2 text-right font-bold text-slate-900">
                          ৳{(item.price * item.quantity).toLocaleString('en-US')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation */}
              <div className="space-y-1 text-xs pt-1">
                <div className="flex justify-between text-slate-600">
                  <span>সাবটোটাল:</span>
                  <span>৳{Number(invoiceOrder.subtotal).toLocaleString('en-US')}</span>
                </div>
                {Number(invoiceOrder.discount) > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>কুপন ডিসকাউন্ট:</span>
                    <span>- ৳{Number(invoiceOrder.discount).toLocaleString('en-US')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>৳{Number(invoiceOrder.delivery_charge).toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200">
                  <span>সর্বমোট বিল:</span>
                  <span className="text-emerald-700 text-base">
                    ৳{Number(invoiceOrder.total_payable).toLocaleString('en-US')}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 text-center font-bold text-[11px]">
                পেমেন্ট পদ্ধতি: {invoiceOrder.payment_method.toUpperCase()}
              </div>
            </div>

            {/* Print Action */}
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট বা PDF সেভ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
