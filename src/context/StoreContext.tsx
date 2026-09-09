import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, User, StoreSettings, NotificationItem } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Default initial store settings (Self-contained)
const defaultInitialSettings: StoreSettings = {
  storeName: 'Royal Stepz Zone Qatar',
  currency: 'QAR',
  deliveryFeeQAR: 25,
  freeShippingThresholdQAR: 300,
  whatsappNumber: '+974 5555 1234',
  supportEmail: 'support@royalstepz.qa',
  adminKey: 'admin123',
};

// Default initial products (Self-contained)
const defaultInitialProducts: Product[] = [
  {
    id: 'shoe-1',
    name: 'Air Jordan 1 Retro High OG "Chicago"',
    brand: 'Nike',
    category: 'Sneakers',
    priceQAR: 650,
    originalPriceQAR: 850,
    sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80',
    description: 'Iconic Chicago colorway silhouette designed with premium leather and legendary Nike Air cushioning for maximum Qatar streetwear prestige.',
    rating: 4.9,
    reviewCount: 128,
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
  },
  {
    id: 'shoe-2',
    name: 'Yeezy Boost 350 V2 "Onyx"',
    brand: 'Adidas',
    category: 'Sneakers',
    priceQAR: 720,
    originalPriceQAR: 900,
    sizes: ['EU 41', 'EU 42', 'EU 43', 'EU 44'],
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80',
    description: 'Triple black Primeknit upper with full-length Boost sole technology providing exceptional walking comfort in Doha heat.',
    rating: 4.8,
    reviewCount: 95,
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: 'shoe-3',
    name: 'Nike Dunk Low Retro "Panda"',
    brand: 'Nike',
    category: 'Casual',
    priceQAR: 420,
    originalPriceQAR: 520,
    sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    description: 'Classic monochrome black and white Dunk Low styling perfect for daily lifestyle comfort and easy outfit pairing.',
    rating: 4.9,
    reviewCount: 210,
    isFeatured: true,
    isBestseller: true,
  },
  {
    id: 'shoe-4',
    name: 'New Balance 9060 "Sea Salt"',
    brand: 'New Balance',
    category: 'Running',
    priceQAR: 580,
    originalPriceQAR: 690,
    sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43'],
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80',
    description: 'Futuristic chunky aesthetic with ABZORB and SBS cushioning engineered for all-day cushioning and luxury lifestyle.',
    rating: 4.7,
    reviewCount: 64,
    isNewArrival: true,
  }
];

// Standalone local device ID generator
const getDeviceId = (): string => {
  if (typeof window === 'undefined') return 'server_device';
  let devId = localStorage.getItem('rsz_device_id');
  if (!devId) {
    devId = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem('rsz_device_id', devId);
  }
  return devId;
};

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  notifications: NotificationItem[];
  user: User | null;
  settings: StoreSettings;
  selectedCategory: string;
  selectedBrand: string;
  searchQuery: string;
  isCartOpen: boolean;
  isAuthOpen: boolean;
  isAdminOpen: boolean;
  isOrderConfirmModalOpen: boolean;
  isNotificationsOpen: boolean;
  targetCheckoutItem: CartItem | null;
  lastConfirmedOrder: Order | null;
  setSelectedCategory: (category: string) => void;
  setSelectedBrand: (brand: string) => void;
  setSearchQuery: (query: string) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  setIsAuthOpen: (isOpen: boolean) => void;
  setIsAdminOpen: (isOpen: boolean) => void;
  setIsOrderConfirmModalOpen: (isOpen: boolean) => void;
  setIsNotificationsOpen: (isOpen: boolean) => void;
  setTargetCheckoutItem: (item: CartItem | null) => void;
  setLastConfirmedOrder: (order: Order | null) => void;
  addToCart: (product: Product, size: string, color?: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  login: (phoneOrEmail: string, role?: 'admin' | 'customer', adminKey?: string) => boolean;
  logout: () => void;
  placeOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    city: string;
    fullAddress: string;
    notes?: string;
    paymentMethod: Order['paymentMethod'];
    items: CartItem[];
  }) => { order: Order; whatsappUrl: string };
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  editOrder: (
    orderId: string, 
    updatedFields: Partial<Omit<Order, 'id' | 'orderNumber' | 'createdAt'>>
  ) => void;
  deleteOrder: (orderId: string) => void;
  sendCustomerNotification: (notification: {
    title: string;
    message: string;
    type?: 'order' | 'deal' | 'system';
    recipientEmail?: string;
    deviceId?: string;
    orderId?: string;
  }) => void;
  deleteNotification: (notificationId: string) => void;
  updateNotification: (notificationId: string, title: string, message: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Local Storage Keys
const PRODUCTS_KEY = 'rsz_products_v3';
const CART_KEY = 'rsz_cart_v3';
const ORDERS_KEY = 'rsz_orders_v3';
const NOTIFICATIONS_KEY = 'rsz_notifications_v3';
const USER_KEY = 'rsz_user_v3';
const SETTINGS_KEY = 'rsz_settings_v3';
const MY_ORDER_IDS_KEY = 'rsz_my_order_ids';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const local = localStorage.getItem(PRODUCTS_KEY);
      return local ? JSON.parse(local) : defaultInitialProducts;
    } catch {
      return defaultInitialProducts;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const local = localStorage.getItem(CART_KEY);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const local = localStorage.getItem(ORDERS_KEY);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const local = localStorage.getItem(NOTIFICATIONS_KEY);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });

  // User
  const [user, setUser] = useState<User | null>(() => {
    try {
      const local = localStorage.getItem(USER_KEY);
      return local ? JSON.parse(local) : null;
    } catch {
      return null;
    }
  });

  // Store Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const local = localStorage.getItem(SETTINGS_KEY);
      return local ? JSON.parse(local) : defaultInitialSettings;
    } catch {
      return defaultInitialSettings;
    }
  });

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isOrderConfirmModalOpen, setIsOrderConfirmModalOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [targetCheckoutItem, setTargetCheckoutItem] = useState<CartItem | null>(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [notifications]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [settings]);

  // Real-time Firestore Sync for Products
  useEffect(() => {
    try {
      const productsRef = collection(db, 'products');
      const unsubscribe = onSnapshot(
        productsRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudProducts = snapshot.docs.map(d => d.data() as Product);
            setProducts(cloudProducts);
          } else {
            defaultInitialProducts.forEach(prod => {
              setDoc(doc(db, 'products', prod.id), prod).catch(() => {});
            });
          }
        },
        () => {}
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Real-time Firestore Sync for Orders
  useEffect(() => {
    try {
      const ordersRef = collection(db, 'orders');
      const unsubscribe = onSnapshot(
        ordersRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudOrders = snapshot.docs.map(d => d.data() as Order);
            cloudOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(cloudOrders);
          }
        },
        () => {}
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Real-time Firestore Sync for Notifications
  useEffect(() => {
    try {
      const notifsRef = collection(db, 'notifications');
      const unsubscribe = onSnapshot(
        notifsRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const cloudNotifs = snapshot.docs.map(d => d.data() as NotificationItem);
            setNotifications(prev => {
              const map = new Map<string, NotificationItem>();
              cloudNotifs.forEach(n => map.set(n.id, n));
              prev.forEach(n => {
                if (!map.has(n.id)) {
                  map.set(n.id, n);
                }
              });
              const merged = Array.from(map.values());
              merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
              return merged;
            });
          }
        },
        () => {}
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Real-time Firestore Sync for Settings
  useEffect(() => {
    try {
      const settingsRef = collection(db, 'settings');
      const unsubscribe = onSnapshot(
        settingsRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const generalDoc = snapshot.docs.find(d => d.id === 'general');
            if (generalDoc) {
              setSettings(generalDoc.data() as StoreSettings);
            }
          } else {
            setDoc(doc(db, 'settings', 'general'), defaultInitialSettings).catch(() => {});
          }
        },
        () => {}
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Cart Management
  const addToCart = (product: Product, size: string, color?: string) => {
    setCart(prev => {
      const existing = prev.find(
        item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.selectedSize === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Auth Management
  const login = (phoneOrEmail: string, role: 'admin' | 'customer' = 'customer', adminKey?: string): boolean => {
    if (role === 'admin') {
      if (adminKey === 'admin123' || adminKey === 'royal2025' || adminKey === 'doha2025') {
        const adminUser: User = {
          id: 'admin-1',
          name: 'Store Administrator (Qatar)',
          email: phoneOrEmail.includes('@') ? phoneOrEmail : 'admin@royalstepz.qa',
          phone: phoneOrEmail.includes('@') ? '+974 5555 1234' : phoneOrEmail,
          isAdmin: true,
        };
        setUser(adminUser);
        setIsAuthOpen(false);
        setIsAdminOpen(true);
        return true;
      }
      return false;
    }

    const customerUser: User = {
      id: 'cust-' + Date.now(),
      name: phoneOrEmail.split('@')[0] || 'Royal Stepz Customer',
      email: phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
      phone: !phoneOrEmail.includes('@') ? phoneOrEmail : undefined,
      isAdmin: false,
    };
    setUser(customerUser);
    setIsAuthOpen(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAdminOpen(false);
  };

  // Order Placement
  const placeOrder = ({
    customerName,
    customerPhone,
    city,
    fullAddress,
    notes,
    paymentMethod,
    items,
  }: {
    customerName: string;
    customerPhone: string;
    city: string;
    fullAddress: string;
    notes?: string;
    paymentMethod: Order['paymentMethod'];
    items: CartItem[];
  }): { order: Order; whatsappUrl: string } => {
    const subtotal = items.reduce((acc, item) => acc + item.product.priceQAR * item.quantity, 0);
    const deliveryFee = subtotal >= settings.freeShippingThresholdQAR ? 0 : 25;
    const total = subtotal + deliveryFee;

    const orderNumber = 'RSZ-QA-' + Math.floor(1000 + Math.random() * 9000);
    const orderId = 'ord-' + Date.now();
    const currentDeviceId = getDeviceId();

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerName,
      customerPhone,
      customerEmail: user?.email,
      deviceId: currentDeviceId,
      city,
      fullAddress,
      notes,
      paymentMethod,
      items,
      subtotalQAR: subtotal,
      deliveryFeeQAR: deliveryFee,
      totalQAR: total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    setLastConfirmedOrder(newOrder);

    // Save order ID to local storage for persistent guest tracking
    try {
      const raw = localStorage.getItem(MY_ORDER_IDS_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(newOrder.id)) {
        list.push(newOrder.id);
      }
      if (!list.includes(newOrder.orderNumber)) {
        list.push(newOrder.orderNumber);
      }
      localStorage.setItem(MY_ORDER_IDS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn(e);
    }

    setDoc(doc(db, 'orders', newOrder.id), JSON.parse(JSON.stringify(newOrder))).catch(() => {});

    // Create Notification for Customer
    const customerNotification: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: `Order Received #${orderNumber}`,
      message: `Your order for ${items.length} item(s) has been placed successfully! 24h Express Delivery across Qatar. Total: QAR ${total}`,
      type: 'order',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      recipientEmail: user?.email,
      deviceId: currentDeviceId,
      orderId: newOrder.id,
    };
    setNotifications(prev => [customerNotification, ...prev]);

    setDoc(doc(db, 'notifications', customerNotification.id), JSON.parse(JSON.stringify(customerNotification))).catch(() => {});

    if (!targetCheckoutItem) {
      clearCart();
    }

    const itemsList = items
      .map(i => `• ${i.quantity}x ${i.product.name} (Size: ${i.selectedSize}) - QAR ${i.product.priceQAR * i.quantity}`)
      .join('\n');

    const message = `🛍️ *NEW FOOTWEAR ORDER - ROYAL STEPZ ZONE QATAR*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *Order Number:* #${orderNumber}\n` +
      `👤 *Customer Name:* ${customerName}\n` +
      `📱 *Mobile / WhatsApp:* ${customerPhone}\n` +
      `📍 *Location:* ${city}, Qatar\n` +
      `🏠 *Delivery Address:* ${fullAddress}\n` +
      (notes ? `📝 *Notes:* ${notes}\n` : '') +
      `💳 *Payment Method:* ${paymentMethod}\n\n` +
      `👟 *Ordered Items:*\n${itemsList}\n\n` +
      `💰 *Subtotal:* QAR ${subtotal}\n` +
      `🚚 *Qatar Courier:* ${deliveryFee === 0 ? 'FREE' : `QAR ${deliveryFee}`}\n` +
      `💎 *Grand Total Payable:* QAR ${total}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `⚡ *Delivery Window:* Within 24 Hours Express Qatar Delivery`;

    const cleanAdminPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanAdminPhone}?text=${encodeURIComponent(message)}`;

    return { order: newOrder, whatsappUrl };
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order => (order.id === orderId ? { ...order, status } : order))
    );

    updateDoc(doc(db, 'orders', orderId), { status }).catch(() => {});
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const updatedStatus: Order['status'] = 'Cancelled';
    const cancellationNote = reason
      ? `Cancelled: ${reason}`
      : 'Order cancelled by customer request.';

    setOrders(prev =>
      prev.map(o =>
        o.id === orderId
          ? {
              ...o,
              status: updatedStatus,
              notes: o.notes ? `${o.notes} | ${cancellationNote}` : cancellationNote,
            }
          : o
      )
    );

    updateDoc(doc(db, 'orders', orderId), {
      status: updatedStatus,
      notes: targetOrder.notes ? `${targetOrder.notes} | ${cancellationNote}` : cancellationNote,
    }).catch(() => {});

    const cancelNotif: NotificationItem = {
      id: 'notif-cancel-' + Date.now(),
      title: `Order #${targetOrder.orderNumber} Cancelled`,
      message: `Your order #${targetOrder.orderNumber} has been successfully cancelled. ${reason ? `Reason: ${reason}` : ''}`,
      type: 'order',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      recipientEmail: targetOrder.customerEmail,
      deviceId: targetOrder.deviceId || getDeviceId(),
    };
    setNotifications(prev => [cancelNotif, ...prev]);

    setDoc(doc(db, 'notifications', cancelNotif.id), JSON.parse(JSON.stringify(cancelNotif))).catch(() => {});
  };

  const editOrder = (
    orderId: string, 
    updatedFields: Partial<Omit<Order, 'id' | 'orderNumber' | 'createdAt'>>
  ) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    let subtotal = targetOrder.subtotalQAR;
    let deliveryFee = targetOrder.deliveryFeeQAR;
    let total = targetOrder.totalQAR;

    if (updatedFields.items) {
      subtotal = updatedFields.items.reduce((acc, it) => acc + it.product.priceQAR * it.quantity, 0);
      deliveryFee = subtotal >= settings.freeShippingThresholdQAR ? 0 : 25;
      total = subtotal + deliveryFee;
    }

    const mergedOrder: Order = {
      ...targetOrder,
      ...updatedFields,
      subtotalQAR: subtotal,
      deliveryFeeQAR: deliveryFee,
      totalQAR: total,
    };

    setOrders(prev => prev.map(o => o.id === orderId ? mergedOrder : o));

    if (lastConfirmedOrder && lastConfirmedOrder.id === orderId) {
      setLastConfirmedOrder(mergedOrder);
    }

    const payload: any = { ...updatedFields, subtotalQAR: subtotal, deliveryFeeQAR: deliveryFee, totalQAR: total };
    updateDoc(doc(db, 'orders', orderId), JSON.parse(JSON.stringify(payload))).catch(() => {});

    const editNotif: NotificationItem = {
      id: 'notif-edit-' + Date.now(),
      title: `Order #${targetOrder.orderNumber} Updated`,
      message: `Your order details/sizes for #${targetOrder.orderNumber} have been updated. New Total: QAR ${total}`,
      type: 'order',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      recipientEmail: targetOrder.customerEmail,
      deviceId: targetOrder.deviceId || getDeviceId(),
      orderId: targetOrder.id,
    };
    setNotifications(prev => [editNotif, ...prev]);

    setDoc(doc(db, 'notifications', editNotif.id), JSON.parse(JSON.stringify(editNotif))).catch(() => {});
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    if (lastConfirmedOrder && lastConfirmedOrder.id === orderId) {
      setLastConfirmedOrder(null);
    }
    deleteDoc(doc(db, 'orders', orderId)).catch(() => {});
  };

  const sendCustomerNotification = (notification: {
    title: string;
    message: string;
    type?: 'order' | 'deal' | 'system';
    recipientEmail?: string;
    deviceId?: string;
    orderId?: string;
  }) => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: notification.title,
      message: notification.message,
      type: notification.type || 'system',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      recipientEmail: notification.recipientEmail,
      deviceId: notification.deviceId,
      orderId: notification.orderId,
    };
    setNotifications(prev => [newNotif, ...prev]);

    setDoc(doc(db, 'notifications', newNotif.id), JSON.parse(JSON.stringify(newNotif))).catch(() => {});
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    deleteDoc(doc(db, 'notifications', notificationId)).catch(() => {});
  };

  const updateNotification = (notificationId: string, title: string, message: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, title, message } : n))
    );
    updateDoc(doc(db, 'notifications', notificationId), { title, message }).catch(() => {});
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
    updateDoc(doc(db, 'notifications', notificationId), { read: true }).catch(() => {});
  };

  // Product Management
  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const newId = 'shoe-' + Date.now();
    const productWithId: Product = {
      ...newProductData,
      id: newId,
    };
    setProducts(prev => [productWithId, ...prev]);

    setDoc(doc(db, 'products', newId), productWithId).catch(() => {});
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );

    updateDoc(doc(db, 'products', id), updatedFields).catch(() => {});
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    deleteDoc(doc(db, 'products', id)).catch(() => {});
  };

  // Settings Management
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);

    setDoc(doc(db, 'settings', 'general'), merged).catch(() => {});
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        notifications,
        user,
        settings,
        selectedCategory,
        selectedBrand,
        searchQuery,
        isCartOpen,
        isAuthOpen,
        isAdminOpen,
        isOrderConfirmModalOpen,
        isNotificationsOpen,
        targetCheckoutItem,
        lastConfirmedOrder,
        setSelectedCategory,
        setSelectedBrand,
        setSearchQuery,
        setIsCartOpen,
        setIsAuthOpen,
        setIsAdminOpen,
        setIsOrderConfirmModalOpen,
        setIsNotificationsOpen,
        setTargetCheckoutItem,
        setLastConfirmedOrder,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        login,
        logout,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        editOrder,
        deleteOrder,
        sendCustomerNotification,
        deleteNotification,
        updateNotification,
        markNotificationAsRead,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
