import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, User, NotificationItem, StoreSettings } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  orders: Order[];
  notifications: NotificationItem[];
  settings: StoreSettings;
  searchQuery: string;
  selectedCategory: string;
  activeTab: string;
  isCartOpen: boolean;
  isAuthModalOpen: boolean;
  isAdminDashboardOpen: boolean;
  isOrderConfirmModalOpen: boolean;
  isProductDetailModalOpen: boolean;
  isNotificationsOpen: boolean;
  selectedProduct: Product | null;
  targetCheckoutItem: CartItem | null;
  lastConfirmedOrder: Order | null;
  unreadNotificationsCount: number;
  unreadOrdersCount: number;
  isCloudSynced: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setActiveTab: (tab: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsAdminDashboardOpen: (open: boolean) => void;
  setIsOrderConfirmModalOpen: (open: boolean) => void;
  setIsProductDetailModalOpen: (open: boolean) => void;
  setIsNotificationsOpen: (open: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  setTargetCheckoutItem: (item: CartItem | null) => void;
  setLastConfirmedOrder: (order: Order | null) => void;

  // Cart operations
  addToCart: (product: Product, selectedSize: string, selectedColor?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openFastCheckout: (product: Product, selectedSize?: string, selectedColor?: string) => void;

  // Auth operations
  login: (email: string, password: string, name?: string) => { success: boolean; message: string; isAdmin: boolean };
  logout: () => void;

  // Admin operations
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Order & WhatsApp operations
  placeOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    city: string;
    fullAddress: string;
    notes?: string;
    paymentMethod: Order['paymentMethod'];
    items: CartItem[];
  }) => { order: Order; whatsappUrl: string };
  generateWhatsAppUrl: (order: Order) => string;
  cancelOrder: (orderId: string, reason?: string) => void;
  editOrder: (
    orderId: string,
    updatedFields: {
      items: CartItem[];
      customerName?: string;
      customerPhone?: string;
      city?: string;
      fullAddress?: string;
      notes?: string;
    }
  ) => void;
  markNotificationsAsRead: () => void;
}

const DEFAULT_SETTINGS: StoreSettings = {
  whatsappNumber: '+97455551234',
  storeName: 'Royal Stepz Zone Qatar',
  storeAddress: 'Al Sadd St, Doha, Qatar',
  supportEmail: 'support@royalstepz-zone.qa',
  currency: 'QAR',
  freeShippingThresholdQAR: 200,
};

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'RSZ-QA-9102',
    customerName: 'Sheikh Jassim Al-Kuwari',
    customerPhone: '+974 5512 8899',
    city: 'Lusail',
    fullAddress: 'Marina Promenade, Tower 3, Apt 1402, Lusail City',
    notes: 'Please call before arrival. Deliver before Maghrib.',
    paymentMethod: 'Cash on Delivery',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        selectedSize: 'EU 43',
        selectedColor: 'Obsidian Black & Gold',
        quantity: 1,
      },
    ],
    subtotalQAR: 480,
    deliveryFeeQAR: 0,
    totalQAR: 480,
    status: 'Confirmed',
    createdAt: '2026-09-05T14:20:00.000Z',
    whatsappSent: true,
  },
  {
    id: 'ord-102',
    orderNumber: 'RSZ-QA-8831',
    customerName: 'Tariq Mansoor',
    customerPhone: '+974 6690 1234',
    city: 'Doha',
    fullAddress: 'Zone 23, Street 840, Villa 12, Al Hilal, Doha',
    notes: 'Leave with security if not home.',
    paymentMethod: 'Card on Delivery',
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        selectedSize: 'EU 42',
        selectedColor: 'Crimson Blaze',
        quantity: 1,
      },
    ],
    subtotalQAR: 350,
    deliveryFeeQAR: 0,
    totalQAR: 350,
    status: 'Dispatched',
    createdAt: '2026-09-05T18:45:00.000Z',
    whatsappSent: true,
  }
];

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Welcome to Royal Stepz Zone Qatar!',
    message: 'Enjoy exclusive sneakers and luxury footwear with free 24-hour delivery in Doha for orders over QAR 200.',
    timestamp: 'Just now',
    read: false,
    type: 'system',
  },
  {
    id: 'notif-2',
    title: 'Qatar National Weekend Offer',
    message: 'Special discounts up to 35% on Royal Air Retro and Al Rayyan Brogues now live.',
    timestamp: '2 hours ago',
    read: false,
    type: 'deal',
  }
];

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from LocalStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('rsz_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse products from storage', e);
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('rsz_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    return [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rsz_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }
    return null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('rsz_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse orders', e);
      }
    }
    return SEED_ORDERS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('rsz_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse notifications', e);
      }
    }
    return SEED_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('rsz_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isOrderConfirmModalOpen, setIsOrderConfirmModalOpen] = useState(false);
  const [isProductDetailModalOpen, setIsProductDetailModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [targetCheckoutItem, setTargetCheckoutItem] = useState<CartItem | null>(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Real-time Firestore Sync for Products
  useEffect(() => {
    try {
      const productsRef = collection(db, 'products');
      const unsubscribe = onSnapshot(
        productsRef,
        (snapshot) => {
          setIsCloudSynced(true);
          if (snapshot.empty) {
            // Seed initial products to Firestore on first setup
            INITIAL_PRODUCTS.forEach(async (prod) => {
              try {
                await setDoc(doc(db, 'products', prod.id), prod);
              } catch (e) {
                handleFirestoreError(e, OperationType.WRITE, `products/${prod.id}`);
              }
            });
          } else {
            const cloudProducts = snapshot.docs.map(d => d.data() as Product);
            setProducts(cloudProducts);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'products');
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore products listener initialization:', e);
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
            cloudOrders.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setOrders(cloudOrders);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'orders');
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore orders listener initialization:', e);
    }
  }, []);

  // Real-time Firestore Sync for Settings
  useEffect(() => {
    try {
      const settingsDocRef = doc(db, 'settings', 'store_settings');
      const unsubscribe = onSnapshot(
        settingsDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setSettings(docSnap.data() as StoreSettings);
          } else {
            setDoc(settingsDocRef, DEFAULT_SETTINGS).catch(e => {
              handleFirestoreError(e, OperationType.WRITE, 'settings/store_settings');
            });
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'settings/store_settings');
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore settings listener initialization:', e);
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('rsz_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('rsz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rsz_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('rsz_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('rsz_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('rsz_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rsz_user');
    }
  }, [user]);

  // Cart operations
  const addToCart = (product: Product, selectedSize: string, selectedColor?: string, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            selectedSize,
            selectedColor: selectedColor || product.colors[0] || 'Standard',
            quantity,
          },
        ];
      }
    });

    // Add in-app notification
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Added to Cart',
      message: `${product.name} (Size: ${selectedSize}) was added to your bag.`,
      timestamp: 'Just now',
      read: false,
      type: 'order',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === size)));
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId && item.selectedSize === size) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Fast direct checkout (triggers the requested confirmation inter-page)
  const openFastCheckout = (product: Product, selectedSize?: string, selectedColor?: string) => {
    const size = selectedSize || product.sizes[0] || 'EU 42';
    const color = selectedColor || product.colors[0] || 'Original';
    const singleItem: CartItem = {
      product,
      selectedSize: size,
      selectedColor: color,
      quantity: 1,
    };
    setTargetCheckoutItem(singleItem);
    setIsOrderConfirmModalOpen(true);
  };

  // Auth operations (Strict validation for Admin)
  const login = (email: string, password: string, name?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Strict Admin verification
    if (trimmedEmail === 'yeasinarafat1.qa@gmail.com' && password === 'Ar@2925') {
      const adminUser: User = {
        id: 'admin-master',
        name: name || 'Yeasin Arafat (Admin)',
        email: 'yeasinarafat1.qa@gmail.com',
        phone: '+974 5555 1234',
        isAdmin: true,
      };
      setUser(adminUser);
      return { success: true, message: 'Welcome back Master Admin!', isAdmin: true };
    }

    if (trimmedEmail === 'yeasinarafat1.qa@gmail.com' && password !== 'Ar@2925') {
      return { success: false, message: 'Incorrect Admin password. Access denied.', isAdmin: false };
    }

    // Normal customer login
    const normalUser: User = {
      id: 'usr-' + Date.now(),
      name: name || email.split('@')[0] || 'Valued Customer',
      email: trimmedEmail,
      isAdmin: false,
    };
    setUser(normalUser);
    return { success: true, message: `Welcome back, ${normalUser.name}!`, isAdmin: false };
  };

  const logout = () => {
    setUser(null);
    setIsAdminDashboardOpen(false);
  };

  // Admin Operations
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: 'rsz-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);

    // Persist to Cloud Firestore
    setDoc(doc(db, 'products', newProduct.id), newProduct).catch(err => {
      handleFirestoreError(err, OperationType.CREATE, `products/${newProduct.id}`);
    });

    // Add alert notification
    const alertNotif: NotificationItem = {
      id: 'notif-prod-' + Date.now(),
      title: 'New Footwear Drop!',
      message: `${newProduct.name} has just been added to Royal Stepz Zone Qatar at QAR ${newProduct.priceQAR}.`,
      timestamp: 'Just now',
      read: false,
      type: 'deal',
    };
    setNotifications(prev => [alertNotif, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    // Also remove from cart if present
    setCart(prev => prev.filter(item => item.product.id !== id));

    // Delete from Cloud Firestore
    deleteDoc(doc(db, 'products', id)).catch(err => {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    });
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
    setCart(prev =>
      prev.map(item =>
        item.product.id === id
          ? { ...item, product: { ...item.product, ...updated } }
          : item
      )
    );

    // Update in Cloud Firestore
    updateDoc(doc(db, 'products', id), updated).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );

    // Update status in Cloud Firestore
    updateDoc(doc(db, 'orders', orderId), { status }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    });
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));

    // Update in Cloud Firestore
    setDoc(doc(db, 'settings', 'store_settings'), newSettings, { merge: true }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, 'settings/store_settings');
    });
  };

  // WhatsApp formatted URL generator
  const generateWhatsAppUrl = (order: Order): string => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const itemsList = order.items
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.product.name}*\n   - Size: ${it.selectedSize}\n   - Color: ${it.selectedColor || 'Standard'}\n   - Qty: ${it.quantity} x QAR ${it.product.priceQAR}\n   - Item Total: QAR ${it.quantity * it.product.priceQAR}`
      )
      .join('\n\n');

    const message = `👑 *ROYAL STEPZ ZONE - NEW ORDER CONFIRMATION* 🇶🇦
━━━━━━━━━━━━━━━━━━━━━━
📦 *Order ID:* #${order.orderNumber}
👤 *Customer:* ${order.customerName}
📞 *Contact/WhatsApp:* ${order.customerPhone}
📍 *Delivery City:* ${order.city}, Qatar
🏠 *Full Address:* ${order.fullAddress}
📝 *Notes:* ${order.notes || 'None'}
💳 *Payment Mode:* ${order.paymentMethod}
━━━━━━━━━━━━━━━━━━━━━━
🛍️ *ORDERED ITEMS:*
${itemsList}
━━━━━━━━━━━━━━━━━━━━━━
💰 *Subtotal:* QAR ${order.subtotalQAR}
🚚 *Express Qatar Delivery:* ${order.deliveryFeeQAR === 0 ? 'FREE' : `QAR ${order.deliveryFeeQAR}`}
🏷️ *GRAND TOTAL:* *QAR ${order.totalQAR}*
━━━━━━━━━━━━━━━━━━━━━━
Please confirm my order and send dispatch details for Qatar 24h delivery! Thank you Royal Stepz Zone.`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  // Place Order function (Creates order, alerts Admin SMS/Inbox, notifies Customer, builds WhatsApp link)
  const placeOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    city: string;
    fullAddress: string;
    notes?: string;
    paymentMethod: Order['paymentMethod'];
    items: CartItem[];
  }) => {
    const subtotal = orderData.items.reduce(
      (acc, it) => acc + it.product.priceQAR * it.quantity,
      0
    );
    const deliveryFee = subtotal >= settings.freeShippingThresholdQAR ? 0 : 25;
    const total = subtotal + deliveryFee;
    const orderNum = `RSZ-QA-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      city: orderData.city,
      fullAddress: orderData.fullAddress,
      notes: orderData.notes,
      paymentMethod: orderData.paymentMethod,
      items: orderData.items,
      subtotalQAR: subtotal,
      deliveryFeeQAR: deliveryFee,
      totalQAR: total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      customerEmail: user?.email,
      whatsappSent: true,
    };

    // Add to orders list (Admin receives it in real-time)
    setOrders(prev => [newOrder, ...prev]);

    // Persist order to Cloud Firestore
    setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(err => {
      handleFirestoreError(err, OperationType.CREATE, `orders/${newOrder.id}`);
    });

    // Customer Notification
    const customerNotification: NotificationItem = {
      id: 'notif-order-' + Date.now(),
      title: `Order #${orderNum} Confirmed!`,
      message: `Thank you ${orderData.customerName}! Your order of QAR ${total} is received. We are preparing 24-hour delivery in ${orderData.city}, Qatar.`,
      timestamp: 'Just now',
      read: false,
      type: 'order',
      orderId: newOrder.id,
    };
    setNotifications(prev => [customerNotification, ...prev]);

    // Clear cart if target was whole cart
    if (!targetCheckoutItem) {
      clearCart();
    }

    setLastConfirmedOrder(newOrder);
    const whatsappUrl = generateWhatsAppUrl(newOrder);

    return { order: newOrder, whatsappUrl };
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: 'Cancelled' as const } : o))
    );

    // Sync cancellation to Firestore
    updateDoc(doc(db, 'orders', orderId), { status: 'Cancelled' }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    });

    // Notify customer
    const cancelNotif: NotificationItem = {
      id: 'notif-cancel-' + Date.now(),
      title: `Order #${targetOrder.orderNumber} Cancelled`,
      message: `Your order #${targetOrder.orderNumber} has been successfully cancelled.${
        reason ? ` Reason: ${reason}` : ''
      } You can place a new order anytime with Qatar 24h delivery.`,
      timestamp: 'Just now',
      read: false,
      type: 'order',
      orderId: targetOrder.id,
    };
    setNotifications(prev => [cancelNotif, ...prev]);
  };

  const editOrder = (
    orderId: string,
    updatedFields: {
      items: CartItem[];
      customerName?: string;
      customerPhone?: string;
      city?: string;
      fullAddress?: string;
      notes?: string;
    }
  ) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const subtotal = updatedFields.items.reduce(
      (acc, it) => acc + it.product.priceQAR * it.quantity,
      0
    );
    const deliveryFee = subtotal >= settings.freeShippingThresholdQAR ? 0 : 25;
    const total = subtotal + deliveryFee;

    setOrders(prev =>
      prev.map(o => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          items: updatedFields.items,
          customerName: updatedFields.customerName ?? o.customerName,
          customerPhone: updatedFields.customerPhone ?? o.customerPhone,
          city: updatedFields.city ?? o.city,
          fullAddress: updatedFields.fullAddress ?? o.fullAddress,
          notes: updatedFields.notes ?? o.notes,
          subtotalQAR: subtotal,
          deliveryFeeQAR: deliveryFee,
          totalQAR: total,
          // If was previously pending or confirmed, keep it active
          status: o.status === 'Cancelled' ? 'Pending' : o.status,
        };
      })
    );

    // Sync updated order fields to Firestore
    updateDoc(doc(db, 'orders', orderId), {
      items: updatedFields.items,
      ...(updatedFields.customerName && { customerName: updatedFields.customerName }),
      ...(updatedFields.customerPhone && { customerPhone: updatedFields.customerPhone }),
      ...(updatedFields.city && { city: updatedFields.city }),
      ...(updatedFields.fullAddress && { fullAddress: updatedFields.fullAddress }),
      ...(updatedFields.notes && { notes: updatedFields.notes }),
      subtotalQAR: subtotal,
      deliveryFeeQAR: deliveryFee,
      totalQAR: total,
    }).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    });

    // Notify customer
    const editNotif: NotificationItem = {
      id: 'notif-edit-' + Date.now(),
      title: `Order #${targetOrder.orderNumber} Updated!`,
      message: `Your order #${targetOrder.orderNumber} was updated with your new footwear selection. New Total: QAR ${total}.`,
      timestamp: 'Just now',
      read: false,
      type: 'order',
      orderId: targetOrder.id,
    };
    setNotifications(prev => [editNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadOrdersCount = orders.filter(o => o.status === 'Pending').length;

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        user,
        orders,
        notifications,
        settings,
        searchQuery,
        selectedCategory,
        activeTab,
        isCartOpen,
        isAuthModalOpen,
        isAdminDashboardOpen,
        isOrderConfirmModalOpen,
        isProductDetailModalOpen,
        isNotificationsOpen,
        selectedProduct,
        targetCheckoutItem,
        lastConfirmedOrder,
        unreadNotificationsCount,
        unreadOrdersCount,
        isCloudSynced,
        setSearchQuery,
        setSelectedCategory,
        setActiveTab,
        setIsCartOpen,
        setIsAuthModalOpen,
        setIsAdminDashboardOpen,
        setIsOrderConfirmModalOpen,
        setIsProductDetailModalOpen,
        setIsNotificationsOpen,
        setSelectedProduct,
        setTargetCheckoutItem,
        setLastConfirmedOrder,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        openFastCheckout,
        login,
        logout,
        addProduct,
        deleteProduct,
        updateProduct,
        updateOrderStatus,
        updateSettings,
        placeOrder,
        generateWhatsAppUrl,
        cancelOrder,
        editOrder,
        markNotificationsAsRead,
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
