import React, { useState } from 'react';
import { CartLine, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartLine[];
  tableNumber: number;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  onPlaceOrder: (customerName: string, paymentMethod: string) => Order;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  tableNumber,
  subtotal,
  tax,
  serviceCharge,
  total,
  onPlaceOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pay_at_counter' | 'apple_pay'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onPlaceOrder(customerName.trim() || `Table ${tableNumber} Guest`, paymentMethod);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#181b22] w-full max-w-lg rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-950/60">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Complete Your Order</h2>
            <p className="text-xs text-amber-400 font-semibold mt-0.5">Table #{tableNumber} Secure Checkout</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Guest Name / Nickname
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g., Alex Morgan"
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-gray-600"
            />
          </div>

          {/* Order Summary breakdown */}
          <div className="bg-gray-950/50 rounded-xl p-4 border border-gray-800/80 space-y-2 text-xs text-gray-400">
            <div className="flex justify-between font-semibold text-gray-300 pb-2 border-b border-gray-800">
              <span>Items ({cart.reduce((s, l) => s + l.quantity, 0)})</span>
              <span>Subtotal: ${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (5%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Charge (8%)</span>
              <span>${serviceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gray-800">
              <span>Total Payable</span>
              <span className="text-amber-400">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'card', label: 'Credit Card', icon: '💳' },
                { id: 'apple_pay', label: 'Apple Pay', icon: '' },
                { id: 'pay_at_counter', label: 'Cash / Counter', icon: '💵' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === m.id
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-xs font-semibold">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-950 font-extrabold py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-center tracking-wide text-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Placing Order to Kitchen...' : `Confirm & Send to Kitchen ($${total.toFixed(2)})`}
          </button>
        </form>
      </div>
    </div>
  );
};
