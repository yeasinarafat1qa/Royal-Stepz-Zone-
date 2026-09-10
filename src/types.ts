// ============================================================
// ROYAL STEPZ ZONE
// Shared Type Definitions
// ============================================================

export type ProductCategory =
  | 'Men'
  | 'Women'
  | 'Kids'
  | 'Running'
  | 'Sneakers'
  | 'Formal'
  | 'Boots'
  | 'Casual'
  | 'Luxury'
  | 'Slides'
  | 'Sports';

export interface Product {
  id: string;

  // Basic information
  name: string;
  category: ProductCategory;
  brand?: string;

  // Pricing
  priceQAR: number;
  originalPriceQAR?: number;

  // Legacy pricing names
  // Kept for compatibility with older Firebase/admin data
  price?: number;
  oldPrice?: number;

  // Images
  image: string;
  images?: string[];

  // Product options
  sizes: string[];
  colors: string[];

  // Description
  description: string;

  // Inventory
  inStock?: boolean;
  stock?: number;

  // Product flags
  featured?: boolean;
  isFeatured?: boolean;

  isNew?: boolean;
  isNewArrival?: boolean;

  isBestseller?: boolean;

  // Reviews
  rating?: number;
  reviewCount?: number;

  // Optional metadata
  createdAt?: string | number;
  updatedAt?: string | number;
}

// ============================================================
// CART
// ============================================================

export interface CartItem {
  product: Product;

  selectedSize: string;
  selectedColor?: string;

  quantity: number;
}

// ============================================================
// ORDER
// ============================================================

export type OrderPaymentMethod =
  | 'Cash on Delivery'
  | 'Card on Delivery'
  | 'Direct QAR Transfer';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Dispatched'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;

  // Customer information
  customerName: string;
  customerPhone: string;

  customerEmail?: string;

  city: string;
  fullAddress: string;
  notes?: string;

  // Order items
  items: CartItem[];

  // Payment
  paymentMethod: OrderPaymentMethod;

  // Amounts
  subtotalQAR: number;
  deliveryFeeQAR: number;
  totalQAR: number;

  // Status
  status: OrderStatus;

  // Dates
  createdAt: string | number;
  updatedAt?: string | number;

  // Device / customer tracking
  deviceId?: string;

  // WhatsApp
  whatsappSent?: boolean;
}

// ============================================================
// USER
// ============================================================

export interface User {
  id: string;

  name: string;

  // Optional because customers can sign in with phone
  // instead of email.
  email?: string;

  phone?: string;

  isAdmin: boolean;

  createdAt?: string | number;
}

// ============================================================
// NOTIFICATIONS
// ============================================================

export type NotificationType =
  | 'order'
  | 'deal'
  | 'system';

export interface NotificationItem {
  id: string;

  title: string;
  message: string;

  timestamp: string | number;

  read: boolean;

  type: NotificationType;

  orderId?: string;

  recipientEmail?: string;

  deviceId?: string;
}

// ============================================================
// STORE SETTINGS
// ============================================================

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

  // Optional legacy fields
  // These prevent errors if older data still exists
  // in Firebase/localStorage.
  supportEmail?: string;

  adminKey?: string;
}
