'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRetailerOrders } from '../../../services/orderService';
import { getRetailerProfile, saveRetailerProfile } from '../../../services/productService';
import { LayoutDashboard, Package, ShoppingBag, TrendingUp, DollarSign, ArrowRight, Edit3, X, CheckCircle } from 'lucide-react';

export default function RetailerDashboard() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ shopName: '', address: '', latitude: '', longitude: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('quik_token') : null;
    if (!token) { router.push('/auth/login'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, ordersRes] = await Promise.allSettled([getRetailerProfile(), getRetailerOrders()]);
      if (profileRes.status === 'fulfilled') {
        setProfile(profileRes.value.data.data);
        const p = profileRes.value.data.data;
        setForm({ shopName: p.shopName, address: p.address, latitude: p.latitude || '', longitude: p.longitude || '' });
      } else { setEditMode(true); }
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data.data);
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await saveRetailerProfile(form);
      setProfile(res.data.data); setEditMode(false);
      setMsg('Profile saved!'); setTimeout(() => setMsg(''), 2000);
    } catch (err) { setMsg(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const revenueDelivered = orders.filter((o) => o.status === 'DELIVERED').reduce((s, o) => s + o.totalAmount, 0);

  const stats = [
    {
      label: 'Total Orders', value: orders.length,
      icon: ShoppingBag, gradient: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/20',
      iconColor: 'text-blue-400', bgIcon: 'bg-blue-500/15',
    },
    {
      label: 'Pending', value: orders.filter((o) => o.status === 'PENDING').length,
      icon: TrendingUp, gradient: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/20',
      iconColor: 'text-amber-400', bgIcon: 'bg-amber-500/15',
    },
    {
      label: 'Delivered', value: orders.filter((o) => o.status === 'DELIVERED').length,
      icon: Package, gradient: 'from-green-500/20 to-green-600/5', border: 'border-green-500/20',
      iconColor: 'text-green-400', bgIcon: 'bg-green-500/15',
    },
    {
      label: 'Revenue', value: `₹${revenueDelivered.toFixed(0)}`,
      icon: DollarSign, gradient: 'from-primary-500/20 to-primary-600/5', border: 'border-primary-500/20',
      iconColor: 'text-primary-400', bgIcon: 'bg-primary-500/15',
    },
  ];

  const recentOrders = orders.slice(0, 4);
  const STATUS_STYLES = {
    PENDING: 'badge-pending', CONFIRMED: 'badge-confirmed',
    SHIPPED: 'badge-shipped', DELIVERED: 'badge-delivered', CANCELLED: 'badge-cancelled',
  };

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 rounded-2xl shimmer" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Toast */}
      {msg && (
        <div className="fixed top-20 right-4 z-50 bg-primary-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-2 animate-slideInRight">
          <CheckCircle size={15} /> {msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-slideUp">
        <div>
          <h1 className="text-4xl font-black text-white font-display flex items-center gap-3">
            <LayoutDashboard size={32} className="text-primary-400" /> Dashboard
          </h1>
          <p className="text-white/40 mt-1 flex items-center gap-1.5">
            <span className="text-lg">🏪</span>
            {profile?.shopName ? profile.shopName : 'Set up your shop profile'}
          </p>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className={editMode ? 'btn-secondary text-sm flex items-center gap-2' : 'btn-secondary text-sm flex items-center gap-2'}
        >
          {editMode ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit Profile</>}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 stagger-children">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`glass-card bg-gradient-to-br ${s.gradient} border ${s.border} text-center
                          hover:-translate-y-1 transition-all duration-300 hover:shadow-xl`}
            >
              <div className={`w-11 h-11 ${s.bgIcon} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Icon size={20} className={s.iconColor} />
              </div>
              <p className={`text-3xl font-black font-display ${s.iconColor}`}>{s.value}</p>
              <p className="text-xs text-white/40 mt-1.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Edit profile form */}
      {editMode && (
        <div className="glass-card mb-8 animate-slideUp">
          <h3 className="font-black text-white font-display text-lg mb-5 flex items-center gap-2">
            <Edit3 size={16} className="text-primary-400" /> Shop Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'shopName', label: 'Shop Name', placeholder: 'My Awesome Store' },
              { key: 'address',  label: 'Address',   placeholder: '123 Main St, City' },
              { key: 'latitude',  label: 'Latitude (optional)',  placeholder: '28.6139', type: 'number' },
              { key: 'longitude', label: 'Longitude (optional)', placeholder: '77.2090', type: 'number' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-xs text-white/45 mb-1.5 font-medium">{label}</label>
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="input"
                  placeholder={placeholder}
                  type={type || 'text'}
                  step={type === 'number' ? 'any' : undefined}
                />
              </div>
            ))}
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary mt-5 flex items-center gap-2">
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            ) : (
              <><CheckCircle size={15} /> Save Profile</>
            )}
          </button>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          {
            href: '/retailer/inventory', icon: Package, label: 'Inventory',
            desc: 'Manage your products', gradient: 'from-primary-500/10 to-primary-600/5',
          },
          {
            href: '/retailer/orders', icon: ShoppingBag, label: 'Orders',
            desc: `${orders.filter((o) => o.status === 'PENDING').length} pending orders`,
            gradient: 'from-amber-500/10 to-amber-600/5',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`glass-card bg-gradient-to-br ${item.gradient} text-left group
                          hover:border-primary-500/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl`}
            >
              <div className="flex items-start justify-between mb-4">
                <Icon size={26} className="text-primary-400 group-hover:scale-110 transition-transform" />
                <ArrowRight size={18} className="text-white/20 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-black text-white font-display text-lg group-hover:text-primary-400 transition-colors">{item.label}</h3>
              <p className="text-xs text-white/40 mt-1">{item.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <div className="glass-card animate-slideUp">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-black text-white font-display text-lg">Recent Orders</h3>
            <button onClick={() => router.push('/retailer/orders')} className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-white/6 last:border-none">
                <div>
                  <p className="text-xs text-white/30 font-mono mb-0.5">#{String(order.id).slice(-8).toUpperCase()}</p>
                  <p className="font-semibold text-white text-sm">{order.customer?.name || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-primary-400 font-bold">₹{order.totalAmount?.toFixed(0)}</p>
                  <span className={STATUS_STYLES[order.status] || 'badge'}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
