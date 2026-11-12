import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// ── Status badge config ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:    { icon: Clock,        color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', label: 'Pending' },
  processing: { icon: RefreshCw,    color: 'text-blue-400',   bg: 'bg-blue-400/10 border-blue-400/30',   label: 'Processing' },
  completed:  { icon: CheckCircle,  color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/30', label: 'Completed' },
  cancelled:  { icon: XCircle,      color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/30',     label: 'Cancelled' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
};

// ── Single order card ────────────────────────────────────────────────────────
const OrderCard = ({ order, expanded, onToggle }) => {
  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  const time = new Date(order.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="bg-[#2A1A10] border border-[#5D4030] rounded-2xl overflow-hidden hover:border-[#C19976]/50 transition-colors">
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full text-left p-4 flex flex-wrap items-center gap-3"
        aria-expanded={expanded}
      >
        <Package size={18} className="text-[#C19976] shrink-0" />

        <div className="flex-1 min-w-0">
          <span className="font-mono text-xs text-gray-400">
            #{(order.id || order._id)?.slice(-8).toUpperCase()}
          </span>
          <p className="font-semibold text-white truncate">{order.customerName}</p>
        </div>

        <div className="text-right shrink-0">
          <p className="font-bold text-[#C19976]">{Number(order.total).toFixed(2)} birr</p>
          <p className="text-xs text-gray-500">{date} · {time}</p>
        </div>

        <StatusBadge status={order.status} />

        <span className={`text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#5D4030] pt-3 space-y-3">
          {/* Items table */}
          <div>
            <p className="text-xs text-[#C19976] font-semibold mb-2">Items</p>
            <div className="space-y-1.5">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex justify-between text-sm text-gray-300">
                  <span className="truncate mr-2">{item.name} ×{item.quantity}</span>
                  <span className="shrink-0 text-gray-400">
                    {(Number(item.price) * item.quantity).toFixed(2)} birr
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#5D4030] mt-2 pt-2 flex justify-between text-sm font-semibold text-[#C19976]">
              <span>Total</span>
              <span>{Number(order.total).toFixed(2)} birr</span>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
            <div>
              <span className="text-gray-500">Payment</span>
              <p className="text-gray-300">{order.paymentMethod}</p>
            </div>
            {order.phone && (
              <div>
                <span className="text-gray-500">Phone</span>
                <p className="text-gray-300">{order.phone}</p>
              </div>
            )}
            {order.shippingAddress && (
              <div className="col-span-2">
                <span className="text-gray-500">Delivery address</span>
                <p className="text-gray-300">{order.shippingAddress}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main page ────────────────────────────────────────────────────────────────
const OrderHistory = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [expanded, setExpanded] = useState(null);
  const [filter,   setFilter]   = useState('all');

  useEffect(() => {
    if (!user) {
      navigate('/?login=true');
      return;
    }
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await api.get(`/api/orders/customer/${user.id || user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  const statuses = ['all', 'pending', 'processing', 'completed', 'cancelled'];

  return (
    <div className="min-h-screen bg-[#1a0f0a] text-white py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm transition"
        >
          <ArrowLeft size={16} /> Back to shop
        </button>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#C19976]">My Orders</h1>
          <p className="text-gray-400 text-sm mt-1">Track and review your past orders</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition capitalize ${
                filter === s
                  ? 'bg-[#C19976] text-black'
                  : 'bg-[#2A1A10] border border-[#5D4030] text-gray-400 hover:border-[#C19976]'
              }`}
            >
              {s === 'all' ? 'All' : s}
              {s !== 'all' && (
                <span className="ml-1.5 opacity-70">
                  ({orders.filter(o => o.status === s).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-[#C19976] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading your orders...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center text-red-400">
            <p className="text-lg mb-1">⚠️ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm underline mt-2"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <Package size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {filter === 'all' ? "You haven't placed any orders yet." : `No ${filter} orders.`}
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-[#C19976] text-black px-6 py-2.5 rounded-xl font-semibold hover:bg-[#b38966] transition"
            >
              Shop Now ☕
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map(order => (
              <OrderCard
                key={order.id || order._id}
                order={order}
                expanded={expanded === (order.id || order._id)}
                onToggle={() =>
                  setExpanded(prev =>
                    prev === (order.id || order._id) ? null : (order.id || order._id)
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
