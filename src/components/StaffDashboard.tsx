import { useState } from 'react';
import { Restaurant, Category, MenuItem, Order, OrderStatus } from '../types';

interface StaffDashboardProps {
  restaurants: Restaurant[];
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onToggleItemAvailability: (itemId: string) => void;
  onAddMenuItem: (newItem: MenuItem) => void;
  onDeleteMenuItem: (itemId: string) => void;
  onSwitchToCustomer: () => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  restaurants,
  categories,
  menuItems,
  orders,
  onUpdateOrderStatus,
  onToggleItemAvailability,
  onAddMenuItem,
  onDeleteMenuItem,
  onSwitchToCustomer,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'tables' | 'stats'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(categories[1]?.id || 'starters');
  const [newItemDiet, setNewItemDiet] = useState<'veg' | 'nonveg'>('veg');
  const [newItemImage, setNewItemImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80');

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  const filteredMenu = menuItems.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'all' || m.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    const item: MenuItem = {
      id: `item-${Date.now()}`,
      name: newItemName,
      description: newItemDesc || 'Delicious freshly prepared dish.',
      longDescription: newItemDesc || 'Freshly prepared with top-quality ingredients by our expert chefs.',
      price: parseFloat(newItemPrice) || 12.99,
      image: newItemImage,
      category: newItemCategory,
      diet: newItemDiet,
      available: true,
      ingredients: ['Chef Selection', 'Fresh Herbs', 'Seasoning'],
      addOns: [
        { id: `ao-${Date.now()}-1`, name: 'Extra Portion', price: 3.00 }
      ]
    };
    onAddMenuItem(item);
    setIsAddingNew(false);
    setNewItemName('');
    setNewItemDesc('');
    setNewItemPrice('');
  };

  const activeRest = restaurants[0];

  return (
    <div className="min-h-screen bg-[#0b0d12] text-gray-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-gray-950 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-gray-950 font-black text-lg shadow-lg shadow-amber-500/20">
            {activeRest.logoText}
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              {activeRest.name}
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Staff Operations Console
              </span>
            </h1>
            <p className="text-xs text-gray-400">Manage live orders, table QR sessions, and menu inventory.</p>
          </div>
        </div>

        <button
          onClick={onSwitchToCustomer}
          className="bg-gray-900 hover:bg-gray-800 border border-gray-700 text-amber-400 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          <span>📱 Preview Customer QR View</span>
        </button>
      </header>

      {/* Navigation Subbar */}
      <div className="bg-gray-950/80 border-b border-gray-800 px-6 flex gap-2">
        {[
          { id: 'orders', label: `Live Orders (${orders.filter(o => o.status !== 'served').length})`, icon: '📋' },
          { id: 'menu', label: `Menu & Availability (${menuItems.length})`, icon: '🍲' },
          { id: 'tables', label: 'Table QR Management', icon: '🪑' },
          { id: 'stats', label: 'Analytics & Reports', icon: '📊' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-3.5 px-5 text-sm font-bold border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-amber-500 text-amber-400 bg-amber-500/5'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-white">Live Kitchen & Table Orders</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Orders' },
                  { id: 'received', label: 'Received' },
                  { id: 'preparing', label: 'Preparing' },
                  { id: 'ready', label: 'Ready' },
                  { id: 'served', label: 'Served' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOrderStatusFilter(f.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      orderStatusFilter === f.id
                        ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20'
                        : 'bg-gray-900 border border-gray-800 text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-16 text-center text-gray-500">
                <span className="text-5xl mb-3 block">🛎️</span>
                <p className="text-lg font-bold text-gray-400">No orders matching this filter</p>
                <p className="text-xs text-gray-600 mt-1">New QR orders placed by customers will appear here instantly in real time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => {
                  return (
                    <div
                      key={order.id}
                      className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden"
                    >
                      {/* Top status stripe */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                            Table #{order.table}
                          </span>
                          <h3 className="text-xl font-black text-white mt-2">{order.id}</h3>
                          <p className="text-xs text-gray-400">Guest: <strong className="text-gray-200">{order.customerName}</strong></p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.status === 'received'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : order.status === 'preparing'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : order.status === 'ready'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Items list */}
                      <div className="space-y-2 my-4 py-3 border-y border-gray-800/80 max-h-48 overflow-y-auto">
                        {order.lines.map((l) => {
                          const addOnsSum = l.selectedAddOns.reduce((s, a) => s + a.price, 0);
                          return (
                            <div key={l.lineId} className="text-xs flex justify-between items-start gap-2">
                              <div>
                                <span className="font-bold text-amber-400">{l.quantity}x</span>{' '}
                                <span className="text-gray-200 font-medium">{l.item.name}</span>
                                {l.notes && <p className="text-[11px] italic text-gray-400 pl-4">"{l.notes}"</p>}
                              </div>
                              <span className="text-gray-400 font-semibold">
                                ${((l.item.price + addOnsSum) * l.quantity).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center mb-4 text-xs">
                        <span className="text-gray-400">Total Amount:</span>
                        <span className="text-base font-black text-amber-400">${order.total.toFixed(2)}</span>
                      </div>

                      {/* Status control buttons */}
                      <div className="space-y-2">
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Update Status:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {(['received', 'preparing', 'ready', 'served'] as OrderStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => onUpdateOrderStatus(order.id, st)}
                              className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all ${
                                order.status === st
                                  ? 'bg-amber-500 text-gray-950 shadow-md font-black'
                                  : 'bg-gray-950 border border-gray-800 text-gray-300 hover:border-gray-700'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MENU TAB */}
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Menu & Item Availability Management</h2>
                <p className="text-xs text-gray-400">Instantly toggle items out of stock or add new culinary masterpieces.</p>
              </div>
              <button
                onClick={() => setIsAddingNew(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-sm"
              >
                + Add New Menu Item
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-900/60 p-4 rounded-2xl border border-gray-800">
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search menu items..."
                className="w-full sm:w-80 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCategoryFilter === cat.id
                        ? 'bg-amber-500 text-gray-950 shadow-md'
                        : 'bg-gray-950 border border-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className={`bg-gray-900/80 border rounded-3xl p-5 flex flex-col justify-between shadow-xl transition-all ${
                    item.available ? 'border-gray-800' : 'border-rose-900/50 opacity-75'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-gray-800 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-bold text-white truncate">{item.name}</h4>
                        <span className="text-amber-400 font-black text-sm">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">{item.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.diet === 'veg' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-rose-600/20 text-rose-400'}`}>
                          {item.diet === 'veg' ? 'Veg' : 'Non-Veg'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 uppercase">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-800 flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        item.available ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {item.available ? '● Available' : '○ Out of Stock'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onToggleItemAvailability(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          item.available
                            ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {item.available ? 'Mark Out of Stock' : 'Make Available'}
                      </button>
                      <button
                        onClick={() => onDeleteMenuItem(item.id)}
                        className="px-2.5 py-1.5 bg-gray-950 hover:bg-rose-950 text-gray-400 hover:text-rose-400 border border-gray-800 rounded-xl text-xs font-bold transition-all"
                        title="Delete item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABLES TAB */}
        {activeTab === 'tables' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white">Table QR Code Generation & Management</h2>
            <p className="text-xs text-gray-400">Scan or share table QR URLs for instant customer self-ordering.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((tableNum) => {
                const qrUrl = `/menu/${activeRest.id}?table=${tableNum}`;
                const activeTableOrders = orders.filter((o) => o.table === tableNum && o.status !== 'served');

                return (
                  <div
                    key={tableNum}
                    className="bg-gray-900 border border-gray-800 rounded-3xl p-5 flex flex-col items-center text-center shadow-xl hover:border-amber-500/50 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl font-black text-amber-400 mb-3 group-hover:scale-105 transition-transform">
                      #{tableNum}
                    </div>
                    <h3 className="text-sm font-bold text-white">Table {tableNum}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {activeTableOrders.length > 0 ? (
                        <span className="text-amber-400 font-semibold">● {activeTableOrders.length} Active Order</span>
                      ) : (
                        <span className="text-emerald-400">○ Ready / Idle</span>
                      )}
                    </p>

                    <a
                      href={qrUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 w-full bg-gray-950 hover:bg-amber-500 hover:text-gray-950 text-gray-300 border border-gray-800 text-xs font-bold py-2 rounded-xl transition-all block shadow-sm"
                    >
                      Open QR Link ↗
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white">Analytics & Revenue Operations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Today Total Revenue', value: '$1,248.50', change: '+18.4%', icon: '💰' },
                { label: 'Total Orders Placed', value: orders.length + 42, change: '+12 today', icon: '📋' },
                { label: 'Average Table Turnaround', value: '24 mins', change: '-3 mins', icon: '⚡' },
                { label: 'Customer Satisfaction', value: '4.9 / 5.0', change: '98% positive', icon: '⭐' },
              ].map((s, idx) => (
                <div key={idx} className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">{s.icon}</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      {s.change}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">{s.label}</h4>
                  <p className="text-2xl font-black text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add New Item Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#181b22] w-full max-w-lg rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-950">
              <h3 className="text-lg font-bold text-white">Add New Menu Masterpiece</h3>
              <button onClick={() => setIsAddingNew(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateNewItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g., Truffle Lobster Pasta"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="19.99"
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Dietary Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="diet"
                      checked={newItemDiet === 'veg'}
                      onChange={() => setNewItemDiet('veg')}
                    />
                    Pure Veg
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name="diet"
                      checked={newItemDiet === 'nonveg'}
                      onChange={() => setNewItemDiet('nonveg')}
                    />
                    Non-Veg
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Appetizing description..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newItemImage}
                  onChange={(e) => setNewItemImage(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-950 font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-sm mt-4"
              >
                Save & Publish to Live Menu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
