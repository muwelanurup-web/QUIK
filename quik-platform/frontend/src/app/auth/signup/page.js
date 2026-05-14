'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { signup as signupApi } from '../../../services/authService';
import useUserStore from '../../../store/userStore';
import { User, Mail, Lock, Store, ShoppingBag, ArrowRight, Zap } from 'lucide-react';

function SignupForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { setUser } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'CUSTOMER';
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({ defaultValues: { role: defaultRole } });
  const role = watch('role');

  const onSubmit = async (data) => {
    setLoading(true); setError('');
    try {
      const res = await signupApi(data);
      const { token, user } = res.data.data;
      setUser(user, token);
      router.push(user.role === 'RETAILER' ? '/retailer/dashboard' : '/customer/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  const roleTiles = [
    {
      value: 'CUSTOMER',
      icon: ShoppingBag,
      title: 'Customer',
      desc: 'Shop from local retailers near you',
      emoji: '🛒',
      gradient: 'from-primary-500/20 to-primary-600/10',
      border: 'border-primary-500',
    },
    {
      value: 'RETAILER',
      icon: Store,
      title: 'Retailer',
      desc: 'Sell your products to local customers',
      emoji: '🏪',
      gradient: 'from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] bg-gradient-to-br from-primary-600/20 via-primary-500/10 to-transparent p-12 border-r border-white/8 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-primary-500/15 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-float2" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Zap size={20} fill="white" className="text-white" />
            </div>
            <span className="text-2xl font-black text-white font-display">QUIK</span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight font-display mb-4">
            Join thousands of<br />
            <span className="text-primary-400">local businesses.</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-10">
            Whether you shop or sell — QUIK makes local commerce fast, simple, and connected.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { n: '500+', l: 'Retailers' },
              { n: '10K+', l: 'Products' },
              { n: '24h', l: 'Delivery' },
              { n: '4.9★', l: 'Rating' },
            ].map(({ n, l }) => (
              <div key={l} className="bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-center">
                <p className="text-xl font-black text-primary-400 font-display">{n}</p>
                <p className="text-xs text-white/40">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/25">© 2024 QUIK. Fast Local Commerce.</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md animate-slideUp">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl
                            flex items-center justify-center text-white mx-auto mb-5 shadow-xl shadow-primary-500/30">
              <Zap size={26} fill="white" />
            </div>
            <h1 className="text-3xl font-black text-white font-display">Create account</h1>
            <p className="text-white/40 mt-2 text-sm">Start using QUIK today — it's free</p>
          </div>

          <div className={`glass-card p-7 ${shake ? 'animate-shake' : ''}`}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {roleTiles.map((tile) => {
                const Icon = tile.icon;
                const selected = role === tile.value;
                return (
                  <button
                    key={tile.value}
                    type="button"
                    onClick={() => setValue('role', tile.value)}
                    className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border-2 cursor-pointer
                                transition-all duration-200 text-left
                                ${selected
                                  ? `bg-gradient-to-br ${tile.gradient} ${tile.border} shadow-lg`
                                  : 'border-white/10 hover:border-white/25 bg-white/3'
                                }`}
                  >
                    <span className="text-2xl">{tile.emoji}</span>
                    <div>
                      <p className={`text-sm font-bold ${selected ? 'text-white' : 'text-white/60'}`}>{tile.title}</p>
                      <p className={`text-[11px] leading-tight mt-0.5 ${selected ? 'text-white/60' : 'text-white/30'}`}>
                        {tile.desc}
                      </p>
                    </div>
                    {selected && (
                      <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px]">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <input type="hidden" {...register('role')} />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-400/60" />
                  <input {...register('name', { required: 'Name is required' })} placeholder="John Doe" className="input pl-10" />
                </div>
                {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-400/60" />
                  <input {...register('email', { required: 'Email is required' })} type="email" placeholder="you@example.com" className="input pl-10" />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-400/60" />
                  <input
                    {...register('password', { required: 'Password required', minLength: { value: 6, message: 'At least 6 characters' } })}
                    type="password"
                    placeholder="••••••••"
                    className="input pl-10"
                  />
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  <>Create Account <ArrowRight size={17} /></>
                )}
              </button>
            </form>

            <p className="text-center text-white/35 text-sm mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>;
}
