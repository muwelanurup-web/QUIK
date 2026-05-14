'use client';
import { Clock, ChevronDown } from 'lucide-react';

const STATUS_CONFIG = {
  PENDING:   { label: 'Pending',   cls: 'badge-pending',   icon: '🕐', step: 0 },
  CONFIRMED: { label: 'Confirmed', cls: 'badge-confirmed', icon: '✅', step: 1 },
  SHIPPED:   { label: 'Shipped',   cls: 'badge-shipped',   icon: '🚚', step: 2 },
  DELIVERED: { label: 'Delivered', cls: 'badge-delivered', icon: '🎉', step: 3 },
  CANCELLED: { label: 'Cancelled', cls: 'badge-cancelled', icon: '❌', step: -1 },
};

const TIMELINE = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

export default function OrderCard({ order, onStatusChange, isRetailer }) {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const currentStep = config.step;

  return (
    <div className="glass-card space-y-4 hover:border-white/20 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] text-white/30 font-mono mb-1">ORDER #{String(order.id).slice(-8).toUpperCase()}</p>
          <p className="text-xl font-black text-white font-display">₹{order.totalAmount?.toFixed(2)}</p>
          {isRetailer && order.customer && (
            <p className="text-sm text-white/50 mt-1">
              👤 {order.customer.name}
              <span className="text-white/25 mx-1">·</span>
              {order.customer.email}
            </p>
          )}
          {!isRetailer && order.retailer && (
            <p className="text-sm text-white/50 mt-1">🏪 {order.retailer.shopName}</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <span className={config.cls}>
            {config.icon} {config.label}
          </span>
          <div className="flex items-center gap-1 text-[11px] text-white/25 mt-2 justify-end">
            <Clock size={10} />
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Timeline (only for non-cancelled orders) */}
      {order.status !== 'CANCELLED' && (
        <div className="flex items-center gap-1">
          {TIMELINE.map((status, idx) => {
            const step = STATUS_CONFIG[status].step;
            const done = currentStep >= step;
            const active = currentStep === step;
            return (
              <div key={status} className="flex items-center flex-1 last:flex-none">
                <div className={`flex flex-col items-center gap-1 ${active ? 'scale-110' : ''} transition-transform`}>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-300
                      ${done
                        ? 'border-primary-500 bg-primary-500/20 shadow-md shadow-primary-500/30'
                        : 'border-white/15 bg-white/5'
                      }`}
                  >
                    {STATUS_CONFIG[status].icon}
                  </div>
                  <span className={`text-[9px] font-medium leading-none ${done ? 'text-primary-400' : 'text-white/25'}`}>
                    {STATUS_CONFIG[status].label}
                  </span>
                </div>
                {idx < TIMELINE.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mx-1 rounded-full transition-all duration-500 mb-3.5
                      ${currentStep > step ? 'bg-primary-500' : 'bg-white/10'}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Items list */}
      <div className="border-t border-white/8 pt-3 space-y-1.5">
        {order.items?.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <span className="text-white/65">{item.product?.name} <span className="text-white/35">× {item.quantity}</span></span>
            <span className="text-white/50 font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Retailer status change */}
      {isRetailer && onStatusChange && (
        <div className="pt-1">
          <label className="block text-xs text-white/35 mb-1.5">Update Status</label>
          <div className="relative">
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              className="input text-sm py-2 pr-9 appearance-none cursor-pointer"
            >
              {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                <option key={s} value={s} className="bg-[#111827]">
                  {STATUS_CONFIG[s].icon} {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );
}
