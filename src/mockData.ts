import { Restaurant, Category, MenuItem, Order } from './types';

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'bistro-central',
    name: 'Bistro Central & Bar',
    logoText: 'BC',
    cuisine: 'Artisan Burgers, Pizza & Crafted Cocktails',
    open: true,
    rating: 4.8,
    etaMinutes: 20
  },
  {
    id: 'urban-spice',
    name: 'Urban Spice Kitchen',
    logoText: 'US',
    cuisine: 'Modern Indian & Tandoor Grill',
    open: true,
    rating: 4.9,
    etaMinutes: 25
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'all', name: 'All Items', icon: '🍽️' },
  { id: 'starters', name: 'Starters', icon: '🥗' },
  { id: 'mains', name: 'Main Course', icon: '🍲' },
  { id: 'pizzas', name: 'Artisan Pizzas', icon: '🍕' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'drinks', name: 'Beverages', icon: '🍹' }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Truffle Parmesan Fries',
    description: 'Crispy hand-cut fries tossed in white truffle oil, aged parmesan, and fresh parsley.',
    longDescription: 'Hand-cut russet potatoes fried to golden perfection, drizzled with luxurious white truffle oil, freshly grated imported Parmigiano-Reggiano, and chopped organic parsley. Served with house garlic aioli.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    category: 'starters',
    diet: 'veg',
    popular: true,
    available: true,
    ingredients: ['Potatoes', 'Truffle Oil', 'Parmesan', 'Parsley', 'Garlic Aioli'],
    addOns: [
      { id: 'ao-1', name: 'Extra Garlic Aioli', price: 1.50 },
      { id: 'ao-2', name: 'Spicy Truffle Mayo', price: 1.50 },
      { id: 'ao-3', name: 'Bacon Bits', price: 2.00 }
    ]
  },
  {
    id: 'item-2',
    name: 'Crispy Calamari',
    description: 'Lightly dusted tender squid rings served with zesty lemon marinara and charred lemon.',
    longDescription: 'Wild-caught fresh squid rings seasoned with Mediterranean herbs, lightly battered and fried crisp. Served with our signature house marinara and fresh lemon wedge.',
    price: 14.50,
    image: 'https://images.unsplash.com/photo-1599487484170-7c1e6650817f?auto=format&fit=crop&w=600&q=80',
    category: 'starters',
    diet: 'nonveg',
    bestseller: true,
    available: true,
    ingredients: ['Calamari', 'Flour', 'Marinara Sauce', 'Lemon', 'Chili Flakes'],
    addOns: [
      { id: 'ao-4', name: 'Extra Marinara', price: 1.50 },
      { id: 'ao-5', name: 'Spicy Arrabiata Dip', price: 1.75 }
    ]
  },
  {
    id: 'item-3',
    name: 'Smoky Wagyu Burger',
    description: 'Double 100% Wagyu beef patties, smoked cheddar, caramelized onions, and secret sauce on a brioche bun.',
    longDescription: 'Juicy American Wagyu beef patties smashed with crisp edges, layered with smoked cheddar, sweet caramelized onions, crisp butter lettuce, vine tomato, and our signature truffle aioli on a toasted butter brioche bun.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    category: 'mains',
    diet: 'nonveg',
    popular: true,
    bestseller: true,
    available: true,
    ingredients: ['Wagyu Beef', 'Smoked Cheddar', 'Caramelized Onions', 'Brioche', 'Truffle Aioli'],
    addOns: [
      { id: 'ao-6', name: 'Add Smoked Bacon', price: 2.50 },
      { id: 'ao-7', name: 'Add Fried Egg', price: 2.00 },
      { id: 'ao-8', name: 'Gluten-Free Bun', price: 1.50 }
    ]
  },
  {
    id: 'item-4',
    name: 'Wild Mushroom Risotto',
    description: 'Arborio rice simmered with wild forest mushrooms, thyme, white wine, and mascarpone cheese.',
    longDescription: 'Slow-cooked Italian Arborio rice infused with porcini mushroom broth, sautéed chanterelle and cremini mushrooms, fresh thyme, splash of dry white wine, finished with rich mascarpone and aged parmesan.',
    price: 21.00,
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80',
    category: 'mains',
    diet: 'veg',
    popular: true,
    available: true,
    ingredients: ['Arborio Rice', 'Wild Mushrooms', 'White Wine', 'Mascarpone', 'Thyme', 'Parmesan'],
    addOns: [
      { id: 'ao-9', name: 'Add Grilled Chicken', price: 5.00 },
      { id: 'ao-10', name: 'Add Seared Tiger Prawns', price: 7.50 }
    ]
  },
  {
    id: 'item-5',
    name: 'Wood-Fired Margherita Pizza',
    description: 'San Marzano tomato sauce, fresh fior di latte mozzarella, basil leaves, and extra virgin olive oil.',
    longDescription: 'Authentic Neapolitan style pizza baked in our 900-degree wood-fired oven. Topped with sweet San Marzano tomato sauce, creamy fior di latte mozzarella from Campania, fresh basil leaves, and a drizzle of estate extra virgin olive oil.',
    price: 16.50,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    category: 'pizzas',
    diet: 'veg',
    bestseller: true,
    available: true,
    ingredients: ['Pizza Dough', 'San Marzano Tomatoes', 'Fior di Latte', 'Fresh Basil', 'EVOO'],
    addOns: [
      { id: 'ao-11', name: 'Add Spicy Salame', price: 3.00 },
      { id: 'ao-12', name: 'Add Wild Arugula', price: 2.00 },
      { id: 'ao-13', name: 'Hot Honey Drizzle', price: 1.50 }
    ]
  },
  {
    id: 'item-6',
    name: 'Truffle Prosciutto Pizza',
    description: 'White garlic cream base, mozzarella, aged prosciutto di Parma, wild arugula, and truffle glaze.',
    longDescription: 'Crispy charred crust layered with a rich garlic cream base, melted mozzarella, top-grade imported Prosciutto di Parma aged 24 months, fresh peppery wild arugula, and finished with a delicate balsamic truffle glaze.',
    price: 20.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    category: 'pizzas',
    diet: 'nonveg',
    popular: true,
    available: true,
    ingredients: ['Dough', 'Garlic Cream', 'Mozzarella', 'Prosciutto di Parma', 'Arugula', 'Balsamic Glaze'],
    addOns: [
      { id: 'ao-14', name: 'Extra Prosciutto', price: 4.00 },
      { id: 'ao-15', name: 'Burrata Cheese Ball', price: 4.50 }
    ]
  },
  {
    id: 'item-7',
    name: 'Molten Lava Chocolate Cake',
    description: 'Warm dark chocolate cake with a gooey flowing center, served with Madagascar vanilla bean gelato.',
    longDescription: 'Decadent Valrhona dark chocolate cake baked to order with a molten fudge center that flows upon cutting. Served alongside a scoop of artisan Madagascar vanilla bean gelato and fresh mint.',
    price: 9.50,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    category: 'desserts',
    diet: 'veg',
    bestseller: true,
    available: true,
    ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Vanilla Gelato'],
    addOns: [
      { id: 'ao-16', name: 'Extra Vanilla Gelato Scoop', price: 3.00 },
      { id: 'ao-17', name: 'Warm Salted Caramel', price: 1.50 }
    ]
  },
  {
    id: 'item-8',
    name: 'Signature Passionfruit Mojito',
    description: 'Fresh mint leaves, lime juice, passionfruit puree, cane sugar, and sparkling club soda.',
    longDescription: 'Muddled fresh mint and tart limes combined with exotic tropical passionfruit puree, pure cane sugar, and topped with crisp chilled club soda. (Can be ordered with premium white rum upon request).',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    category: 'drinks',
    diet: 'veg',
    popular: true,
    available: true,
    ingredients: ['Fresh Mint', 'Lime', 'Passionfruit Puree', 'Cane Sugar', 'Club Soda'],
    addOns: [
      { id: 'ao-18', name: 'Add White Rum Shot', price: 4.00 },
      { id: 'ao-19', name: 'Extra Mint', price: 0.75 }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    restaurantId: 'bistro-central',
    table: 12,
    customerName: 'Alex Morgan',
    lines: [
      {
        lineId: 'line-1',
        item: INITIAL_MENU_ITEMS[2],
        quantity: 2,
        selectedAddOns: [INITIAL_MENU_ITEMS[2].addOns[0]],
        notes: 'Medium well please'
      },
      {
        lineId: 'line-2',
        item: INITIAL_MENU_ITEMS[0],
        quantity: 1,
        selectedAddOns: [],
        notes: ''
      }
    ],
    subtotal: 46.97,
    tax: 2.35,
    serviceCharge: 3.76,
    total: 53.08,
    status: 'preparing',
    placedAt: Date.now() - 1000 * 60 * 12,
    etaMinutes: 18
  },
  {
    id: 'ORD-9818',
    restaurantId: 'bistro-central',
    table: 4,
    customerName: 'Sarah Jenkins',
    lines: [
      {
        lineId: 'line-3',
        item: INITIAL_MENU_ITEMS[4],
        quantity: 1,
        selectedAddOns: [INITIAL_MENU_ITEMS[4].addOns[2]],
        notes: 'Extra crispy crust'
      }
    ],
    subtotal: 18.00,
    tax: 0.90,
    serviceCharge: 1.44,
    total: 20.34,
    status: 'ready',
    placedAt: Date.now() - 1000 * 60 * 25,
    etaMinutes: 5
  }
];

// LocalStorage helpers with reactive state sync
const STORAGE_KEYS = {
  MENU: 'smart_dine_menu_v1',
  ORDERS: 'smart_dine_orders_v1',
  RESTAURANTS: 'smart_dine_restaurants_v1'
};

export const getStoredRestaurants = (): Restaurant[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(INITIAL_RESTAURANTS));
  return INITIAL_RESTAURANTS;
};

export const saveStoredRestaurants = (restaurants: Restaurant[]) => {
  localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
};

export const getStoredMenu = (): MenuItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MENU);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU_ITEMS));
  return INITIAL_MENU_ITEMS;
};

export const saveStoredMenu = (items: MenuItem[]) => {
  localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
};

export const getStoredOrders = (): Order[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (stored) return JSON.parse(stored);
  } catch (e) { console.error(e); }
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  return INITIAL_ORDERS;
};

export const saveStoredOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};
