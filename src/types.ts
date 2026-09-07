export interface Product {
  id: string;
  name: string;
  category: 'Sneakers' | 'Running' | 'Formal' | 'Loafers' | 'Slides & Sandals' | 'Limited Edition';
  priceQAR: number;
  originalPriceQAR?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  isBestSeller?: boolean;
  isDeal?: boolean;
  badge?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  fullAddress: string;
  notes?: string;
  paymentMethod: 'Cash on Delivery' | 'Card on Delivery' | 'Direct QAR Transfer';
  items: CartItem[];
  subtotalQAR: number;
  deliveryFeeQAR: number;
  totalQAR: number;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  createdAt: string;
  customerEmail?: string;
  whatsappSent: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'deal' | 'system';
  orderId?: string;
}

export interface StoreSettings {
  whatsappNumber: string;
  storeName: string;
  storeAddress: string;
  supportEmail: string;
  currency: string;
  freeShippingThresholdQAR: number;
}
