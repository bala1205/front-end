import { useState, useEffect } from 'react';
import {
  Category,
  MenuItem,
  Order,
  CartLine,
  OrderStatus
} from './types';
import {
  getStoredRestaurants,
  getStoredMenu,
  saveStoredMenu,
  getStoredOrders,
  saveStoredOrders,
  INITIAL_CATEGORIES
} from './mockData';
import { ItemDetailModal } from './components/ItemDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { StaffDashboard } from './components/StaffDashboard';

export default function App() {
  // State management backed by localStorage persistence
  const restaurants = getStoredRestaurants();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getStoredMenu());
  const [orders, setOrders] = useState<Order[]>(getStoredOrders());
  const categories: Category[] = INITIAL_CATEGORIES;

  // URL routing & query parameters
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [tableNumber, setTableNumber] = useState<number>(12);
  const [isTableIdentified, setIsTableIdentified] = useState<boolean>(true);

  // Customer UI state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Active tracking order ID if any
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // Parse URL on load and navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    if (tableParam) {
      const parsedTable = parseInt(tableParam, 10);
      if (!isNaN(parsedTable)) {
        setTableNumber(parsedTable);
        setIsTableIdentified(true);
      }
    } else {
      setIsTableIdentified(false);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string, search?: string) => {
    const url = search ? `${path}?${search}` : path;
    window.history.pushState({}, '', url);
    setCurrentPath(path);
    const params = new URLSearchParams(search || '');
    const t = params.get('table');
    if (t) {
      setTableNumber(parseInt(t, 10) || 12);
      setIsTableIdentified(true);
    }
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem, quantity: number, selectedAddOns: any[], notes: string) => {
    const lineId = `${item.id}-${Date.now()}`;
    const newLine: CartLine = {
      lineId,
      item,
      quantity,
      selectedAddOns,
      notes,
    };
    setCart([...cart, newLine]);
  };

  const handleUpdateQuantity = (lineId: string, delta: number) => {
    setCart(
      cart
        .map((line) => {
          if (line.lineId === lineId) {
            const newQ = line.quantity + delta;
            return newQ > 0 ? { ...line, quantity: newQ } : null;
          }
          return line;
        })
        .filter(Boolean) as CartLine[]
    );
  };

  const handleRemoveItem = (lineId: string) => {
    setCart(cart.filter((line) => line.lineId !== lineId));
  };

  const handlePlaceOrder = (customerName: string, _paymentMethod: string): Order => {
    const subtotal = cart.reduce((sum, l) => {
      const addonsSum = l.selectedAddOns.reduce((aSum, a) => aSum + a.price, 0);
      return sum + (l.item.price + addonsSum) * l.quantity;
    }, 0);
    const tax = subtotal * 0.05;
    const serviceCharge = subtotal * 0.08;
    const total = subtotal + tax + serviceCharge;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      restaurantId: restaurants[0].id,
      table: tableNumber,
      customerName,
      lines: [...cart],
      subtotal,
      tax,
      serviceCharge,
      total,
      status: 'received',
      placedAt: Date.now(),
      etaMinutes: 20,
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    saveStoredOrders(updatedOrders);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setActiveOrderId(newOrder.id);
    return newOrder;
  };

  // Staff operations
  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    saveStoredOrders(updated);
  };

  const handleToggleItemAvailability = (itemId: string) => {
    const updated = menuItems.map((m) => (m.id === itemId ? { ...m, available: !m.available } : m));
    setMenuItems(updated);
    saveStoredMenu(updated);
  };

  const handleAddMenuItem = (newItem: MenuItem) => {
    const updated = [newItem, ...menuItems];
    setMenuItems(updated);
    saveStoredMenu(updated);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    const updated = menuItems.filter((m) => m.id !== itemId);
    setMenuItems(updated);
    saveStoredMenu(updated);
  };

  // Router switch
  if (currentPath.startsWith('/staff')) {
    return (
      <StaffDashboard
        restaurants={restaurants}
        categories={categories}
        menuItems={menuItems}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onToggleItemAvailability={handleToggleItemAvailability}
        onAddMenuItem={handleAddMenuItem}
        onDeleteMenuItem={handleDeleteMenuItem}
        onSwitchToCustomer={() => navigateTo('/menu/bistro-central', `table=${tableNumber}`)}
      />
    );
  }

  // Customer UI view
  const activeRestaurant = restaurants[0];
  const filteredMenu = menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet = dietFilter === 'all' || item.diet === dietFilter;
    return matchesCat && matchesSearch && matchesDiet;
  });

  const activeOrder = orders.find((o) => o.id === activeOrderId);
  const totalCartCount = cart.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0f1117] text-gray-100 flex flex-col font-sans selection:bg-amber-500 selection:text-gray-950">
      {/* Top Banner / Navigation for Demo */}
      <div className="bg-gray-950/90 border-b border-gray-800/80 px-4 py-2 text-xs flex justify-between items-center z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
            Smart Dine QR Engine
          </span>
          <span className="text-gray-400 hidden sm:inline">| Scan table QR to order instantly</span>
        </div>
        <div className="flex items-center gap-3">
          {!isTableIdentified && (
            <span className="bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
              ⚠️ Table not detected (Defaulting to #{tableNumber})
            </span>
          )}
          <button
            onClick={() => navigateTo('/staff')}
            className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-extrabold px-3 py-1 rounded-lg transition-all shadow-md"
          >
            👨‍🍳 Open Staff Console
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-md sm:max-w-2xl lg:max-w-4xl w-full mx-auto flex-1 flex flex-col pb-24">
        {/* Restaurant Header */}
        <div className="relative bg-gradient-to-b from-gray-900 to-[#0f1117] p-6 sm:p-8 rounded-b-3xl border-b border-gray-800/80 shadow-2xl mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-gray-950 font-black text-2xl shadow-xl shadow-amber-500/20">
                {activeRestaurant.logoText}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {activeRestaurant.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{activeRestaurant.cuisine}</p>
              </div>
            </div>

            {/* Table Badge */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-4 py-2.5 text-right shadow-inner">
              <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Dining Table</p>
              <p className="text-xl font-black text-white">#{tableNumber}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-gray-800/60 text-xs text-gray-300">
            <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Kitchen Open & Ready
            </span>
            <span className="flex items-center gap-1">⭐ {activeRestaurant.rating} Rating</span>
            <span className="flex items-center gap-1">⚡ ~{activeRestaurant.etaMinutes}m Avg Prep</span>
          </div>
        </div>

        {/* Active Order Banner if placed */}
        {activeOrder && activeOrder.status !== 'served' && (
          <div className="mx-4 sm:mx-0 mb-6 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-spin">🍳</span>
              <div>
                <p className="text-xs font-bold text-amber-400">Order #{activeOrder.id} is Live!</p>
                <p className="text-xs text-gray-300 capitalize">Status: {activeOrder.status} • ETA ~{activeOrder.etaMinutes}m</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedItemForModal(null)} // opens tracking view helper
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all"
            >
              Track Order ↗
            </button>
          </div>
        )}

        {/* Search & Filters */}
        <div className="px-4 sm:px-0 space-y-4 mb-6">
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-500">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search burgers, pizzas, desserts, drinks..."
              className="w-full bg-gray-900/90 border border-gray-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-all shadow-inner placeholder:text-gray-500"
            />
          </div>

          {/* Categories Pill Bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 border-amber-400 text-gray-950 shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Diet Filter */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Diets' },
              { id: 'veg', label: '🌱 Pure Veg Only' },
              { id: 'nonveg', label: '🥩 Non-Veg' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDietFilter(d.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  dietFilter === d.id
                    ? 'bg-gray-800 border-amber-500 text-amber-400'
                    : 'bg-gray-950 border-gray-800/80 text-gray-400 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="px-4 sm:px-0 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {filteredMenu.length === 0 ? (
            <div className="col-span-full bg-gray-900/40 border border-gray-800 rounded-3xl p-16 text-center text-gray-500">
              <span className="text-5xl mb-3 block">🍽️</span>
              <p className="text-lg font-bold text-gray-400">No menu items found</p>
              <p className="text-xs text-gray-600 mt-1">Try searching for something else or changing categories.</p>
            </div>
          ) : (
            filteredMenu.map((item) => (
              <div
                key={item.id}
                onClick={() => item.available && setSelectedItemForModal(item)}
                className={`bg-gray-900/80 border rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all group ${
                  item.available
                    ? 'border-gray-800/80 hover:border-amber-500/60 hover:shadow-2xl cursor-pointer hover:-translate-y-1'
                    : 'border-gray-800 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="relative h-48 sm:h-52 w-full bg-gray-950 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md text-white shadow-md ${
                        item.diet === 'veg' ? 'bg-emerald-600/90' : 'bg-rose-600/90'
                      }`}
                    >
                      {item.diet === 'veg' ? '🌱 Veg' : '🥩 Non-Veg'}
                    </span>
                    {item.bestseller && (
                      <span className="bg-amber-500/90 text-gray-950 font-black px-2.5 py-1 rounded-full text-[10px] shadow-md">
                        🔥 Bestseller
                      </span>
                    )}
                  </div>

                  {!item.available && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-xs">
                      <span className="bg-rose-600 text-white font-black px-4 py-1.5 rounded-full text-xs shadow-lg uppercase tracking-wider">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-amber-400 font-black text-base">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">
                      {item.addOns.length > 0 ? `${item.addOns.length} Customizations` : 'Standard Dish'}
                    </span>
                    <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-xl group-hover:bg-amber-500 group-hover:text-gray-950 transition-all">
                      + Add to Table
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Cart Bar if items in cart */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-gray-950 via-gray-950/95 to-transparent backdrop-blur-md">
          <div className="max-w-md sm:max-w-2xl mx-auto bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 shadow-2xl flex items-center justify-between text-gray-950 font-bold">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-950 text-amber-400 flex items-center justify-center text-sm font-black shadow-inner">
                {totalCartCount}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-900 font-extrabold">Table #{tableNumber} Cart</p>
                <p className="text-lg font-black text-gray-950">
                  ${cart.reduce((sum, l) => sum + (l.item.price + l.selectedAddOns.reduce((a, b) => a + b.price, 0)) * l.quantity, 0).toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-gray-950 hover:bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-extrabold shadow-lg transition-all"
            >
              Review & Checkout ➔
            </button>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      {selectedItemForModal && (
        <ItemDetailModal
          item={selectedItemForModal}
          tableNumber={tableNumber}
          onClose={() => setSelectedItemForModal(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        tableNumber={tableNumber}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          tableNumber={tableNumber}
          subtotal={cart.reduce((s, l) => s + (l.item.price + l.selectedAddOns.reduce((a, b) => a + b.price, 0)) * l.quantity, 0)}
          tax={cart.reduce((s, l) => s + (l.item.price + l.selectedAddOns.reduce((a, b) => a + b.price, 0)) * l.quantity, 0) * 0.05}
          serviceCharge={cart.reduce((s, l) => s + (l.item.price + l.selectedAddOns.reduce((a, b) => a + b.price, 0)) * l.quantity, 0) * 0.08}
          total={cart.reduce((s, l) => s + (l.item.price + l.selectedAddOns.reduce((a, b) => a + b.price, 0)) * l.quantity, 0) * 1.13}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {/* Active Order Tracking Modal overlay if triggered */}
      {activeOrderId && !selectedItemForModal && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <div className="bg-[#14171f] w-full max-w-xl rounded-3xl border border-gray-800 shadow-2xl overflow-hidden my-8">
            <div className="p-4 bg-gray-950 border-b border-gray-800 flex justify-between items-center">
              <span className="text-xs font-bold text-amber-400">Live Order Status Tracker</span>
              <button
                onClick={() => setActiveOrderId(null)}
                className="w-8 h-8 rounded-full bg-gray-900 text-gray-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-2">
              <OrderTrackingView
                order={activeOrder}
                onBackToMenu={() => setActiveOrderId(null)}
                onViewAllOrders={() => {
                  navigateTo('/staff');
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
