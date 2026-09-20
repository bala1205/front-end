# Smart Dine QR Restaurant Ordering Frontend

Smart Dine is a production-quality, responsive QR-based restaurant ordering and table management frontend built with React, TypeScript, Vite, and Tailwind CSS. It provides a seamless self-ordering experience for restaurant guests scanning a table QR code, alongside a comprehensive kitchen & operations dashboard for restaurant staff.

---

## Features

### 📱 Customer Experience (QR Menu)
* **Dynamic Table Detection**: Automatically reads table numbers from QR URLs (`/menu/restaurant-id?table=12`). Falls back gracefully with a clear warning if the parameter is missing.
* **Open/Closed Status & Restaurant Info**: Real-time operating hours, ratings, and preparation time indicators.
* **Search & Categorization**: Instant search across all dishes with category filter pills (Starters, Main Course, Artisan Pizzas, Desserts, Beverages) and dietary toggles (Pure Veg / Non-Veg).
* **Rich Food Cards & Detail View**: High-resolution imagery, pricing, descriptions, bestseller tags, and key ingredient highlights.
* **Advanced Item Customization**: Selectable add-ons, portion adjustments, and special kitchen instructions.
* **Cart & Secure Checkout**: Real-time subtotal calculation with 5% tax and 8% service charge breakdown, guest name input, and multiple payment methods (Credit Card, Apple Pay, Cash/Counter).
* **Live Order Tracking**: Four-state interactive workflow (`Received` → `Preparing` → `Ready` → `Served`) with real-time ETA countdown.

### 👨‍🍳 Staff Experience (Operations Console)
* **Live Orders Dashboard**: Real-time monitoring and status control for active table orders.
* **Menu & Availability Management**: Instantly toggle items out of stock or back in stock, delete items, and add new culinary creations with a custom modal form.
* **Table QR Management**: Grid overview of tables 1 through 16 with one-click QR link generation for customer testing.
* **Analytics & Reports**: Revenue totals, order counts, and performance stats.

---

## Tech Stack
* **Framework**: React 18 with TypeScript
* **Build Tool**: Vite 5
* **Styling**: Tailwind CSS
* **Persistence**: LocalStorage with reactive state synchronization for robust multi-session testing

---

## Project Structure
```text
src/
├── components/
│   ├── CartDrawer.tsx
│   ├── CheckoutModal.tsx
│   ├── ItemDetailModal.tsx
│   ├── OrderTrackingView.tsx
│   └── StaffDashboard.tsx
├── App.tsx
├── index.css
├── main.tsx
├── mockData.ts
└── types.ts
```

---

## Installation & Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Type Check**:
   ```bash
   npm run typecheck
   ```

---

## QR URL Format
Scan or open the following URL format to test a specific table session:
```text
http://localhost:5173/menu/bistro-central?table=12
```

To access the staff operations console:
```text
http://localhost:5173/staff
```

---

## Mock Data & Future API Integration
The application uses an isolated mock repository layer (`src/mockData.ts`) that persists state in `localStorage`. To integrate Firebase, Supabase, or a REST API backend later, simply replace the storage getter/setter functions in `src/mockData.ts` with API fetch calls.
