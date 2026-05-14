'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCart, placeOrder } from '../../../services/orderService';
import { MapPin, CreditCard, CheckCircle, Package, ArrowRight, ChevronRight } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Address',  icon: MapPin },
  { id: 2, label: 'Review',   icon: Package },
  { id: 3, label: 'Confirm',  icon: CreditCard },
];

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('quik_token') : null;
    if (!token) { router.push('/auth/login'); return; }
    getCart().then((res) => setCart(res.data.data)).catch(() => {});
  }, []);

  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleNext = () => {
    if (step === 1) {
      if (!address.trim()) { setError('Please enter a delivery address'); return; }
      setError('');
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) { setError('Please enter a delivery address'); return; }
    setLoading(true); setError('');
    try { await placeOrder(address); setPlaced(true); }
    catch (err) { setError(err.response?.data?.message || 'Failed to place order'); }
    finally { setLoading(false); }
  };

  if (placed) return (
    <div className="max-w-md mx-auto px-4 py-20 text-center animate-slideUp">
      {/* Confetti-like orbs */}
      <div className="relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-500/20 rounded-full blur-2xl animate-float" />
        <div className="w-24 h-24 bg-gradient-to-br from-green-400/20 to-green-600/20 border-2 border-green-500/40 rounded-full flex items-center justify-center mx-auto mb-6 relative shadow-xl shadow-green-500/20">
          <CheckCircle size={44} className="text-green-400" />
        </div>
      </div>
      <h2 className="text-3xl font-black text-white font-display mb-3">Order Placed! 🎉</h2>
      <p className="text-white/45 mb-10 leading-relaxed">
        Your order has been placed successfully.<br />The retailer will confirm it soon.
      </p>
      <div className="flex flex-col gap-3">
        <button onClick={() => router.push('/customer/home')} className="btn-primary px-8 py-3.5">
          Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-black text-white font-display mb-2 flex items-center gap-3">
        <CreditCard size={32} className="text-primary-400" /> Checkout
      </h1>
      <p className="text-white/35 text-sm mb-8">{cart.length} item{cart.length !== 1 ? 's' : ''} · ₹{total.toFixed(2)} total</p>

      {/* Step indicator */}
      <div className="flex items-center mb-8 glass-card py-4 px-5">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const done = step > s.id;
          const active = step === s.id;
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold
                                transition-all duration-300
                                ${done   ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30'
                                : active ? 'border-primary-500 text-primary-400 bg-primary-500/10'
                                :          'border-white/15 text-white/25 bg-white/5'}`}>
                  {done ? '✓' : <Icon size={14} />}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${active ? 'text-white' : done ? 'text-primary-400' : 'text-white/25'}`}>
                  {s.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <ChevronRight size={14} className={`flex-1 mx-2 ${step > s.id ? 'text-primary-500' : 'text-white/15'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-5">
        {/* Step 1: Address */}
        {step === 1 && (
          <div className="glass-card animate-slideUp">
            <h3 className="font-black text-white text-lg font-display mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-primary-400" /> Delivery Address
            </h3>
            {error && <div className="text-red-400 text-sm mb-3 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">⚠️ {error}</div>}
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full delivery address (house no., street, landmark, city…)"
              rows={4}
              className="input resize-none text-sm"
            />
            <button onClick={handleNext} className="btn-primary w-full mt-4 flex items-center justify-center gap-2 py-3">
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="glass-card animate-slideUp">
            <h3 className="font-black text-white text-lg font-display mb-4 flex items-center gap-2">
              <Package size={18} className="text-primary-400" /> Review Order
            </h3>
            <div className="bg-white/5 rounded-xl p-3 mb-4 text-sm">
              <p className="text-white/40 text-xs mb-1">📍 Delivering to</p>
              <p className="text-white/80">{address}</p>
            </div>
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-white/70">{item.product?.name} <span className="text-white/35">×{item.quantity}</span></span>
                  <span className="text-white">₹{(item.product?.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/8 pt-3 space-y-1.5 mb-4">
              <div className="flex justify-between text-sm text-white/45"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm text-white/45"><span>Tax (8%)</span><span>₹{tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-black text-white text-lg"><span>Total</span><span className="text-primary-400 font-display">₹{total.toFixed(2)}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
              <button onClick={handleNext} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                Confirm <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm & Pay */}
        {step === 3 && (
          <div className="glass-card animate-slideUp">
            <h3 className="font-black text-white text-lg font-display mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-primary-400" /> Confirm & Pay
            </h3>
            <div className="bg-primary-500/8 border border-primary-500/20 rounded-xl p-4 text-sm text-primary-300 mb-4 flex items-center gap-2">
              💳 This is a simulated payment — no real charges will be made.
            </div>
            <div className="flex justify-between font-black text-white text-2xl mb-6">
              <span>Total</span>
              <span className="text-primary-400 font-display">₹{total.toFixed(2)}</span>
            </div>
            {error && <div className="text-red-400 text-sm mb-3">⚠️ {error}</div>}
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1 py-3">← Back</button>
              <button
                onClick={handlePlaceOrder}
                disabled={loading || cart.length === 0}
                className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2 text-base"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing…
                  </span>
                ) : `🎉 Place Order · ₹${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
