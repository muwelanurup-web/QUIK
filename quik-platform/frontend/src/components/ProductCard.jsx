'use client';
import { ShoppingCart, MapPin, Tag, Package, Check } from 'lucide-react';
import { useState } from 'react';

const CATEGORY_EMOJIS = {
  Groceries: '🛒', Vegetables: '🥦', Fruits: '🍎', Dairy: '🥛',
  Snacks: '🍿', Beverages: '🧃', Household: '🏠', Bakery: '🥖',
  'Meat & Poultry': '🥩', 'Frozen Foods': '🧊', 'Personal Care': '🧴', Other: '✨',
};

const CATEGORY_COLORS = {
  Groceries: 'bg-amber-500/20 text-amber-300 border-amber-500/20',
  Vegetables: 'bg-green-500/20 text-green-300 border-green-500/20',
  Fruits: 'bg-orange-500/20 text-orange-300 border-orange-500/20',
  Dairy: 'bg-blue-500/20 text-blue-300 border-blue-500/20',
  Snacks: 'bg-pink-500/20 text-pink-300 border-pink-500/20',
  Beverages: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/20',
  Household: 'bg-purple-500/20 text-purple-300 border-purple-500/20',
};

export default function ProductCard({ product, onAddToCart }) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const emoji = CATEGORY_EMOJIS[product.category] || '🛍️';
  const catColor = CATEGORY_COLORS[product.category] || 'bg-white/10 text-white/60 border-white/10';

  const handleAdd = async () => {
    if (!onAddToCart || product.quantity === 0 || adding) return;
    setAdding(true);
    await onAddToCart(product);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const stockLevel = product.quantity === 0 ? 'out' : product.quantity <= 10 ? 'low' : 'ok';

  return (
    <div className="group relative flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden
                    hover:border-primary-500/60 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary-500/15
                    transition-all duration-350 ease-out">

      {/* Image area */}
      <div className="relative w-full h-44 bg-gradient-to-br from-white/5 to-white/[0.02] overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl select-none
                          group-hover:scale-110 transition-transform duration-500">
            {emoji}
          </div>
        )}

        {/* Category badge */}
        {product.category && (
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-semibold px-2.5 py-1 rounded-full
                            backdrop-blur-md border ${catColor}`}>
            {emoji} {product.category}
          </span>
        )}

        {/* Out of stock overlay */}
        {product.quantity === 0 && (
          <div className="absolute inset-0 bg-black/65 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full border border-red-400/30 shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Low stock badge */}
        {stockLevel === 'low' && (
          <span className="absolute top-2.5 right-2.5 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">
            Only {product.quantity} left!
          </span>
        )}

        {/* Hover gradient overlay with Add button */}
        {product.quantity > 0 && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300
                          flex items-end justify-center pb-3">
            <button
              onClick={handleAdd}
              disabled={adding}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold
                          translate-y-4 group-hover:translate-y-0 transition-all duration-300
                          ${added
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/40'
                            : 'bg-primary-500 hover:bg-primary-400 text-white shadow-lg shadow-primary-500/40 active:scale-95'
                          }`}
            >
              {added ? <Check size={15} /> : <ShoppingCart size={15} />}
              {adding ? 'Adding…' : added ? 'Added!' : 'Add to Cart'}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-primary-400
                        transition-colors duration-200 line-clamp-2 mb-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-white/35 line-clamp-2 mb-2 leading-relaxed">{product.description}</p>
        )}
        {product.retailer && (
          <div className="flex items-center gap-1 text-xs text-white/30 mb-3">
            <MapPin size={10} className="shrink-0 text-primary-400/60" />
            <span className="truncate">{product.retailer.shopName}</span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/8">
          <div>
            <span className="text-xl font-black text-primary-400 font-display">
              ₹{product.price.toFixed(0)}
            </span>
            {stockLevel === 'ok' && (
              <p className="text-[10px] text-white/25 leading-none mt-0.5">{product.quantity} in stock</p>
            )}
          </div>
          {/* Fallback button (mobile / no hover) */}
          <button
            onClick={handleAdd}
            disabled={product.quantity === 0 || adding}
            className={`sm:opacity-0 group-hover:opacity-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
              ${added
                ? 'bg-green-500 text-white opacity-100 !opacity-100'
                : product.quantity === 0
                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                : 'bg-primary-500/20 text-primary-400 hover:bg-primary-500 hover:text-white active:scale-95'
              }`}
          >
            <ShoppingCart size={12} />
            {adding ? '…' : added ? '✓' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}
