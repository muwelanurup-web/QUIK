'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CartItem from '../../../components/CartItem';
import { getCart, updateCartItem, removeFromCart } from '../../../services/orderService';
import { ShoppingCart, ArrowRight, Package, Tag } from 'lucide-react';

const FREE_DELIVERY_THRESHOLD = 500;

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('quik_token') : null;
    if (!token) { router.push('/auth/login'); return; }
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try { const res = await getCart(); setItems(res.data.data); } finally { setLoading(false); }
  };

  const handleUpdate = async (id, quantity) => { await updateCartItem(id, quantity); fetchCart(); };
  const handleRemove = async (id) => { await removeFromCart(id); setItems((prev) => prev.filter((i) => i.id !== id)); };

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const remaining = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const freeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const progress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl shimmer" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-black text-white font-display mb-2 flex items-center gap-3">
        <ShoppingCart size={32} className="text-primary-400" /> Your Cart
      </h1>
      <p className="text-white/35 text-sm mb-8">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

      {items.length === 0 ? (
        <div className="text-center py-28 animate-fadeIn">
          <div className="text-7xl mb-6 animate-float">🛒</div>
          <p className="text-white/40 text-xl font-display font-bold mb-2">Your cart is empty</p>
          <p className="text-white/25 text-sm mb-8">Add some products to get started</p>
          <button onClick={() => router.push('/customer/home')} className="btn-primary px-8 py-3">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Cart items */}
          <div className="flex-1 space-y-3">
            {items.map((item) => (
              <CartItem key={item.id} item={item} onUpdate={handleUpdate} onRemove={handleRemove} />
            ))}

            {/* Continue shopping */}
            <button
              onClick={() => router.push('/customer/home')}
              className="mt-4 text-sm text-white/35 hover:text-primary-400 transition-colors flex items-center gap-1"
            >
              ← Continue Shopping
            </button>
          </div>

          {/* Sticky Order Summary */}
          <div className="w-full lg:w-80 lg:sticky lg:top-24 space-y-4">
            {/* Free delivery progress */}
            <div className="glass-card">
              <div className="flex items-center gap-2 mb-3">
                <Package size={15} className="text-primary-400" />
                <span className="text-sm font-semibold text-white">
                  {freeDelivery ? '🎉 You get free delivery!' : `Free delivery at ₹${FREE_DELIVERY_THRESHOLD}`}
                </span>
              </div>
              <div className="w-full bg-white/8 rounded-full h-2 mb-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full progress-bar-fill transition-all duration-700
                    ${freeDelivery ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-primary-400'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              {!freeDelivery && (
                <p className="text-xs text-white/35">Add ₹{remaining.toFixed(0)} more for free delivery</p>
              )}
            </div>

            {/* Order summary */}
            <div className="glass-card space-y-4">
              <h3 className="font-black text-white text-lg font-display">Order Summary</h3>

              <div className="space-y-2.5">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between text-xs text-white/45">
                    <span className="truncate pr-2">{i.product?.name} ×{i.quantity}</span>
                    <span className="flex-shrink-0">₹{(i.product.price * i.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/8 pt-3 space-y-2">
                <div className="flex justify-between text-white/55 text-sm">
                  <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/55 text-sm">
                  <span>Tax (8%)</span><span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/55 text-sm">
                  <span>Delivery</span>
                  <span className={freeDelivery ? 'text-green-400 font-semibold' : ''}>
                    {freeDelivery ? 'FREE' : '₹40'}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/8 pt-3 flex justify-between font-black text-white text-xl">
                <span>Total</span>
                <span className="text-primary-400 font-display">₹{(total + (freeDelivery ? 0 : 40)).toFixed(2)}</span>
              </div>

              <button
                onClick={() => router.push('/customer/checkout')}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base"
              >
                Proceed to Checkout <ArrowRight size={17} />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-white/25">
                <Tag size={11} /> Prices are inclusive of all taxes
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
