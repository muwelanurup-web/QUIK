'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, Store, LogOut, Package, LayoutDashboard, Search, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import useUserStore from '../store/userStore';
import useCartStore from '../store/cartStore';

export default function Navbar() {
  const { user, logout } = useUserStore();
  const cartCount = useCartStore((s) => s.getCount());
  const router = useRouter();
  const pathname = usePathname();
  const [prevCount, setPrevCount] = useState(cartCount);
  const [cartBounce, setCartBounce] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartCount > prevCount) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 600);
    }
    setPrevCount(cartCount);
  }, [cartCount]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  const NavLink = ({ href, icon: Icon, children }) => (
    <Link
      href={href}
      className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive(href)
          ? 'text-primary-400 bg-primary-500/10'
          : 'text-white/60 hover:text-white hover:bg-white/8'
        }`}
    >
      {Icon && <Icon size={15} />}
      {children}
      {isActive(href) && (
        <span className="absolute -bottom-[1px] left-2 right-2 h-[2px] bg-primary-500 rounded-full" />
      )}
    </Link>
  );

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b
        ${scrolled
          ? 'bg-[#070d1a]/90 backdrop-blur-xl border-white/10 shadow-lg shadow-black/30'
          : 'bg-transparent border-transparent'
        }`}
    >
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="absolute inset-0 bg-primary-500/30 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 animate-glow" />
              <div className="relative w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Zap size={16} fill="white" />
              </div>
            </div>
            <span className="text-xl font-black text-white tracking-tight font-display">
              QU<span className="text-primary-400">IK</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {user?.role === 'CUSTOMER' && (
              <>
                <NavLink href="/customer/home" icon={Store}>Shop</NavLink>
                <NavLink href="/customer/search" icon={Search}>Search</NavLink>
                <Link
                  href="/customer/cart"
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive('/customer/cart')
                      ? 'text-primary-400 bg-primary-500/10'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                    }`}
                >
                  <ShoppingCart size={15} />
                  Cart
                  {cartCount > 0 && (
                    <span
                      className={`absolute -top-1.5 -right-1 bg-primary-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg shadow-primary-500/50
                        ${cartBounce ? 'animate-[bounce-in_0.5s_ease]' : ''}`}
                    >
                      {cartCount}
                    </span>
                  )}
                  {isActive('/customer/cart') && (
                    <span className="absolute -bottom-[1px] left-2 right-2 h-[2px] bg-primary-500 rounded-full" />
                  )}
                </Link>
              </>
            )}

            {user?.role === 'RETAILER' && (
              <>
                <NavLink href="/retailer/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
                <NavLink href="/retailer/inventory" icon={Package}>Inventory</NavLink>
                <NavLink href="/retailer/orders" icon={ShoppingCart}>Orders</NavLink>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/10">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm text-white/70 hidden sm:block font-medium max-w-[100px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-3">
                <Link href="/auth/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link href="/auth/signup" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
