export interface Product {
  id: string;
  name: string;
  category: 'Men' | 'Women' | 'Running' | 'Sneakers' | 'Formal' | 'Boots';
  priceQAR: number;
  originalPriceQAR?: number;
  image: string;
  images?: string[];
  sizes: string[];
  colors: string[];
  description: string;
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
  brand?: string;
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
  deviceId?: string;
  whatsappSent?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
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
  recipientEmail?: string;
  deviceId?: string;
}

export interface StoreSettings {
  storeName: string;
  currency: string;
  whatsappNumber: string;
  adminEmail: string;
  deliveryFeeQAR: number;
  freeShippingThresholdQAR: number;
  bannerAnnouncement: string;
  heroTitle: string;
  heroSubtitle: string;
}
