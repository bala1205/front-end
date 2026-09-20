import React from 'react';
import { CartLine, TAX_RATE, SERVICE_RATE } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartLine[];
  tableNumber: number;
  onUpdateQuantity: (lineId: string, delta: number) => void;
  onRemoveItem: (lineId: string) => void;
  onProceedToCheckout: (subtotal: number, tax: number, serviceCharge: number, total: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  tableNumber,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, line) => {
    const addonsSum = line.selectedAddOns.reduce((aSum, a) => aSum + a.price, 0);
    return sum + (line.item.price + addonsSum) * line.quantity;
  }, 0);

  const tax = subtotal * TAX_RATE;
  const serviceCharge = subtotal * SERVICE_RATE;
  const total = subtotal + tax + serviceCharge;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#14171f] w-full max-w-md h-full flex flex-col border-l border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950/80">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Your Table Order</h2>
            <p className="text-xs text-amber-400 font-semibold mt-0.5">Table #{tableNumber} QR Session</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-16">
              <span className="text-5xl mb-4">🛒</span>
              <p className="text-lg font-semibold text-gray-400">Your cart is empty</p>
              <p className="text-xs text-gray-600 mt-1 max-w-xs">Explore the menu and add delicious dishes to start your order.</p>
            </div>
          ) : (
            cart.map((line) => {
              const addonsSum = line.selectedAddOns.reduce((s, a) => s + a.price, 0);
              const lineTotal = (line.item.price + addonsSum) * line.quantity;
              return (
                <div
                  key={line.lineId}
                  className="bg-gray-900/80 border border-gray-800/80 rounded-2xl p-4 flex flex-col gap-3 shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <img
                        src={line.item.image}
                        alt={line.item.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-800 flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white leading-snug">{line.item.name}</h4>
                        <span className="text-xs font-semibold text-amber-400">
                          ${(line.item.price + addonsSum).toFixed(2)} each
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(line.lineId)}
                      className="text-gray-500 hover:text-rose-400 text-xs font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Add-ons & Notes */}
                  {(line.selectedAddOns.length > 0 || line.notes) && (
                    <div className="bg-gray-950/60 rounded-xl p-2.5 text-xs text-gray-400 space-y-1">
                      {line.selectedAddOns.map((a) => (
                        <div key={a.id} className="flex justify-between">
                          <span>+ {a.name}</span>
                          <span className="text-gray-500">+${a.price.toFixed(2)}</span>
                        </div>
                      ))}
                      {line.notes && (
                        <p className="italic text-amber-300/80 pt-0.5">Note: "{line.notes}"</p>
                      )}
                    </div>
                  )}

                  {/* Quantity & Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-800/60">
                    <div className="flex items-center bg-gray-950 border border-gray-800 rounded-lg overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(line.lineId, -1)}
                        className="px-3 py-1 text-gray-300 hover:bg-gray-800 font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="px-3 text-white font-bold text-xs">{line.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(line.lineId, 1)}
                        className="px-3 py-1 text-gray-300 hover:bg-gray-800 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-black text-white">${lineTotal.toFixed(2)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 bg-gray-950 border-t border-gray-800 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-200 font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST / Taxes (5%)</span>
                <span className="text-gray-200 font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge (8%)</span>
                <span className="text-gray-200 font-medium">${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-gray-800">
                <span>Total Amount</span>
                <span className="text-amber-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => onProceedToCheckout(subtotal, tax, serviceCharge, total)}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-950 font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-center tracking-wide text-sm"
            >
              Proceed to Checkout (${total.toFixed(2)})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
