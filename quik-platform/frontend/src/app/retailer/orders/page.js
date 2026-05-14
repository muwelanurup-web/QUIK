'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OrderCard from '../../../components/OrderCard';
import { getRetailerOrders, updateOrderStatus } from '../../../services/orderService';
import { ShoppingBag, CheckCircle } from 'lucide-react';

const STATUSES = ['ALL','PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED'];

const STATUS_PILLS = {
  ALL:       { label: 'All Orders',  cls: 'bg-white/10 text-white/70 border-white/15',       active: 'bg-white/20 text-white border-white/30' },
  PENDING:   { label: 'Pending',     cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20', active: 'bg-amber-500 text-white border-amber-500' },
  CONFIRMED: { label: 'Confirmed',   cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20',   active: 'bg-blue-500 text-white border-blue-500' },
  SHIPPED:   { label: 'Shipped',     cls: 'bg-purple-500/10 text-purple-400 border-purple-500/20', active: 'bg-purple-500 text-white border-purple-500' },
  DELIVERED: { label: 'Delivered',   cls: 'bg-green-500/10 text-green-400 border-green-500/20',  active: 'bg-green-500 text-white border-green-500' },
  CANCELLED: { label: 'Cancelled',   cls: 'bg-red-500/10 text-red-400 border-red-500/20',        active: 'bg-red-500 text-white border-red-500' },
};

export default function RetailerOrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('ALL');
  const [msg, setMsg]         = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('quik_token') : null;
    if (!token) { router.push('/auth/login'); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try { const res = await getRetailerOrders(); setOrders(res.data.data); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      setMsg('Status updated!'); setTimeout(() => setMsg(''), 2000);
    } catch { setMsg('Failed to update'); setTimeout(() => setMsg(''), 2000); }
  };

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-4">
      {[...Array(4)].map((_, i) => <div key={i} className="h-48 rounded-2xl shimmer" />)}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Toast */}
      {msg && (
        <div className="fixed top-20 right-4 z-50 bg-primary-500 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 animate-slideInRight">
          <CheckCircle size={15} /> {msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-slideUp">
        <div>
          <h1 className="text-4xl font-black text-white font-display flex items-center gap-3">
            <ShoppingBag size={32} className="text-primary-400" /> Orders
          </h1>
          <p className="text-white/40 mt-1 text-sm">
            {orders.length} total · {orders.filter((o) => o.status === 'PENDING').length} pending
          </p>
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {STATUSES.map((s) => {
          const cfg = STATUS_PILLS[s];
          const count = s === 'ALL' ? orders.length : orders.filter((o) => o.status === s).length;
          const isActive = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border transition-all duration-200
                ${isActive ? cfg.active : `${cfg.cls} hover:opacity-80`} `}
            >
              {cfg.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-white/25 animate-fadeIn">
          <div className="text-6xl mb-5">📋</div>
          <p className="text-xl font-black font-display mb-2">
            No {filter !== 'ALL' ? STATUS_PILLS[filter].label.toLowerCase() : ''} orders yet
          </p>
          <p className="text-sm text-white/20">Orders will appear here once customers place them</p>
        </div>
      ) : (
        <div className="space-y-4 stagger-children">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} isRetailer onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}
