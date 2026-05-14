'use client';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const CATEGORY_EMOJIS = {
  Groceries: '🛒', Vegetables: '🥦', Fruits: '🍎', Dairy: '🥛',
  Snacks: '🍿', Beverages: '🧃', Household: '🏠', Bakery: '🥖',
  'Meat & Poultry': '🥩', 'Frozen Foods': '🧊', 'Personal Care': '🧴', Other: '✨',
};

export default function CartItem({ item, onUpdate, onRemove }) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(item.id), 300);
  };

  const emoji = CATEGORY_EMOJIS[item.product?.category] || '🛍️';

  return (
    <div
      className={`glass-card flex items-center gap-4 transition-all duration-300
        ${removing ? 'opacity-0 scale-95 -translate-x-4' : 'opacity-100 scale-100'}`}
    >
      {/* Image */}
      <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-white/8">
        {item.product?.imageUrl ? (
          <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <span className="text-2xl">{emoji}</span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white text-sm truncate">{item.product?.name}</h4>
        <p className="text-xs text-white/40 truncate mt-0.5">{item.product?.retailer?.shopName}</p>
        <p className="text-primary-400 font-bold text-sm mt-1">₹{item.product?.price?.toFixed(2)}</p>
      </div>

      {/* Quantity stepper */}
      <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
        <button
          onClick={() => onUpdate(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center
                     text-white disabled:opacity-25 transition-all duration-150 active:scale-90"
        >
          <Minus size={12} />
        </button>
        <span className="w-7 text-center text-white font-bold text-sm">{item.quantity}</span>
        <button
          onClick={() => onUpdate(item.id, item.quantity + 1)}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-primary-500/20 hover:text-primary-400
                     flex items-center justify-center text-white transition-all duration-150 active:scale-90"
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Total + Remove */}
      <div className="text-right shrink-0 min-w-[70px]">
        <p className="font-bold text-white text-sm">₹{(item.product?.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={handleRemove}
          className="text-white/25 hover:text-red-400 mt-1.5 transition-colors duration-200 p-1 rounded hover:bg-red-500/10"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
