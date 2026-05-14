'use client';
import { useState } from 'react';
import ProductCard from '../../../components/ProductCard';
import { searchProducts } from '../../../services/productService';
import { addToCart } from '../../../services/orderService';
import { Search, Sparkles, X } from 'lucide-react';

const QUICK_CATS = [
  { label: 'Vegetables', emoji: '🥦' },
  { label: 'Fruits',     emoji: '🍎' },
  { label: 'Dairy',      emoji: '🥛' },
  { label: 'Groceries',  emoji: '🛒' },
  { label: 'Snacks',     emoji: '🍿' },
  { label: 'Beverages',  emoji: '🧃' },
  { label: 'Household',  emoji: '🏠' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState({ msg: '', ok: true });

  const handleSearch = async (e, overrideQuery, overrideCat) => {
    e?.preventDefault();
    const q = overrideQuery !== undefined ? overrideQuery : query;
    const cat = overrideCat !== undefined ? overrideCat : category;
    setLoading(true); setSearched(true);
    try {
      const res = await searchProducts(q, cat);
      setProducts(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPill = (cat) => {
    setCategory(cat);
    setQuery('');
    handleSearch(null, '', cat);
  };

  const clearAll = () => { setCategory(''); setQuery(''); setSearched(false); setProducts([]); };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
      setToast({ msg: `${product.name} added! 🛒`, ok: true });
      setTimeout(() => setToast({ msg: '', ok: true }), 2000);
    } catch (err) {
      setToast({ msg: err.response?.data?.message || 'Failed', ok: false });
      setTimeout(() => setToast({ msg: '', ok: true }), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Toast */}
      {toast.msg && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold animate-slideInRight
          ${toast.ok ? 'bg-primary-500 text-white shadow-primary-500/30' : 'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 animate-slideUp">
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display mb-2">
          Search <span className="text-primary-400">Products</span>
        </h1>
        <p className="text-white/40 text-sm">Find exactly what you need from nearby stores</p>
      </div>

      {/* Large Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8 flex-col sm:flex-row animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <div className="relative flex-1 group">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 group-focus-within:text-primary-400 transition-colors"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands, stores…"
            className="input pl-12 py-4 text-base rounded-2xl pr-10"
          />
          {(query || category) && (
            <button
              type="button"
              onClick={clearAll}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button type="submit" className="btn-primary flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base">
          <Search size={18} /> Search
        </button>
      </form>

      {/* Category pills */}
      <div className="mb-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={13} className="text-primary-400" />
          <span className="text-white/40 text-xs font-semibold uppercase tracking-wide">Browse by category</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_CATS.map(({ label, emoji }) => (
            <button
              key={label}
              onClick={() => handleCategoryPill(label)}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all duration-200
                ${category === label && searched
                  ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30 scale-105'
                  : 'bg-white/5 border-white/10 text-white/55 hover:border-primary-500/40 hover:text-white hover:bg-white/8'
                }`}
            >
              <span>{emoji}</span> {label}
            </button>
          ))}
          {(category || query) && searched && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-72 rounded-2xl shimmer" />)}
        </div>
      )}

      {/* No results */}
      {!loading && searched && products.length === 0 && (
        <div className="text-center py-24 text-white/30 animate-fadeIn">
          <div className="text-6xl mb-5">🔍</div>
          <p className="text-xl font-semibold font-display mb-2">No products found</p>
          <p className="text-sm text-white/20">Try a different search term or browse a category above</p>
        </div>
      )}

      {/* Results */}
      {!loading && products.length > 0 && (
        <>
          <p className="text-white/35 text-xs mb-5 flex items-center gap-1">
            <Sparkles size={11} className="text-primary-400/60" />
            {products.length} result{products.length !== 1 ? 's' : ''}
            {category ? ` in "${category}"` : ''}
            {query ? ` for "${query}"` : ''}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 stagger-children">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </>
      )}

      {/* Initial empty state */}
      {!searched && (
        <div className="text-center py-20 text-white/20 animate-fadeIn">
          <div className="text-6xl mb-4 animate-float">🛍️</div>
          <p className="text-base font-display">Search or pick a category above to get started</p>
        </div>
      )}
    </div>
  );
}
