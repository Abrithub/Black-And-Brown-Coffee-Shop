import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import QRCodeDisplay from '../QRCode';

// ── Chart ──────────────────────────────────────────────────────────────────
const SimpleChart = ({ data, title, type = 'bar' }) => {
    if (!data || data.length === 0) return null;
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const chartHeight = 160;
    return (
        <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-5 rounded-2xl border border-[#5D4030]">
            <h3 className="text-lg font-bold text-[#C19976] mb-4">{title}</h3>
            <div style={{ height: chartHeight }}>
                {type === 'line' ? (
                    <svg width="100%" height={chartHeight}>
                        <defs>
                            <linearGradient id={`g-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#C19976" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#C19976" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {[0, 25, 50, 75, 100].map(p => (
                            <line key={p} x1="0" y1={`${p}%`} x2="100%" y2={`${p}%`} stroke="#5D4030" strokeWidth="1" opacity="0.4" />
                        ))}
                        <path
                            d={`M 0,${chartHeight} ${data.map((d, i) => `L ${(i / (data.length - 1)) * 100}%,${chartHeight - (d.value / maxValue) * chartHeight}`).join(' ')} L 100%,${chartHeight} Z`}
                            fill={`url(#g-${title})`}
                        />
                        <polyline
                            points={data.map((d, i) => `${(i / (data.length - 1)) * 100}%,${chartHeight - (d.value / maxValue) * chartHeight}`).join(' ')}
                            fill="none" stroke="#C19976" strokeWidth="2.5" strokeLinecap="round"
                        />
                        {data.map((d, i) => (
                            <circle key={i} cx={`${(i / (data.length - 1)) * 100}%`} cy={chartHeight - (d.value / maxValue) * chartHeight} r="4" fill="#C19976" stroke="#1a0f0a" strokeWidth="2" />
                        ))}
                    </svg>
                ) : (
                    <div className="flex items-end justify-between h-full gap-1">
                        {data.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                                <div className="w-full bg-gradient-to-t from-[#C19976] to-amber-500 rounded-t" style={{ height: `${(d.value / maxValue) * 100}%` }} />
                                <span className="text-xs text-gray-400 mt-1 truncate w-full text-center">{d.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Product Form ───────────────────────────────────────────────────────────
const CATEGORIES = ['Coffee Beans', 'Brewing Equipment', 'Accessories', 'Additives', 'Coffee Capsules', 'Subscription', 'Decor', 'Beverage'];
const ROAST_LEVELS = ['', 'Light', 'Medium', 'Dark'];
const EMPTY_PRODUCT = { name: '', price: '', category: 'Beverage', description: '', origin: '', image: '', stock: '', rating: '', featured: false, roastLevel: '', weight: '' };

const ProductForm = ({ initial, onSave, onCancel }) => {
    const [form, setForm] = useState(initial || EMPTY_PRODUCT);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState('');

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr('');
        if (!form.name || !form.price) { setErr('Name and price are required'); return; }
        setSaving(true);
        try {
            await onSave({ ...form, price: Number(form.price), stock: Number(form.stock) || 0, rating: Number(form.rating) || 0 });
        } catch (e) {
            setErr(e.response?.data?.message || 'Save failed');
        } finally { setSaving(false); }
    };

    const inp = "w-full p-2.5 bg-[#1a0f0a] border border-[#5D4030] rounded-lg text-white text-sm focus:ring-1 focus:ring-[#C19976] outline-none";

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {err && <p className="text-red-400 text-sm bg-red-900/20 p-2 rounded">{err}</p>}
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Product Name *</label>
                    <input className={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Ethiopian Yirgacheffe" required />
                </div>
                <div>
                    <label className="text-gray-400 text-xs mb-1 block">Price (birr) *</label>
                    <input className={inp} type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="450" required />
                </div>
                <div>
                    <label className="text-gray-400 text-xs mb-1 block">Stock</label>
                    <input className={inp} type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="25" />
                </div>
                <div>
                    <label className="text-gray-400 text-xs mb-1 block">Category</label>
                    <select className={inp} value={form.category} onChange={e => set('category', e.target.value)}>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-gray-400 text-xs mb-1 block">Roast Level</label>
                    <select className={inp} value={form.roastLevel} onChange={e => set('roastLevel', e.target.value)}>
                        {ROAST_LEVELS.map(r => <option key={r} value={r}>{r || 'N/A'}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-gray-400 text-xs mb-1 block">Origin</label>
                    <input className={inp} value={form.origin} onChange={e => set('origin', e.target.value)} placeholder="Ethiopia" />
                </div>
                <div>
                    <label className="text-gray-400 text-xs mb-1 block">Weight</label>
                    <input className={inp} value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="500g" />
                </div>
                <div>
                    <label className="text-gray-400 text-xs mb-1 block">Rating (0–5)</label>
                    <input className={inp} type="number" min="0" max="5" step="0.1" value={form.rating} onChange={e => set('rating', e.target.value)} placeholder="4.5" />
                </div>
                <div className="flex items-center gap-2 pt-4">
                    <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="accent-[#C19976]" />
                    <label htmlFor="featured" className="text-gray-300 text-sm">Featured product</label>
                </div>
                <div className="col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Image URL</label>
                    <input className={inp} value={form.image} onChange={e => set('image', e.target.value)} placeholder="img/pack.jpg or https://..." />
                </div>
                <div className="col-span-2">
                    <label className="text-gray-400 text-xs mb-1 block">Description</label>
                    <textarea className={inp + ' resize-none'} rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Product description..." />
                </div>
            </div>
            <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-[#C19976] text-black font-bold py-2.5 rounded-lg hover:bg-amber-600 transition disabled:opacity-60">
                    {saving ? 'Saving...' : (initial?._id ? 'Update Product' : 'Add Product')}
                </button>
                <button type="button" onClick={onCancel} className="flex-1 border border-[#5D4030] text-gray-300 py-2.5 rounded-lg hover:border-[#C19976] transition">
                    Cancel
                </button>
            </div>
        </form>
    );
};

// ── Main Dashboard ─────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const { logout, admin } = useAuth();
    const [tab, setTab] = useState('orders');
    const [showQR, setShowQR] = useState(false);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, todaySales: 0, todayOrders: 0, statusCounts: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [orderFilter, setOrderFilter] = useState('all');

    const fetchAll = useCallback(async () => {
        if (!admin) return;
        try {
            setLoading(true);
            setError('');
            const [ordersRes, statsRes, productsRes] = await Promise.all([
                api.get('/api/orders'),
                api.get('/api/orders/stats/summary'),
                api.get('/api/coffees'),
            ]);
            if (ordersRes.data.success) setOrders(ordersRes.data.orders || []);
            if (statsRes.data.success) setStats(statsRes.data.stats);
            const coffees = productsRes.data?.coffees || productsRes.data || [];
            setProducts(Array.isArray(coffees) ? coffees : []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load data');
        } finally { setLoading(false); }
    }, [admin]);

    useEffect(() => { fetchAll(); const t = setInterval(fetchAll, 30000); return () => clearInterval(t); }, [fetchAll]);

    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/api/orders/${orderId}/status`, { status });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
        } catch (err) { setError('Failed to update order status'); }
    };

    const deleteOrder = async (orderId) => {
        if (!window.confirm('Delete this order?')) return;
        try {
            await api.delete(`/api/orders/${orderId}`);
            setOrders(prev => prev.filter(o => o._id !== orderId));
        } catch (err) { setError('Failed to delete order'); }
    };

    const saveProduct = async (data) => {
        if (editingProduct?._id) {
            const res = await api.put(`/api/coffees/${editingProduct._id}`, data);
            setProducts(prev => prev.map(p => p._id === editingProduct._id ? res.data.coffee : p));
        } else {
            const res = await api.post('/api/coffees', data);
            setProducts(prev => [res.data.coffee, ...prev]);
        }
        setShowProductForm(false);
        setEditingProduct(null);
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/api/coffees/${id}`);
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) { setError('Failed to delete product'); }
    };

    // Build chart data from real orders
    const buildWeeklyChart = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const counts = Array(7).fill(0);
        const now = new Date();
        orders.forEach(o => {
            const d = new Date(o.createdAt);
            if ((now - d) / 86400000 <= 7) counts[d.getDay()]++;
        });
        return days.map((label, i) => ({ label, value: counts[i] }));
    };

    const buildMonthlyChart = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const totals = Array(12).fill(0);
        orders.forEach(o => { totals[new Date(o.createdAt).getMonth()] += o.total || 0; });
        return months.map((label, i) => ({ label, value: totals[i] }));
    };

    const filteredOrders = orderFilter === 'all' ? orders : orders.filter(o => o.status === orderFilter);

    const statusColor = { completed: 'bg-green-600', pending: 'bg-yellow-600', processing: 'bg-blue-600', cancelled: 'bg-red-600' };

    if (!admin) return (
        <div className="min-h-screen bg-[#1a0f0a] flex items-center justify-center">
            <p className="text-red-400 text-xl">Please log in as admin</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a0f0a] to-[#2A1A10] p-4">
            <div className="max-w-7xl mx-auto">
                {showQR && <QRCodeDisplay onClose={() => setShowQR(false)} />}

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-[#C19976]">Admin Dashboard</h1>
                        <p className="text-gray-400 text-sm">Welcome back, {admin.name || 'Admin'}</p>
                    </div>
                    <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition">
                        Logout
                    </button>
                    <button onClick={() => setShowQR(true)} className="bg-[#C19976] hover:bg-[#b38966] text-black px-5 py-2 rounded-lg font-semibold transition flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4H4v8h8V4zM20 4h-8v8h8V4zM4 20h8v-8H4v8z"/>
                        </svg>
                        QR Code
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-600/20 border border-red-600/50 rounded-lg p-3">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total Sales', value: `${stats.totalSales?.toLocaleString()} birr`, icon: '💰' },
                        { label: 'Total Orders', value: stats.totalOrders, icon: '📦' },
                        { label: "Today's Sales", value: `${stats.todaySales?.toLocaleString()} birr`, icon: '📈' },
                        { label: "Today's Orders", value: stats.todayOrders, icon: '🛒' },
                    ].map(s => (
                        <div key={s.label} className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-5 rounded-2xl border border-[#5D4030] hover:border-[#C19976] transition">
                            <p className="text-gray-400 text-xs mb-1">{s.label}</p>
                            <p className="text-2xl font-bold text-[#C19976]">{s.value}</p>
                            <span className="text-2xl">{s.icon}</span>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-[#5D4030]">
                    {['orders', 'products', 'analytics'].map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-5 py-2.5 font-semibold capitalize transition rounded-t-lg ${tab === t ? 'bg-[#C19976] text-black' : 'text-gray-400 hover:text-[#C19976]'}`}>
                            {t}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-16"><p className="text-[#C19976] text-lg animate-pulse">Loading...</p></div>
                ) : (
                    <>
                        {/* ── ORDERS TAB ── */}
                        {tab === 'orders' && (
                            <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] rounded-2xl border border-[#5D4030] overflow-hidden">
                                <div className="p-5 border-b border-[#5D4030] flex flex-wrap gap-3 items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-[#C19976]">Orders</h2>
                                        <p className="text-gray-400 text-sm">{filteredOrders.length} orders</p>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {['all', 'pending', 'processing', 'completed', 'cancelled'].map(f => (
                                            <button key={f} onClick={() => setOrderFilter(f)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition ${orderFilter === f ? 'bg-[#C19976] text-black' : 'border border-[#5D4030] text-gray-400 hover:border-[#C19976]'}`}>
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-[#1a0f0a]">
                                            <tr>
                                                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                                                    <th key={h} className="text-left p-4 text-[#C19976] font-semibold whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredOrders.length === 0 && (
                                                <tr><td colSpan="8" className="p-8 text-center text-gray-400">No orders found</td></tr>
                                            )}
                                            {filteredOrders.map(order => (
                                                <tr key={order._id} className="border-t border-[#5D4030] hover:bg-[#1a0f0a]/50">
                                                    <td className="p-4 font-mono text-gray-300">#{order._id?.slice(-6)}</td>
                                                    <td className="p-4">
                                                        <p className="text-white font-medium">{order.customerName}</p>
                                                        <p className="text-gray-400 text-xs">{order.email}</p>
                                                        {order.phone && <p className="text-gray-500 text-xs">{order.phone}</p>}
                                                    </td>
                                                    <td className="p-4">
                                                        {order.items.map((item, i) => (
                                                            <p key={i} className="text-gray-300 text-xs">{item.quantity}× {item.name}</p>
                                                        ))}
                                                    </td>
                                                    <td className="p-4 text-[#C19976] font-bold whitespace-nowrap">{order.total} birr</td>
                                                    <td className="p-4 text-gray-300">{order.paymentMethod}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${statusColor[order.status] || 'bg-gray-600'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-400 text-xs whitespace-nowrap">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex gap-2 items-center">
                                                            <select
                                                                value={order.status}
                                                                onChange={e => updateOrderStatus(order._id, e.target.value)}
                                                                className="bg-[#1a0f0a] border border-[#5D4030] text-white rounded px-2 py-1 text-xs focus:ring-1 focus:ring-[#C19976] outline-none"
                                                            >
                                                                <option value="pending">Pending</option>
                                                                <option value="processing">Processing</option>
                                                                <option value="completed">Completed</option>
                                                                <option value="cancelled">Cancelled</option>
                                                            </select>
                                                            <button onClick={() => deleteOrder(order._id)} className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-800 rounded hover:bg-red-900/30 transition">
                                                                Del
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* ── PRODUCTS TAB ── */}
                        {tab === 'products' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-[#C19976]">Products ({products.length})</h2>
                                    <button
                                        onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                                        className="bg-[#C19976] text-black font-bold px-5 py-2 rounded-lg hover:bg-amber-600 transition"
                                    >
                                        + Add Product
                                    </button>
                                </div>

                                {showProductForm && (
                                    <div className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] rounded-2xl border border-[#C19976]/50 p-6 mb-6">
                                        <h3 className="text-lg font-bold text-[#C19976] mb-4">
                                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                                        </h3>
                                        <ProductForm
                                            initial={editingProduct}
                                            onSave={saveProduct}
                                            onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
                                        />
                                    </div>
                                )}

                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {products.map(p => (
                                        <div key={p._id} className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] rounded-xl border border-[#5D4030] hover:border-[#C19976] transition overflow-hidden">
                                            <div className="h-40 overflow-hidden bg-[#1a0f0a]">
                                                <img src={p.image || 'img/pack.jpg'} alt={p.name} className="w-full h-full object-cover" onError={e => { e.target.src = 'img/pack.jpg'; }} />
                                            </div>
                                            <div className="p-4">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-[#C19976] font-bold text-sm leading-tight">{p.name}</h3>
                                                    {p.featured && <span className="bg-[#C19976] text-black text-xs px-1.5 py-0.5 rounded-full ml-1 shrink-0">★</span>}
                                                </div>
                                                <p className="text-gray-400 text-xs mb-2">{p.category}</p>
                                                <div className="flex justify-between items-center text-sm mb-3">
                                                    <span className="text-[#C19976] font-bold">{p.price} birr</span>
                                                    <span className={`text-xs ${p.stock > 10 ? 'text-green-400' : p.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                        Stock: {p.stock}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { setEditingProduct(p); setShowProductForm(true); }}
                                                        className="flex-1 border border-[#C19976] text-[#C19976] py-1.5 rounded-lg text-xs font-semibold hover:bg-[#C19976] hover:text-black transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(p._id)}
                                                        className="flex-1 border border-red-600 text-red-400 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 hover:text-white transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── ANALYTICS TAB ── */}
                        {tab === 'analytics' && (
                            <div className="space-y-6">
                                <div className="grid sm:grid-cols-3 gap-4">
                                    {Object.entries(stats.statusCounts || {}).map(([status, count]) => (
                                        <div key={status} className="bg-gradient-to-br from-[#2A1A10] to-[#1a0f0a] p-5 rounded-2xl border border-[#5D4030]">
                                            <p className="text-gray-400 text-xs capitalize mb-1">{status} orders</p>
                                            <p className="text-3xl font-bold text-[#C19976]">{count}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid lg:grid-cols-2 gap-6">
                                    <SimpleChart data={buildWeeklyChart()} title="Orders This Week" type="bar" />
                                    <SimpleChart data={buildMonthlyChart()} title="Monthly Revenue (birr)" type="line" />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
