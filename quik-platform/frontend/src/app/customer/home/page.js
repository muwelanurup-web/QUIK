'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '../../../components/ProductCard';
import { getAllProducts } from '../../../services/productService';
import { addToCart } from '../../../services/orderService';
import useUserStore from '../../../store/userStore';
import { Sparkles, TrendingUp, Filter, Sun, Moon, Sunset } from 'lucide-react';

const ALL = 'All';

const CATEGORY_EMOJIS = {
  All: '✨', Groceries: '🛒', Vegetables: '🥦', Fruits: '🍎', Dairy: '🥛',
  Snacks: '🍿', Beverages: '🧃', Household: '🏠', Bakery: '🥖',
  'Meat & Poultry': '🥩', 'Frozen Foods': '🧊', 'Personal Care': '🧴', Other: '🎁',
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', icon: '🌅' };
  if (h < 17) return { text: 'Good afternoon', icon: '☀️' };
  return { text: 'Good evening', icon: '🌙' };
}

export default function CustomerHome() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ msg: '', ok: true });
  const { user } = useUserStore();
  const router = useRouter();
  const greeting = getGreeting();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('quik_token') : null;
    if (!token) { router.push('/auth/login'); return; }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      const data = res.data.data;
      setProducts(data);
      setFiltered(data);
    } finally {
      setLoading(false);
    }
  };

  const categories = [ALL, ...new Set(products.map((p) => p.category).filter(Boolean))];

  const handleCategoryFilter = (cat) => {
    setActiveCategory(cat);
    setFiltered(cat === ALL ? products : products.filter((p) => p.category === cat));
  };

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: '', ok: true }), 2500);
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id, 1);
      showToast(`${product.name} added to cart! 🛒`, true);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add to cart', false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Toast */}
      {toast.msg && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold
                         flex items-center gap-2 animate-slideInRight
                         ${toast.ok
                           ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-primary-500/30'
                           : 'bg-red-500 text-white'
                         }`}>
          {toast.msg}
        </div>
      )}

      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-primary-500/15 via-primary-600/8 to-transparent
                      border border-primary-500/20 rounded-3xl p-7 mb-8 overflow-hidden
                      animate-fadeIn">
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-primary-500/5 to-transparent pointer-events-none" />
        <div className="absolute -right-8 -bottom-8 text-[120px] opacity-10 select-none">🛒</div>

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{greeting.icon}</span>
            <span className="text-primary-400 font-semibold text-sm">{greeting.text}{user?.name ? `, ${user.name}` : ''}!</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight font-display">
            What are you<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-400">
              looking for?
            </span>
          </h1>
          <p className="text-white/40 mt-3 text-sm">
            {products.length > 0
              ? `${products.length} fresh products from nearby retailers`
              : 'Fresh products from nearby retailers, delivered quick'}
          </p>
        </div>
      </div>

      {/* Category filter chips */}
      {categories.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={13} className="text-white/30" />
            <span className="text-white/30 text-xs font-medium">Browse by category</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryFilter(cat)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border
                            transition-all duration-200
                            ${activeCategory === cat
                              ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30 scale-105'
                              : 'bg-white/5 border-white/10 text-white/55 hover:border-primary-500/40 hover:text-white hover:bg-white/8'
                            }`}
              >
                {CATEGORY_EMOJIS[cat] && <span>{CATEGORY_EMOJIS[cat]}</span>}
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Count */}
      {!loading && products.length > 0 && (
        <p className="text-white/30 text-xs mb-4 flex items-center gap-1">
          <Sparkles size={11} className="text-primary-400/60" />
          {activeCategory === ALL
            ? `${products.length} products available`
            : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} in ${activeCategory}`}
        </p>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-72 rounded-2xl shimmer" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-white/30">
          <TrendingUp size={48} className="mx-auto mb-4 opacity-25" />
          <p className="text-xl font-semibold font-display">No products here yet</p>
          <p className="text-sm mt-2 text-white/20">Check back soon for fresh arrivals!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 stagger-children">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
