import React from 'react';
import { Order } from '../types';

interface OrderTrackingViewProps {
  order: Order;
  onBackToMenu: () => void;
  onViewAllOrders: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  order,
  onBackToMenu,
  onViewAllOrders,
}) => {
  const steps: { id: Order['status']; label: string; desc: string; icon: string }[] = [
    { id: 'received', label: 'Order Received', desc: 'Kitchen acknowledged order', icon: '📝' },
    { id: 'preparing', label: 'Preparing', desc: 'Chef is crafting your dishes', icon: '🍳' },
    { id: 'ready', label: 'Ready to Serve', desc: 'Heading to your table', icon: '🛎️' },
    { id: 'served', label: 'Served', desc: 'Enjoy your meal!', icon: '✨' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === order.status);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <span className="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-4">
          Live Order Tracker • Table #{order.table}
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Order #{order.id}</h1>
        <p className="text-gray-400 text-sm mt-1">Placed for <strong className="text-white">{order.customerName}</strong></p>

        {/* ETA badge */}
        <div className="mt-6 inline-flex items-center gap-3 bg-gray-950/80 border border-gray-800 px-6 py-3 rounded-2xl shadow-inner">
          <span className="text-2xl">⏳</span>
          <div className="text-left">
            <p className="text-xs text-gray-400">Estimated Kitchen Time</p>
            <p className="text-sm font-bold text-amber-400">{order.etaMinutes} Minutes Remaining</p>
          </div>
        </div>
      </div>

      {/* Timeline progress steps */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">Kitchen Status Workflow</h3>

        <div className="space-y-6 relative">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = step.id === order.status;

            return (
              <div key={step.id} className="flex items-start gap-4 relative">
                {idx < steps.length - 1 && (
                  <div
                    className={`absolute left-5 top-10 w-0.5 h-12 transition-colors ${
                      idx < currentStepIndex ? 'bg-amber-500' : 'bg-gray-800'
                    }`}
                  />
                )}

                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg z-10 border transition-all ${
                    isCurrent
                      ? 'bg-amber-500 border-amber-400 text-gray-950 shadow-lg shadow-amber-500/30 scale-110 font-bold'
                      : isCompleted
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                      : 'bg-gray-950 border-gray-800 text-gray-600'
                  }`}
                >
                  {isCompleted && !isCurrent ? '✓' : step.icon}
                </div>

                <div className="flex-1 pt-1">
                  <h4 className={`text-base font-bold ${isCurrent ? 'text-amber-400' : isCompleted ? 'text-white' : 'text-gray-500'}`}>
                    {step.label}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">{step.desc}</p>
                </div>

                {isCurrent && (
                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full animate-pulse self-center">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ordered items breakdown */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Order Items Summary</h3>
        <div className="space-y-3">
          {order.lines.map((line) => {
            const addOnsSum = line.selectedAddOns.reduce((s, a) => s + a.price, 0);
            return (
              <div key={line.lineId} className="flex items-center justify-between py-2 border-b border-gray-800/60 text-sm">
                <div className="flex items-center gap-3">
                  <span className="bg-gray-800 text-amber-400 font-bold px-2.5 py-1 rounded-lg text-xs">
                    {line.quantity}x
                  </span>
                  <div>
                    <span className="text-white font-medium">{line.item.name}</span>
                    {line.notes && <p className="text-xs italic text-gray-400">"{line.notes}"</p>}
                  </div>
                </div>
                <span className="font-bold text-gray-200">
                  ${((line.item.price + addOnsSum) * line.quantity).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-between items-center text-sm font-bold text-white border-t border-gray-800">
          <span>Total Paid</span>
          <span className="text-amber-400 text-lg">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Navigation actions */}
      <div className="flex gap-4 pt-2">
        <button
          onClick={onBackToMenu}
          className="flex-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-white font-bold py-3.5 rounded-xl transition-all text-center text-sm"
        >
          ← Back to Menu
        </button>
        <button
          onClick={onViewAllOrders}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-950 font-extrabold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-center text-sm"
        >
          View All Table Orders
        </button>
      </div>
    </div>
  );
};
