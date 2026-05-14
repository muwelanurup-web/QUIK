'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getProductsByRetailer, addProduct, updateProduct, deleteProduct, getRetailerProfile
} from '../../../services/productService';
import {
  Plus, Edit2, Trash2, Package, X, Check, LayoutGrid, List, AlertCircle, Search, ChevronDown
} from 'lucide-react';

const emptyForm = { name: '', description: '', price: '', quantity: '', category: '', imageUrl: '' };
const CATEGORIES = ['Groceries','Vegetables','Fruits','Dairy','Snacks','Beverages','Household','Bakery','Meat & Poultry','Frozen Foods','Personal Care','Other'];
const CATEGORY_EMOJIS = {
  Groceries:'🛒',Vegetables:'🥦',Fruits:'🍎',Dairy:'🥛',Snacks:'🍿',Beverages:'🧃',
  Household:'🏠',Bakery:'🥖','Meat & Poultry':'🥩','Frozen Foods':'🧊','Personal Care':'🧴',Other:'✨',
};

function StockBadge({ quantity }) {
  if (quantity === 0) return <span className="badge bg-red-500/20 text-red-400 border border-red-500/20">⛔ Out</span>;
  if (quantity <= 5) return <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/20">⚠️ Low: {quantity}</span>;
  if (quantity <= 20) return <span className="badge bg-yellow-500/15 text-yellow-400 border border-yellow-500/20">🟡 {quantity}</span>;
  return <span className="badge bg-green-500/15 text-green-400 border border-green-500/20">✅ {quantity}</span>;
}

export default function InventoryPage() {
  const [products, setProducts]   = useState([]);
  const [retailer, setRetailer]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState({ text: '', ok: true });
  const [view, setView]           = useState('grid');
  const [search, setSearch]       = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('quik_token') : null;
    if (!token) { router.push('/auth/login'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const profileRes = await getRetailerProfile();
      const r = profileRes.data.data; setRetailer(r);
      const productsRes = await getProductsByRetailer(r.id);
      setProducts(productsRes.data.data);
    } catch { router.push('/retailer/dashboard'); }
    finally { setLoading(false); }
  };

  const notify = (text, ok = true) => { setMsg({ text, ok }); setTimeout(() => setMsg({ text: '', ok: true }), 2500); };
  const openAdd  = () => { setEditId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, description: p.description || '', price: p.price, quantity: p.quantity, category: p.category || '', imageUrl: p.imageUrl || '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) { notify('Name and price are required', false); return; }
    setSaving(true);
    try {
      if (editId) { await updateProduct(editId, form); notify('Product updated!'); }
      else { await addProduct(form); notify('Product added!'); }
      setShowForm(false); setEditId(null); setForm(emptyForm); fetchData();
    } catch (err) { notify(err.response?.data?.message || 'Save failed', false); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this product?')) return;
    try { await deleteProduct(id); setProducts((prev) => prev.filter((p) => p.id !== id)); notify('Product removed'); }
    catch { notify('Failed to delete', false); }
  };

  const displayed = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const lowStock  = products.filter((p) => p.quantity <= 5 && p.quantity > 0);
  const outOfStock = products.filter((p) => p.quantity === 0);

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <div key={i} className="h-48 rounded-2xl shimmer" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Toast */}
      {msg.text && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2 animate-slideInRight
          ${msg.ok ? 'bg-primary-500 text-white shadow-primary-500/30' : 'bg-red-500 text-white'}`}>
          {msg.ok ? '✅' : '⚠️'} {msg.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-slideUp">
        <div>
          <h1 className="text-4xl font-black text-white font-display flex items-center gap-3">
            <Package size={32} className="text-primary-400" /> Inventory
          </h1>
          <p className="text-white/40 mt-1 text-sm">
            🏪 {retailer?.shopName} · {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <button onClick={() => setView('grid')} className={`p-2.5 transition-colors ${view==='grid'?'bg-primary-500 text-white':'text-white/40 hover:text-white'}`}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setView('list')} className={`p-2.5 transition-colors ${view==='list'?'bg-primary-500 text-white':'text-white/40 hover:text-white'}`}>
              <List size={16} />
            </button>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="flex flex-wrap gap-3 mb-5">
          {outOfStock.length > 0 && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-xl">
              <AlertCircle size={13} /> {outOfStock.length} product{outOfStock.length > 1 ? 's' : ''} out of stock
            </div>
          )}
          {lowStock.length > 0 && (
            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-4 py-2.5 rounded-xl">
              <AlertCircle size={13} /> {lowStock.length} low on stock (≤5)
            </div>
          )}
        </div>
      )}

      {/* Search bar */}
      {products.length > 0 && (
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or categories…"
            className="input pl-11"
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) { setShowForm(false); setEditId(null); } }}>
          <div className="w-full max-w-lg glass-card p-7 shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white font-display">
                {editId ? '✏️ Edit Product' : '✨ New Product'}
              </h3>
              <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-white/30 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-white/45 mb-1.5 font-semibold">Product Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Fresh Tomatoes" className="input" />
              </div>
              <div>
                <label className="block text-xs text-white/45 mb-1.5 font-semibold">Category</label>
                <div className="relative">
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input pr-9 appearance-none">
                    <option value="">Select category…</option>
                    {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#111827]">{CATEGORY_EMOJIS[c]} {c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/45 mb-1.5 font-semibold">Price (₹) *</label>
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="49.99" type="number" min="0" step="0.01" className="input" />
              </div>
              <div>
                <label className="block text-xs text-white/45 mb-1.5 font-semibold">Stock Quantity</label>
                <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="100" type="number" min="0" className="input" />
              </div>
              <div>
                <label className="block text-xs text-white/45 mb-1.5 font-semibold">Image URL</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" className="input" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-white/45 mb-1.5 font-semibold">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description…" rows={2} className="input resize-none" />
              </div>
            </div>

            {form.imageUrl && (
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                <img src={form.imageUrl} alt="preview" className="h-28 w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 flex-1 justify-center py-3">
                {saving
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                  : <><Check size={15} /> {editId ? 'Update Product' : 'Add Product'}</>
                }
              </button>
              <button onClick={() => { setShowForm(false); setEditId(null); }} className="btn-secondary py-3">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="text-center py-28 text-white/30 animate-fadeIn">
          <div className="text-7xl mb-5">📦</div>
          <p className="text-2xl font-black font-display mb-2">No products yet</p>
          <p className="text-sm mb-8 text-white/20">Add your first product to start selling</p>
          <button onClick={openAdd} className="btn-primary inline-flex items-center gap-2 px-7 py-3">
            <Plus size={16} /> Add Your First Product
          </button>
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 text-white/30 animate-fadeIn">
          <Search size={40} className="mx-auto mb-3 opacity-25" />
          <p className="text-lg">No products match "{search}"</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
          {displayed.map((p) => (
            <div key={p.id} className="group relative flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-36 bg-white/5 overflow-hidden">
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-4xl">{CATEGORY_EMOJIS[p.category] || '📦'}</div>
                }
                {p.quantity === 0 && (
                  <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="p-3.5 flex flex-col flex-1">
                <p className="font-bold text-white text-sm line-clamp-1 mb-1">{p.name}</p>
                {p.category && <p className="text-[11px] text-white/35 mb-2">{CATEGORY_EMOJIS[p.category]} {p.category}</p>}
                <div className="flex items-center justify-between mt-auto mb-3">
                  <span className="text-primary-400 font-black text-base font-display">₹{p.price.toFixed(0)}</span>
                  <StockBadge quantity={p.quantity} />
                </div>
                <div className="flex gap-2 pt-3 border-t border-white/8">
                  <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 text-xs text-white/45 hover:text-primary-400 transition-colors py-1.5 rounded-lg hover:bg-primary-500/10">
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="flex-1 flex items-center justify-center gap-1 text-xs text-white/45 hover:text-red-400 transition-colors py-1.5 rounded-lg hover:bg-red-500/10">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={openAdd} className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-white/10 rounded-2xl text-white/25 hover:border-primary-500/40 hover:text-primary-400 transition-all duration-300 hover:bg-primary-500/5">
            <Plus size={32} className="mb-2" />
            <span className="text-sm font-medium">Add Product</span>
          </button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/8">
                {['Product','Category','Price','Stock','Actions'].map((h, i) => (
                  <th key={h} className={`text-xs text-white/35 font-semibold px-5 py-4 ${i > 1 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/4 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        : <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center text-xl flex-shrink-0">{CATEGORY_EMOJIS[p.category] || '📦'}</div>
                      }
                      <div>
                        <p className="font-semibold text-white text-sm">{p.name}</p>
                        {p.description && <p className="text-xs text-white/25 truncate max-w-[180px]">{p.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.category
                      ? <span className="text-xs bg-white/8 text-white/55 px-2.5 py-1 rounded-full">{CATEGORY_EMOJIS[p.category]} {p.category}</span>
                      : <span className="text-white/20 text-xs">—</span>
                    }
                  </td>
                  <td className="px-5 py-3.5 text-right font-black text-primary-400 font-display">₹{p.price.toFixed(0)}</td>
                  <td className="px-5 py-3.5 text-right"><StockBadge quantity={p.quantity} /></td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="p-2 text-white/35 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-white/35 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
