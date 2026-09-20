export type Diet = 'veg' | 'nonveg';

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  category: string;
  diet: Diet;
  popular?: boolean;
  bestseller?: boolean;
  available: boolean;
  ingredients: string[];
  addOns: AddOn[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Restaurant {
  id: string;
  name: string;
  logoText: string;
  cuisine: string;
  open: boolean;
  rating: number;
  etaMinutes: number;
}

export interface CartLine {
  lineId: string;
  item: MenuItem;
  quantity: number;
  selectedAddOns: AddOn[];
  notes: string;
}

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'served';

export interface Order {
  id: string;
  restaurantId: string;
  table: number;
  customerName: string;
  lines: CartLine[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  status: OrderStatus;
  placedAt: number;
  etaMinutes: number;
}

export const TAX_RATE = 0.05;
export const SERVICE_RATE = 0.08;
