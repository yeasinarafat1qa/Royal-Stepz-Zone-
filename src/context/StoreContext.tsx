import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  Product,
  CartItem,
  Order,
  User,
  StoreSettings,
  NotificationItem,
} from '../types';

import { db } from '../firebase';

import {
  ref,
  onValue,
  set,
  update,
  remove,
  push,
  get,
} from 'firebase/database';

// ============================================================
// TYPES
// ============================================================

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (
    productId: string,
    updates: Partial<Product>
  ) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  removeFromCart: (
    productId: string,
    selectedSize?: string,
    selectedColor?: string
  ) => void;
  updateQuantity: (
    productId: string,
    selectedSize: string,
    quantity: number,
    selectedColor?: string
  ) => void;
  clearCart: () => void;

  // Cart UI
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Authentication
  user: User | null;
  login: (
    phoneOrEmail: string,
    password?: string
  ) => Promise<boolean>;
  logout: () => void;

  // Auth modal
  isAuthOpen: boolean;
  setIsAuthOpen: React.Dispatch<React.SetStateAction<boolean>>;

  // Search / filters
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  selectedCategory: string;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<string>
  >;

  selectedBrand: string;
  setSelectedBrand: React.Dispatch<
    React.SetStateAction<string>
  >;

  // Orders
  orders: Order[];
  createOrder: (
    orderData: Omit<
      Order,
      'id' | 'orderNumber' | 'createdAt' | 'status'
    >
  ) => Promise<Order>;

  updateOrderStatus: (
    orderId: string,
    status: Order['status']
  ) => Promise<void>;

  // Admin
  isAdminOpen: boolean;
  setIsAdminOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  // Order confirmation
  isOrderConfirmModalOpen: boolean;
  setIsOrderConfirmModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  // Notifications
  notifications: NotificationItem[];

  isNotificationsOpen: boolean;
  setIsNotificationsOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  markNotificationAsRead: (
    notificationId: string
  ) => Promise<void>;

  markAllNotificationsAsRead: () => Promise<void>;

  // Settings
  settings: StoreSettings;

  updateSettings: (
    updates: Partial<StoreSettings>
  ) => Promise<void>;

  // Helpers
  getProductById: (productId: string) => Product | undefined;
}

// ============================================================
// DEFAULT SETTINGS
// ============================================================

const defaultInitialSettings: StoreSettings = {
  storeName: 'Royal Stepz Zone Qatar',

  currency: 'QAR',

  whatsappNumber: '+97455551234',

  adminEmail: 'admin@royalstepz.qa',

  deliveryFeeQAR: 20,

  freeShippingThresholdQAR: 300,

  bannerAnnouncement:
    '🇶🇦 Express 24h Delivery Across Qatar • Free delivery on orders over 300 QAR',

  heroTitle: 'Step Into Royalty.',

  heroSubtitle:
    'Premium footwear for every step. Discover your next favourite pair.',
};

// ============================================================
// DEFAULT PRODUCTS
// ============================================================

const initialDefaultProducts: Product[] = [
  {
    id: 'royal-air-black',
    name: 'Royal Air Black',
    category: 'Sneakers',
    brand: 'Royal Stepz',
    priceQAR: 249,
    originalPriceQAR: 299,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
    colors: ['Black', 'White'],
    description:
      'Premium everyday sneakers designed for comfort and modern street style.',
    inStock: true,
    stock: 25,
    // Load initial data safely
  useEffect(() => {
    try {
      const cachedProd = localStorage.getItem('royal_products');
      if (cachedProd) setProducts(JSON.parse(cachedProd));
      const cachedOrders = localStorage.getItem('royal_orders');
      if (cachedOrders) setOrders(JSON.parse(cachedOrders));
      const cachedSettings = localStorage.getItem('royal_settings');
      if (cachedSettings) setSettings(JSON.parse(cachedSettings));
    } catch (e) {}

    if (!db) {
      setProducts(INITIAL_PRODUCTS);
      return;
    }

    try {
      const qProducts = collection(db, 'products');
      const unsubscribeProducts = onSnapshot(
        qProducts,
        (snapshot) => {
          if (!snapshot.empty) {
            const items: Product[] = [];
            snapshot.forEach((doc) => {
              items.push(doc.data() as Product);
            });
            setProducts(items);
            try { localStorage.setItem('royal_products', JSON.stringify(items)); } catch(e){}
          } else {
            setProducts(INITIAL_PRODUCTS);
          }
        },
        () => {
          setProducts(INITIAL_PRODUCTS);
        }
      );

      return () => {
        unsubscribeProducts();
      };
    } catch (e) {
      setProducts(INITIAL_PRODUCTS);
    }
  }, []);
    originalPriceQAR: 239,
    image:
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43'],
    colors: ['Brown'],
    description:
      'Clean casual footwear made for comfortable everyday wear.',
    inStock: true,
    stock: 30,
    featured: false,
    isFeatured: false,
    isBestseller: true,
    rating: 4.6,
    reviewCount: 73,
  },

  {
    id: 'royal-luxury-black',
    name: 'Royal Luxury Black',
    category: 'Luxury',
    brand: 'Royal Stepz',
    priceQAR: 449,
    originalPriceQAR: 549,
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
    colors: ['Black'],
    description:
      'Premium luxury footwear with an elegant finish for special occasions.',
    inStock: true,
    stock: 10,
    featured: true,
    isFeatured: true,
    isNew: true,
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 42,
  },

  {
    id: 'royal-slides-sand',
    name: 'Royal Comfort Slides',
    category: 'Slides',
    brand: 'Royal Stepz',
    priceQAR: 99,
    originalPriceQAR: 129,
    image:
      'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=80',
    images: [
      'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=80',
    ],
    sizes: ['EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43'],
    colors: ['Sand', 'Black'],
    description:
      'Comfortable slides perfect for home, beach and everyday casual use.',
    inStock: true,
    stock: 45,
    featured: false,
    isFeatured: false,
    isBestseller: true,
    rating: 4.5,
    reviewCount: 91,
  },
];

// ============================================================
// CONTEXT
// ============================================================

const StoreContext =
  createContext<StoreContextType | undefined>(undefined);

// ============================================================
// PROVIDER
// ============================================================

export const StoreProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  // ==========================================================
  // PRODUCT STATE
  // ==========================================================

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(
        'royal_stepz_products'
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn(
        'Unable to load local products:',
        error
      );
    }

    return initialDefaultProducts;
  });

  // ==========================================================
  // CART STATE
  // ==========================================================

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(
        'royal_stepz_cart'
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn(
        'Unable to load cart:',
        error
      );
    }

    return [];
  });

  // ==========================================================
  // USER STATE
  // ==========================================================

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(
        'royal_stepz_user'
      );

      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn(
        'Unable to load user:',
        error
      );
    }

    return null;
  });

  // ==========================================================
  // ORDERS
  // ==========================================================

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(
        'royal_stepz_orders'
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn(
        'Unable to load orders:',
        error
      );
    }

    return [];
  });

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(() => {
      try {
        const saved = localStorage.getItem(
          'royal_stepz_notifications'
        );

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch (error) {
        console.warn(
          'Unable to load notifications:',
          error
        );
      }

      return [];
    });

  // ==========================================================
  // SETTINGS
  // ==========================================================

  const [settings, setSettings] =
    useState<StoreSettings>(defaultInitialSettings);

  // ==========================================================
  // UI STATE
  // ==========================================================

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  const [isAuthOpen, setIsAuthOpen] =
    useState(false);

  const [isAdminOpen, setIsAdminOpen] =
    useState(false);

  const [isOrderConfirmModalOpen, setIsOrderConfirmModalOpen] =
    useState(false);

  const [isNotificationsOpen, setIsNotificationsOpen] =
    useState(false);

  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const [searchQuery, setSearchQuery] =
    useState('');

  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const [selectedBrand, setSelectedBrand] =
    useState('All');

  // ==========================================================
  // LOCAL STORAGE SYNC
  // ==========================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        'royal_stepz_products',
        JSON.stringify(products)
      );
    } catch (error) {
      console.warn(
        'Unable to save products:',
        error
      );
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(
        'royal_stepz_cart',
        JSON.stringify(cart)
      );
    } catch (error) {
      console.warn(
        'Unable to save cart:',
        error
      );
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(
          'royal_stepz_user',
          JSON.stringify(user)
        );
      } else {
        localStorage.removeItem(
          'royal_stepz_user'
        );
      }
    } catch (error) {
      console.warn(
        'Unable to save user:',
        error
      );
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(
        'royal_stepz_orders',
        JSON.stringify(orders)
      );
    } catch (error) {
      console.warn(
        'Unable to save orders:',
        error
      );
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(
        'royal_stepz_notifications',
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.warn(
        'Unable to save notifications:',
        error
      );
    }
  }, [notifications]);

  // ==========================================================
  // FIREBASE - PRODUCTS
  // ==========================================================

  useEffect(() => {
    const productsRef = ref(db, 'products');

    const unsubscribe = onValue(
      productsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          return;
        }

        const data = snapshot.val();

        const firebaseProducts: Product[] =
          Object.entries(data).map(
            ([id, value]) => {
              const product =
                value as Partial<Product>;

              const priceQAR = Number(
                product.priceQAR ??
                  product.price ??
                  0
              );

              const originalPriceQAR =
                product.originalPriceQAR ??
                product.oldPrice;

              return {
                ...product,

                id,

                name:
                  product.name ||
                  'Unnamed Product',

                category:
                  product.category ||
                  'Sneakers',

                brand:
                  product.brand ||
                  'Royal Stepz',

                priceQAR,

                originalPriceQAR:
                  originalPriceQAR !== undefined
                    ? Number(originalPriceQAR)
                    : undefined,

                price:
                  product.price !== undefined
                    ? Number(product.price)
                    : priceQAR,

                oldPrice:
                  product.oldPrice !== undefined
                    ? Number(product.oldPrice)
                    : originalPriceQAR,

                image:
                  product.image ||
                  product.images?.[0] ||
                  '',

                images:
                  Array.isArray(product.images)
                    ? product.images
                    : product.image
                      ? [product.image]
                      : [],

                sizes:
                  Array.isArray(product.sizes)
                    ? product.sizes
                    : [],

                colors:
                  Array.isArray(product.colors)
                    ? product.colors
                    : [],

                description:
                  product.description || '',

                inStock:
                  product.inStock ??
                  ((product.stock ?? 0) > 0),

                stock:
                  product.stock !== undefined
                    ? Number(product.stock)
                    : undefined,

                featured:
                  product.featured ??
                  product.isFeatured ??
                  false,

                isFeatured:
                  product.isFeatured ??
                  product.featured ??
                  false,

                isNew:
                  product.isNew ??
                  product.isNewArrival ??
                  false,

                isNewArrival:
                  product.isNewArrival ??
                  product.isNew ??
                  false,

                isBestseller:
                  product.isBestseller ??
                  false,

                rating:
                  product.rating !== undefined
                    ? Number(product.rating)
                    : 0,

                reviewCount:
                  product.reviewCount !== undefined
                    ? Number(product.reviewCount)
                    : 0,
              } as Product;
            }
          );

        setProducts(firebaseProducts);
      },
      (error) => {
        console.warn(
          'Firebase products listener error:',
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================================
  // FIREBASE - ORDERS
  // ==========================================================

  useEffect(() => {
    const ordersRef = ref(db, 'orders');

    const unsubscribe = onValue(
      ordersRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          return;
        }

        const data = snapshot.val();

        const firebaseOrders: Order[] =
          Object.entries(data).map(
            ([id, value]) => ({
              ...(value as Order),
              id,
            })
          );

        firebaseOrders.sort(
          (a, b) =>
            Number(b.createdAt) -
            Number(a.createdAt)
        );

        setOrders(firebaseOrders);
      },
      (error) => {
        console.warn(
          'Firebase orders listener error:',
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================================
  // FIREBASE - NOTIFICATIONS
  // ==========================================================

  useEffect(() => {
    const notificationsRef = ref(
      db,
      'notifications'
    );

    const unsubscribe = onValue(
      notificationsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          return;
        }

        const data = snapshot.val();

        const firebaseNotifications: NotificationItem[] =
          Object.entries(data).map(
            ([id, value]) => ({
              ...(value as NotificationItem),
              id,
            })
          );

        firebaseNotifications.sort(
          (a, b) =>
            Number(b.timestamp) -
            Number(a.timestamp)
        );

        setNotifications(
          firebaseNotifications
        );
      },
      (error) => {
        console.warn(
          'Firebase notifications listener error:',
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================================
  // FIREBASE - SETTINGS
  // ==========================================================

  useEffect(() => {
    const settingsRef = ref(
      db,
      'settings'
    );

    const unsubscribe = onValue(
      settingsRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          return;
        }

        const data =
          snapshot.val() as Partial<StoreSettings>;

        setSettings((previous) => ({
          ...previous,
          ...data,

          currency:
            data.currency || 'QAR',

          deliveryFeeQAR:
            Number(
              data.deliveryFeeQAR ??
                previous.deliveryFeeQAR
            ),

          freeShippingThresholdQAR:
            Number(
              data.freeShippingThresholdQAR ??
                previous.freeShippingThresholdQAR
            ),
        }));
      },
      (error) => {
        console.warn(
          'Firebase settings listener error:',
          error
        );
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================================
  // PRODUCT HELPERS
  // ==========================================================

  const getProductById = (
    productId: string
  ): Product | undefined => {
    return products.find(
      (product) =>
        product.id === productId
    );
  };

  // ==========================================================
  // ADD PRODUCT
  // ==========================================================

  const addProduct = async (
    product: Product
  ): Promise<void> => {
    const productRef = ref(
      db,
      `products/${product.id}`
    );

    await set(productRef, product);

    setProducts((previous) => [
      ...previous.filter(
        (item) => item.id !== product.id
      ),
      product,
    ]);
  };

  // ==========================================================
  // UPDATE PRODUCT
  // ==========================================================

  const updateProduct = async (
    productId: string,
    updates: Partial<Product>
  ): Promise<void> => {
    const productRef = ref(
      db,
      `products/${productId}`
    );

    await update(
      productRef,
      updates
    );

    setProducts((previous) =>
      previous.map((product) =>
        product.id === productId
          ? {
              ...product,
              ...updates,
            }
          : product
      )
    );
  };

  // ==========================================================
  // DELETE PRODUCT
  // ==========================================================

  const deleteProduct = async (
    productId: string
  ): Promise<void> => {
    const productRef = ref(
      db,
      `products/${productId}`
    );

    await remove(productRef);

    setProducts((previous) =>
      previous.filter(
        (product) =>
          product.id !== productId
      )
    );

    setCart((previous) =>
      previous.filter(
        (item) =>
          item.product.id !== productId
      )
    );
  };

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const addToCart = (
    product: Product,
    selectedSize = product.sizes?.[0] || 'EU 42',
    selectedColor = product.colors?.[0]
  ) => {
    setCart((previous) => {
      const existingIndex =
        previous.findIndex(
          (item) =>
            item.product.id ===
              product.id &&
            item.selectedSize ===
              selectedSize &&
            item.selectedColor ===
              selectedColor
        );

      if (existingIndex !== -1) {
        return previous.map(
          (item, index) =>
            index === existingIndex
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      }

      return [
        ...previous,
        {
          product,
          selectedSize,
          selectedColor,
          quantity: 1,
        },
      ];
    });
  };

  // ==========================================================
  // REMOVE FROM CART
  // ==========================================================

  const removeFromCart = (
    productId: string,
    selectedSize?: string,
    selectedColor?: string
  ) => {
    setCart((previous) =>
      previous.filter(
        (item) =>
          !(
            item.product.id ===
              productId &&
            (!selectedSize ||
              item.selectedSize ===
                selectedSize) &&
            (!selectedColor ||
              item.selectedColor ===
                selectedColor)
          )
      )
    );
  };

  // ==========================================================
  // UPDATE QUANTITY
  // ==========================================================

  const updateQuantity = (
    productId: string,
    selectedSize: string,
    quantity: number,
    selectedColor?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(
        productId,
        selectedSize,
        selectedColor
      );
      return;
    }

    setCart((previous) =>
      previous.map((item) =>
        item.product.id ===
            productId &&
        item.selectedSize ===
            selectedSize &&
        item.selectedColor ===
            selectedColor
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  // ==========================================================
  // CLEAR CART
  // ==========================================================

  const clearCart = () => {
    setCart([]);
  };

  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = async (
    phoneOrEmail: string,
    password?: string
  ): Promise<boolean> => {
    const identifier =
      phoneOrEmail.trim();

    if (!identifier) {
      return false;
    }

    // --------------------------------------------------------
    // Admin account
    // --------------------------------------------------------

    if (
      identifier.toLowerCase() ===
      settings.adminEmail.toLowerCase()
    ) {
      const adminUser: User = {
        id: 'admin',
        name: 'Royal Stepz Admin',
        email: settings.adminEmail,
        isAdmin: true,
        createdAt:
          new Date().toISOString(),
      };

      setUser(adminUser);
      setIsAuthOpen(false);

      return true;
    }

    // --------------------------------------------------------
    // Customer login
    // --------------------------------------------------------

    try {
      const usersSnapshot = await get(
        ref(db, 'users')
      );

      if (usersSnapshot.exists()) {
        const data =
          usersSnapshot.val();

        const foundEntry =
          Object.entries(data).find(
            ([, value]) => {
              const customer =
                value as Partial<User> & {
                  password?: string;
                };

              const emailMatch =
                customer.email
                  ?.toLowerCase() ===
                identifier.toLowerCase();

              const phoneMatch =
                customer.phone ===
                identifier;

              const passwordMatch =
                !password ||
                customer.password ===
                  password;

              return (
                (emailMatch ||
                  phoneMatch) &&
                passwordMatch
              );
            }
          );

        if (foundEntry) {
          const [
            id,
            value,
          ] = foundEntry;

          const customer =
            value as Partial<User>;

          const loggedUser: User = {
            id,
            name:
              customer.name ||
              'Royal Stepz Customer',
            email:
              customer.email,
            phone:
              customer.phone,
            isAdmin:
              customer.isAdmin === true,
            createdAt:
              customer.createdAt,
          };

          setUser(loggedUser);
          setIsAuthOpen(false);

          return true;
        }
      }
    } catch (error) {
      console.warn(
        'Customer login lookup failed:',
        error
      );
    }

    // --------------------------------------------------------
    // Fallback guest customer session
    // --------------------------------------------------------

    const customerUser: User = {
      id:
        'cust-' +
        Date.now(),

      name: identifier.includes('@')
        ? identifier.split('@')[0]
        : 'Royal Stepz Customer',

      email: identifier.includes('@')
        ? identifier
        : undefined,

      phone: identifier.includes('@')
        ? undefined
        : identifier,

      isAdmin: false,

      createdAt:
        new Date().toISOString(),
    };

    setUser(customerUser);
    setIsAuthOpen(false);

    return true;
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================

  const logout = () => {
    setUser(null);
    setIsAdminOpen(false);
  };

  // ==========================================================
  // CREATE ORDER
  // ==========================================================

  const createOrder = async (
    orderData: Omit<
      Order,
      'id' | 'orderNumber' | 'createdAt' | 'status'
    >
  ): Promise<Order> => {
    const now =
      Date.now();

    const orderNumber =
      `RSZ-${now.toString().slice(-8)}`;

    const orderId =
      `order-${now}`;

    const order: Order = {
      ...orderData,

      id: orderId,

      orderNumber,

      status: 'Pending',

      createdAt: now,
    };

    // --------------------------------------------------------
    // Save to Firebase
    // --------------------------------------------------------

    try {
      await set(
        ref(
          db,
          `orders/${orderId}`
        ),
        order
      );
    } catch (error) {
      console.warn(
        'Firebase order save failed:',
        error
      );
    }

    // --------------------------------------------------------
    // Update local state
    // --------------------------------------------------------

    setOrders((previous) => [
      order,
      ...previous,
    ]);

    // --------------------------------------------------------
    // Create notification
    // --------------------------------------------------------

    const notificationId =
      `notification-${now}`;

    const notification: NotificationItem = {
      id: notificationId,

      title: 'Order Received',

      message:
        `Your order ${orderNumber} has been received successfully.`,

      timestamp: now,

      read: false,

      type: 'order',

      orderId,

      recipientEmail:
        order.customerEmail,

      deviceId:
        order.deviceId,
    };

    try {
      await set(
        ref(
          db,
          `notifications/${notificationId}`
        ),
        notification
      );
    } catch (error) {
      console.warn(
        'Notification save failed:',
        error
      );
    }

    setNotifications(
      (previous) => [
        notification,
        ...previous,
      ]
    );

    return order;
  };

  // ==========================================================
  // UPDATE ORDER STATUS
  // ==========================================================

  const updateOrderStatus = async (
    orderId: string,
    status: Order['status']
  ): Promise<void> => {
    await update(
      ref(
        db,
        `orders/${orderId}`
      ),
      {
        status,
        updatedAt:
          Date.now(),
      }
    );

    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              updatedAt:
                Date.now(),
            }
          : order
      )
    );
  };

  // ==========================================================
  // NOTIFICATION - MARK READ
  // ==========================================================

  const markNotificationAsRead =
    async (
      notificationId: string
    ): Promise<void> => {
      await update(
        ref(
          db,
          `notifications/${notificationId}`
        ),
        {
          read: true,
        }
      );

      setNotifications(
        (previous) =>
          previous.map(
            (notification) =>
              notification.id ===
              notificationId
                ? {
                    ...notification,
                    read: true,
                  }
                : notification
          )
      );
    };

  // ==========================================================
  // NOTIFICATION - MARK ALL READ
  // ==========================================================

  const markAllNotificationsAsRead =
    async (): Promise<void> => {
      const unread =
        notifications.filter(
          (notification) =>
            !notification.read
        );

      if (unread.length > 0) {
        const updates: Record<
          string,
          boolean
        > = {};

        unread.forEach(
          (notification) => {
            updates[
              `notifications/${notification.id}/read`
            ] = true;
          }
        );

        await update(
          ref(db),
          updates
        );
      }

      setNotifications(
        (previous) =>
          previous.map(
            (notification) => ({
              ...notification,
              read: true,
            })
          )
      );
    };

  // ==========================================================
  // UPDATE SETTINGS
  // ==========================================================

  const updateSettings = async (
    updates: Partial<StoreSettings>
  ): Promise<void> => {
    await update(
      ref(db, 'settings'),
      updates
    );

    setSettings((previous) => ({
      ...previous,
      ...updates,
    }));
  };

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  const contextValue =
    useMemo<StoreContextType>(
      () => ({
        // Products
        products,
        addProduct,
        updateProduct,
        deleteProduct,

        // Cart
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        // Cart UI
        isCartOpen,
        setIsCartOpen,

        // Auth
        user,
        login,
        logout,

        isAuthOpen,
        setIsAuthOpen,

        // Search
        searchQuery,
        setSearchQuery,

        selectedCategory,
        setSelectedCategory,

        selectedBrand,
        setSelectedBrand,

        // Orders
        orders,
        createOrder,
        updateOrderStatus,

        // Admin
        isAdminOpen,
        setIsAdminOpen,

        // Order modal
        isOrderConfirmModalOpen,
        setIsOrderConfirmModalOpen,

        // Notifications
        notifications,
        isNotificationsOpen,
        setIsNotificationsOpen,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        // Settings
        settings,
        updateSettings,

        // Helper
        getProductById,
      }),
      [
        products,
        cart,
        isCartOpen,
        user,
        isAuthOpen,
        searchQuery,
        selectedCategory,
        selectedBrand,
        orders,
        isAdminOpen,
        isOrderConfirmModalOpen,
        notifications,
        isNotificationsOpen,
        settings,
      ]
    );

  return (
    <StoreContext.Provider
      value={contextValue}
    >
      {children}
    </StoreContext.Provider>
  );
};

// ============================================================
// HOOK
// ============================================================

export const useStore =
  (): StoreContextType => {
    const context =
      useContext(StoreContext);

    if (!context) {
      throw new Error(
        'useStore must be used inside StoreProvider'
      );
    }

    return context;
  };
