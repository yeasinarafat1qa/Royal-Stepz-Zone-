export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  priceQAR: number;
  originalPriceQAR?: number;
  image: string;
  images?: string[];
  colors?: string[];
  description: string;
  sizes: string[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  city: string;
  fullAddress: string;
  notes?: string;
  paymentMethod: 'Cash on Delivery' | 'Card on Delivery (POS)' | 'Online Card';
  items: CartItem[];
  subtotalQAR: number;
  deliveryFeeQAR: number;
  totalQAR: number;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export interface StoreSettings {
  whatsappNumber: string;
  deliveryFeeQAR: number;
  freeShippingThresholdQAR: number;
  adminSecurityKey: string;
}

export interface User {
  id: string;
  name: string;
  emailOrPhone: string;
  isAdmin?: boolean;
}
