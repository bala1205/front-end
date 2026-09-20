import React, { useState } from 'react';
import { MenuItem, AddOn } from '../types';

interface ItemDetailModalProps {
  item: MenuItem;
  tableNumber: number;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, selectedAddOns: AddOn[], notes: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  tableNumber,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [notes, setNotes] = useState('');

  const toggleAddOn = (addon: AddOn) => {
    if (selectedAddOns.some((a) => a.id === addon.id)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = item.price + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(item, quantity, selectedAddOns, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="bg-[#181b22] w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border border-gray-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header Image */}
        <div className="relative h-64 sm:h-72 w-full bg-gray-900">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
            aria-label="Close modal"
          >
            ✕
          </button>
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md text-white shadow-md ${
                item.diet === 'veg' ? 'bg-emerald-600/90' : 'bg-rose-600/90'
              }`}
            >
              {item.diet === 'veg' ? '🌱 Pure Veg' : '🥩 Non-Veg'}
            </span>
            {item.bestseller && (
              <span className="bg-amber-500/90 text-gray-950 font-bold px-3 py-1 rounded-full text-xs shadow-md">
                🔥 Bestseller
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-white tracking-tight">{item.name}</h2>
              <span className="text-2xl font-black text-amber-400">${item.price.toFixed(2)}</span>
            </div>
            <p className="text-gray-300 mt-2 text-sm leading-relaxed">{item.longDescription}</p>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Key Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {item.ingredients.map((ing: string, idx: number) => (
                <span key={idx} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-lg text-xs border border-gray-700/50">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          {item.addOns && item.addOns.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Customizations & Add-ons</h3>
              <div className="space-y-2">
                {item.addOns.map((addon: AddOn) => {
                  const isSelected = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddOn(addon)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-white'
                          : 'bg-gray-950/40 border-gray-800 text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            isSelected ? 'bg-amber-500 border-amber-500 text-gray-950' : 'border-gray-700'
                          }`}
                        >
                          {isSelected && '✓'}
                        </div>
                        <span className="text-sm font-medium">{addon.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-amber-400">+${addon.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Special Instructions</h3>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Less spicy, dressing on the side..."
              className="w-full bg-gray-950/65 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-all placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-6 bg-gray-950 border-t border-gray-800 flex items-center gap-4">
          <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-inner">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors font-bold text-lg"
            >
              -
            </button>
            <span className="px-4 text-white font-bold text-base">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-3 text-gray-300 hover:bg-gray-800 transition-colors font-bold text-lg"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-950 font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-between"
          >
            <span>Add to Table {tableNumber} Cart</span>
            <span>${totalPrice.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
