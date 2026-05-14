'use client';
import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { login as loginApi } from '../../../services/authService';
import useUserStore from '../../../store/userStore';
import { Mail, Lock, ArrowRight, Zap, Shield, ShoppingBag } from 'lucide-react';

function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const { setUser } = useUserStore();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true); setError('');
    try {
      const res = await loginApi(data);
      const { token, user } = res.data.data;
      setUser(user, token);
      router.push(user.role === 'RETAILER' ? '/retailer/dashboard' : '/customer/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: '⚡', text: 'Instant access to 500+ local stores' },
    { icon: '📍', text: 'Products from retailers near you' },
    { icon: '🛒', text: 'Fast checkout, zero hassle' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] bg-gradient-to-br from-primary-600/20 via-primary-500/10 to-transparent p-12 border-r border-white/8 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute -top-32 -left-32 w-72 h-72 bg-primary-500/15 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl animate-float2" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Zap size={20} fill="white" className="text-white" />
            </div>
            <span className="text-2xl font-black text-white font-display">QUIK</span>
          </div>

          <h2 className="text-4xl font-black text-white leading-tight font-display mb-4">
            Your local market,<br />
            <span className="text-primary-400">at your fingertips.</span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-10">
            Connect with nearby retailers. Shop fresh products. Get them delivered fast.
          </p>

          <div className="space-y-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3 backdrop-blur-sm"
                style={{ animation: `slideUp 0.5s ${0.1 * i}s ease both` }}
              >
                <span className="text-xl">{f.icon}</span>
                <span className="text-sm text-white/70">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/25">© 2024 QUIK. Fast Local Commerce.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-slideUp">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl
                            flex items-center justify-center text-white mx-auto mb-5 shadow-xl shadow-primary-500/30">
              <Shield size={26} />
            </div>
            <h1 className="text-3xl font-black text-white font-display">Welcome back</h1>
            <p className="text-white/40 mt-2 text-sm">Sign in to your QUIK account</p>
          </div>

          <div className={`glass-card p-7 ${shake ? 'animate-shake' : ''}`}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-400/60" />
                  <input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    placeholder="you@example.com"
                    className="input pl-10"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-white/70 mb-2">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-400/60" />
                  <input
                    {...register('password', { required: 'Password is required' })}
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
                    Signing in…
                  </span>
                ) : (
                  <>Sign In <ArrowRight size={17} /></>
                )}
              </button>
            </form>

            <p className="text-center text-white/35 text-sm mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
