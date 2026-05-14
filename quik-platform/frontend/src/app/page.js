'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Store, ArrowRight, Zap, MapPin, Clock, Shield } from 'lucide-react';

const features = [
  {
    icon: '⚡',
    title: 'Instant Discovery',
    desc: 'Browse thousands of products from local retailers in your area instantly.',
    color: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/20',
  },
  {
    icon: '📍',
    title: 'Nearby Stores',
    desc: 'Find products from shops right around you — support local businesses.',
    color: 'from-green-500/20 to-green-600/5',
    border: 'border-green-500/20',
  },
  {
    icon: '🚀',
    title: 'Fast Delivery',
    desc: 'Same-day delivery from neighborhood retailers. Fresh and fast, every time.',
    color: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/20',
  },
];

const stats = [
  { value: '500+', label: 'Local Retailers', icon: Store },
  { value: '10K+', label: 'Products', icon: ShoppingBag },
  { value: '24h', label: 'Avg Delivery', icon: Clock },
  { value: '4.9★', label: 'Customer Rating', icon: Shield },
];

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('quik_token');
    const user = JSON.parse(localStorage.getItem('quik_user') || 'null');
    if (token && user) {
      router.replace(user.role === 'RETAILER' ? '/retailer/dashboard' : '/customer/home');
    }
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-4.5rem)] flex flex-col items-center justify-center px-4 text-center relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/25 text-primary-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 animate-fadeIn">
          <Zap size={12} fill="currentColor" /> Fast · Local · Reliable
        </div>

        {/* Headline — staggered word animation */}
        <div className="stagger-children">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-none font-display mb-2">
            Shop
          </h1>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none font-display mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-500 to-orange-400">
              QUIK
            </span>
          </h1>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white/80 tracking-tight leading-none font-display mb-8">
            from nearby
          </h1>
        </div>

        <p className="text-lg sm:text-xl text-white/45 max-w-lg mx-auto leading-relaxed mb-12 animate-slideUp" style={{ animationDelay: '0.4s' }}>
          Discover fresh products from local retailers around you. Real inventory, real prices, delivered fast.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto animate-slideUp"
          style={{ animationDelay: '0.55s' }}
        >
          <Link
            href="/auth/signup?role=CUSTOMER"
            className="btn-primary flex items-center gap-2.5 text-base px-7 py-3.5 w-full sm:w-auto justify-center rounded-2xl"
          >
            <ShoppingBag size={18} /> Shop as Customer <ArrowRight size={15} />
          </Link>
          <Link
            href="/auth/signup?role=RETAILER"
            className="btn-secondary flex items-center gap-2.5 text-base px-7 py-3.5 w-full sm:w-auto justify-center rounded-2xl"
          >
            <Store size={18} /> Join as Retailer
          </Link>
        </div>

        <p className="mt-8 text-white/25 text-sm animate-fadeIn" style={{ animationDelay: '0.7s' }}>
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors underline underline-offset-2">
            Sign in
          </Link>
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/20 animate-float">
          <p className="text-xs">Scroll to explore</p>
          <div className="w-[1.5px] h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* Stats strip */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="glass-card text-center py-6 hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <Icon size={22} className="mx-auto mb-3 text-primary-400/70" />
              <p className="text-3xl font-black text-white font-display">{value}</p>
              <p className="text-xs text-white/40 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features section */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white font-display mb-3">Why QUIK?</h2>
          <p className="text-white/40 text-base">Everything you need, nothing you don't.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`glass-card bg-gradient-to-br ${f.color} border ${f.border} hover:-translate-y-2 transition-all duration-300 hover:shadow-xl`}
              style={{ animation: `slideUp 0.6s ${0.1 * i}s ease both` }}
            >
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="text-lg font-bold text-white font-display mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
