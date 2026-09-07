import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order } from '../types';
import { 
  Crown, 
  PlusCircle, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Package, 
  ShoppingBag, 
  MessageCircle, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  Phone, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Edit3,
  TrendingDown,
  TrendingUp,
  Sliders,
  Sparkles,
  Search,
  Check,
  Tag,
  LogOut
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    user, 
    login, 
    logout,
    products, 
    addProduct, 
    updateProduct,
    deleteProduct, 
    orders, 
    updateOrderStatus, 
    settings, 
    updateSettings, 
    isAdminDashboardOpen, 
    setIsAdminDashboardOpen,
    isCloudSynced 
  } = useStore();

  // Admin login credentials state
  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab: 'inventory' | 'add-product' | 'orders' | 'settings'
  const [activeAdminTab, setActiveAdminTab] = useState<'inventory' | 'add-product' | 'orders' | 'settings'>('inventory');

  // Search & Filter in Admin Inventory
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState('All');

  // New Product Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Sneakers');
  const [priceQAR, setPriceQAR] = useState<string>('390');
  const [originalPriceQAR, setOriginalPriceQAR] = useState<string>('490');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('New Arrival');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44']);
  const [colorsInput, setColorsInput] = useState('Black, Royal White, Gold');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState('');

  // Editing Product Modal State (for full customization)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<Product['category']>('Sneakers');
  const [editPriceQAR, setEditPriceQAR] = useState<number>(390);
  const [editOriginalPriceQAR, setEditOriginalPriceQAR] = useState<string>('');
  const [editBadge, setEditBadge] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSizes, setEditSizes] = useState<string[]>([]);
  const [editColorsInput, setEditColorsInput] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editInStock, setEditInStock] = useState(true);
  const [editIsDeal, setEditIsDeal] = useState(false);
  const [customSizeInput, setCustomSizeInput] = useState('');

  // Store settings state
  const [hotlineWhatsApp, setHotlineWhatsApp] = useState(settings.whatsappNumber);
  const [shopAddress, setShopAddress] = useState(settings.storeAddress);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(settings.freeShippingThresholdQAR.toString());
  const [settingsSaved, setSettingsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  if (!isAdminDashboardOpen) return null;

  // STRICT ACCESS VERIFICATION:
  // Only user "yeasinarafat1.qa@gmail.com" with password "Ar@2925" can access this dashboard!
  const isAuthorizedAdmin = user?.isAdmin && user.email.toLowerCase() === 'yeasinarafat1.qa@gmail.com';

  const handleAdminDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = login(adminEmailInput, adminPasswordInput, 'Yeasin Arafat');
    if (res.isAdmin) {
      setAuthError('');
    } else {
      setAuthError('Access Denied: Invalid Master Admin credentials.');
    }
  };

  // Direct Device Image Upload for Add Product
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Direct Device Image Upload for Product Customizer Modal
  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setEditImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleToggleEditSize = (size: string) => {
    setEditSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleAddCustomEditSize = () => {
    if (!customSizeInput.trim()) return;
    const formatted = customSizeInput.trim().toUpperCase().startsWith('EU')
      ? customSizeInput.trim()
      : `EU ${customSizeInput.trim()}`;
    if (!editSizes.includes(formatted)) {
      setEditSizes(prev => [...prev, formatted]);
    }
    setCustomSizeInput('');
  };

  // Quick Price Adjuster (+ / - QAR) directly on inventory cards
  const handleQuickPriceChange = (productId: string, deltaQAR: number) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const newPrice = Math.max(10, target.priceQAR + deltaQAR);
    updateProduct(productId, { priceQAR: newPrice });
  };

  // Open Full Customizer for a product
  const openProductCustomizer = (prod: Product) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditCategory(prod.category);
    setEditPriceQAR(prod.priceQAR);
    setEditOriginalPriceQAR(prod.originalPriceQAR ? prod.originalPriceQAR.toString() : '');
    setEditBadge(prod.badge || '');
    setEditDescription(prod.description);
    setEditSizes([...prod.sizes]);
    setEditColorsInput(prod.colors.join(', '));
    setEditImage(prod.image);
    setEditInStock(prod.inStock);
    setEditIsDeal(Boolean(prod.isDeal));
  };

  // Save changes from Product Customizer
  const handleSaveProductCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editName.trim()) {
      alert('Please enter a valid product name.');
      return;
    }

    if (editPriceQAR <= 0) {
      alert('Price must be greater than 0 QAR.');
      return;
    }

    if (editSizes.length === 0) {
      alert('Product must have at least one shoe size.');
      return;
    }

    const colors = editColorsInput
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    updateProduct(editingProduct.id, {
      name: editName.trim(),
      category: editCategory,
      priceQAR: Number(editPriceQAR),
      originalPriceQAR: editOriginalPriceQAR ? Number(editOriginalPriceQAR) : undefined,
      badge: editBadge.trim() || undefined,
      description: editDescription.trim(),
      sizes: editSizes,
      colors: colors.length > 0 ? colors : ['Standard Edition'],
      image: editImage,
      inStock: editInStock,
      isDeal: editIsDeal,
    });

    setEditingProduct(null);
    setFormSuccess(`Updated "${editName}" successfully! Live across store.`);
    setTimeout(() => setFormSuccess(''), 3500);
  };

  // Handle Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a product name');
      return;
    }
    if (!priceQAR || parseFloat(priceQAR) <= 0) {
      alert('Please enter a valid price in QAR');
      return;
    }
    if (selectedSizes.length === 0) {
      alert('Please select at least one shoe size');
      return;
    }

    const finalImage = imagePreview || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80';

    const colors = colorsInput
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    addProduct({
      name: name.trim(),
      category,
      priceQAR: parseFloat(priceQAR),
      originalPriceQAR: originalPriceQAR ? parseFloat(originalPriceQAR) : undefined,
      rating: 5.0,
      reviewsCount: 1,
      image: finalImage,
      description: description.trim() || 'Premium royal footwear engineered for style and comfort in Qatar.',
      sizes: selectedSizes,
      colors: colors.length > 0 ? colors : ['Standard Edition'],
      inStock: true,
      badge: badge.trim() || undefined,
    });

    // Reset
    setName('');
    setPriceQAR('390');
    setOriginalPriceQAR('490');
    setDescription('');
    setImagePreview('');
    setBadge('New Arrival');
    setFormSuccess('New footwear product added and live on the store in Qatar QAR!');
    setTimeout(() => setFormSuccess(''), 3500);
    setActiveAdminTab('inventory');
  };

  // Handle Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      whatsappNumber: hotlineWhatsApp,
      storeAddress: shopAddress,
      freeShippingThresholdQAR: parseFloat(freeShippingThreshold) || 200,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const standardSizes = ['EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45', 'EU 46'];

  // Filtered products for admin
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(adminSearchQuery.toLowerCase());
    const matchesCat = adminCategoryFilter === 'All' || p.category === adminCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-6 max-h-[92vh] flex flex-col">
        
        {/* ========================================================================= */}
        {/* VIEW 1: STRICT HIDDEN AUTHENTICATION GATE (IF NOT SIGNED IN AS MASTER ADMIN) */}
        {/* ========================================================================= */}
        {!isAuthorizedAdmin ? (
          <div className="p-6 sm:p-10 max-w-md mx-auto my-auto w-full text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Restricted System Access
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Master Admin Portal 🇶🇦
              </h2>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Enter your designated Gmail and master password to unlock complete footwear customization and order management.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminDirectLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Master Admin Email:
                </label>
                <input
                  type="email"
                  required
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  placeholder="Enter admin email"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Master Password:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Unlock Master Dashboard</span>
              </button>
            </form>

            <div className="pt-2">
              <button
                onClick={() => setIsAdminDashboardOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                ← Return to Public Store
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: AUTHORIZED MASTER ADMIN COMMAND CENTER & PRODUCT CUSTOMIZER       */
          /* ========================================================================= */
          <>
            {/* Top Bar */}
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-white text-base">
                      Royal Stepz Zone Qatar • Admin Center
                    </h2>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-black rounded-full border border-amber-500/30">
                      MASTER ACCESS
                    </span>
                    {isCloudSynced ? (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Firestore Cloud Synced
                      </span>
                    ) : (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-full border border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        Connecting Cloud...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Logged in as: <strong className="text-amber-400">{user?.name}</strong> ({user?.email})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    logout();
                    setIsAdminDashboardOpen(false);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                  title="Sign out as admin"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span>Lock & Exit</span>
                </button>

                <button
                  onClick={() => setIsAdminDashboardOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Global Success Alert */}
            {formSuccess && (
              <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-5 py-2.5 text-xs text-emerald-400 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">{formSuccess}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto bg-slate-950/80 border-b border-slate-800 text-xs no-scrollbar">
              <button
                onClick={() => setActiveAdminTab('inventory')}
                className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeAdminTab === 'inventory'
                    ? 'border-amber-400 text-amber-400 bg-slate-900/60'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Footwear Customizer & Inventory ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('add-product')}
                className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeAdminTab === 'add-product'
                    ? 'border-amber-400 text-amber-400 bg-slate-900/60'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Footwear</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('orders')}
                className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeAdminTab === 'orders'
                    ? 'border-amber-400 text-amber-400 bg-slate-900/60'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Customer Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveAdminTab('settings')}
                className={`py-3 px-4 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeAdminTab === 'settings'
                    ? 'border-amber-400 text-amber-400 bg-slate-900/60'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Qatar Store & WhatsApp</span>
              </button>
            </div>

            {/* Scrollable Tab Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

              {/* =================================================================== */}
              {/* TAB 1: FOOTWEAR CUSTOMIZER & INVENTORY (EDIT ANYTHING, CHANGE PRICE)*/}
              {/* =================================================================== */}
              {activeAdminTab === 'inventory' && (
                <div className="space-y-4">
                  {/* Top Bar with Search, Category Filter, and Add Button */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by shoe name or category..."
                        value={adminSearchQuery}
                        onChange={(e) => setAdminSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={adminCategoryFilter}
                        onChange={(e) => setAdminCategoryFilter(e.target.value)}
                        className="py-1.5 px-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="All">All Categories</option>
                        <option value="Sneakers">Sneakers</option>
                        <option value="Running">Running</option>
                        <option value="Formal">Formal</option>
                        <option value="Loafers">Loafers</option>
                        <option value="Slides & Sandals">Slides & Sandals</option>
                        <option value="Limited Edition">Limited Edition</option>
                      </select>

                      <button
                        onClick={() => setActiveAdminTab('add-product')}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add Shoe</span>
                      </button>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProducts.map((prod) => {
                      const discount = prod.originalPriceQAR && prod.originalPriceQAR > prod.priceQAR
                        ? Math.round(((prod.originalPriceQAR - prod.priceQAR) / prod.originalPriceQAR) * 100)
                        : null;

                      return (
                        <div
                          key={prod.id}
                          className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all shadow-md group"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-20 h-20 object-cover rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
                                  {prod.category}
                                </span>
                                {prod.badge && (
                                  <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                                    {prod.badge}
                                  </span>
                                )}
                                {discount && (
                                  <span className="text-[9px] font-bold bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">
                                    {discount}% OFF
                                  </span>
                                )}
                              </div>

                              <h4 className="text-sm font-bold text-white truncate mt-0.5">
                                {prod.name}
                              </h4>

                              <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-base font-black text-amber-400">
                                  QAR {prod.priceQAR}
                                </span>
                                {prod.originalPriceQAR && (
                                  <span className="text-xs text-slate-500 line-through">
                                    QAR {prod.originalPriceQAR}
                                  </span>
                                )}
                              </div>

                              <div className="text-[11px] text-slate-400 mt-1 truncate">
                                Sizes: <strong className="text-slate-300">{prod.sizes.join(', ')}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Quick Price Adjuster Strip (দাম কমানো এবং বাড়ানো সরাসরি বাটন) */}
                          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-850 flex items-center justify-between gap-2 text-xs">
                            <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                              <span>Quick Price (QAR):</span>
                            </span>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuickPriceChange(prod.id, -50)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold text-[11px] transition-colors"
                                title="Decrease price by 50 QAR"
                              >
                                -50
                              </button>
                              <button
                                onClick={() => handleQuickPriceChange(prod.id, -10)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold text-[11px] transition-colors"
                                title="Decrease price by 10 QAR"
                              >
                                -10
                              </button>

                              <span className="px-2 py-1 bg-slate-950 font-black text-amber-400 border border-slate-700 rounded text-xs">
                                {prod.priceQAR}
                              </span>

                              <button
                                onClick={() => handleQuickPriceChange(prod.id, 10)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold text-[11px] transition-colors"
                                title="Increase price by 10 QAR"
                              >
                                +10
                              </button>
                              <button
                                onClick={() => handleQuickPriceChange(prod.id, 50)}
                                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-bold text-[11px] transition-colors"
                                title="Increase price by 50 QAR"
                              >
                                +50
                              </button>
                            </div>
                          </div>

                          {/* Action Buttons: Full Customizer & Delete */}
                          <div className="flex items-center gap-2 pt-1 border-t border-slate-850">
                            <button
                              onClick={() => openProductCustomizer(prod)}
                              className="flex-1 py-2 px-3 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Customize & Edit All Details</span>
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${prod.name}" from the store?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/30"
                              title="Delete shoe from inventory"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="py-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                      <Package className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                      <p>No footwear matches your search.</p>
                    </div>
                  )}
                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 2: ADD NEW PRODUCT FORM                                         */}
              {/* =================================================================== */}
              {activeAdminTab === 'add-product' && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-amber-400" />
                        <span>Publish New Footwear to Qatar Store</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Uploaded products will be instantly live with QAR pricing and WhatsApp ordering.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleAddProductSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Product Name / Model <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Royal Air Jordan Retro Obsidian"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Category <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value as Product['category'])}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                          <option value="Sneakers">Sneakers</option>
                          <option value="Running">Running</option>
                          <option value="Formal">Formal</option>
                          <option value="Loafers">Loafers</option>
                          <option value="Slides & Sandals">Slides & Sandals</option>
                          <option value="Limited Edition">Limited Edition</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Sale Price (QAR) <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="390"
                          value={priceQAR}
                          onChange={(e) => setPriceQAR(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Original Price (QAR) (For Discount)
                        </label>
                        <input
                          type="number"
                          placeholder="490"
                          value={originalPriceQAR}
                          onChange={(e) => setOriginalPriceQAR(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Badge Tag
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Best Seller, Exclusive"
                          value={badge}
                          onChange={(e) => setBadge(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Sizes */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Select Available EU Shoe Sizes:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {standardSizes.map(sz => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => handleToggleSize(sz)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                              selectedSizes.includes(sz)
                                ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                                : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colors & Description */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Available Colors (comma separated)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Obsidian Black, Pure White, Royal Gold"
                          value={colorsInput}
                          onChange={(e) => setColorsInput(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Product Description
                        </label>
                        <input
                          type="text"
                          placeholder="Features, material, comfort level..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Direct Image File Upload */}
                    <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                          <Upload className="w-4 h-4" />
                          <span>Direct Photo Upload (From Phone or Computer)</span>
                        </label>
                        <span className="text-[11px] text-slate-400">JPG, PNG, WEBP</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full sm:w-1/2 p-6 border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-colors"
                        >
                          <ImageIcon className="w-8 h-8 text-amber-400" />
                          <span className="text-xs font-bold text-white">Click to Choose Image File</span>
                          <span className="text-[10px] text-slate-500">Fast Base64 instant render</span>
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />

                        {imagePreview && (
                          <div className="flex items-center gap-3">
                            <img
                              src={imagePreview}
                              alt="Upload preview"
                              className="w-20 h-20 object-cover rounded-xl border border-amber-500/40 shadow-md"
                            />
                            <button
                              type="button"
                              onClick={() => setImagePreview('')}
                              className="text-xs text-red-400 hover:underline"
                            >
                              Remove image
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-98"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Publish Footwear to Store (Live in Qatar)</span>
                    </button>
                  </form>
                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 3: CUSTOMER ORDERS & SMS DISPATCH                               */}
              {/* =================================================================== */}
              {activeAdminTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-amber-400" />
                        <span>Customer Orders & Status Center</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Updates made here synchronize in real-time with customer order portals.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
                      {orders.length} Total Orders
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-xl">
                      No customer orders placed yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => {
                        const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
                        return (
                          <div
                            key={order.id}
                            className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-amber-400 text-sm">
                                  #{order.orderNumber}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {new Date(order.createdAt).toLocaleString()}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">Status:</span>
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                                  className={`text-xs font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                    order.status === 'Pending'
                                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                      : order.status === 'Confirmed'
                                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                                      : order.status === 'Dispatched'
                                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                                      : order.status === 'Delivered'
                                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                      : 'bg-red-500/20 text-red-400 border-red-500/40'
                                  }`}
                                >
                                  <option value="Pending">Pending (In Preparation)</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Dispatched">Dispatched (Qatar Courier)</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </div>

                            {/* Customer details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                              <div>
                                <span className="text-slate-500">Customer: </span>
                                <strong className="text-white">{order.customerName}</strong>
                              </div>
                              <div>
                                <span className="text-slate-500">Phone: </span>
                                <strong className="text-amber-400">{order.customerPhone}</strong>
                              </div>
                              <div className="sm:col-span-2">
                                <span className="text-slate-500">Qatar Address: </span>
                                <span>{order.city}, {order.fullAddress}</span>
                              </div>
                              {order.notes && (
                                <div className="sm:col-span-2 text-slate-400 italic">
                                  Notes: "{order.notes}"
                                </div>
                              )}
                            </div>

                            {/* Items */}
                            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850 space-y-1.5 text-xs">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="flex justify-between items-center text-slate-200">
                                  <span>
                                    {it.quantity}x {it.product.name} (Size: <strong className="text-amber-400">{it.selectedSize}</strong>)
                                  </span>
                                  <span className="font-bold text-amber-400">
                                    QAR {it.product.priceQAR * it.quantity}
                                  </span>
                                </div>
                              ))}
                              <div className="pt-1 border-t border-slate-800 flex justify-between font-bold text-white">
                                <span>Grand Total ({order.paymentMethod}):</span>
                                <span className="text-amber-400">QAR {order.totalQAR}</span>
                              </div>
                            </div>

                            {/* Quick WhatsApp Action */}
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <a
                                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                  `Hello ${order.customerName}! This is Royal Stepz Zone Qatar regarding your order #${order.orderNumber}. Your delivery status is currently: ${order.status}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp Customer Directly</span>
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 4: STORE SETTINGS                                               */}
              {/* =================================================================== */}
              {activeAdminTab === 'settings' && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg space-y-5">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Settings className="w-4 h-4 text-amber-400" />
                    <span>Store Configuration & Delivery Rules</span>
                  </h3>

                  {settingsSaved && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Settings saved successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Qatar Hotline / Admin WhatsApp Number:
                      </label>
                      <input
                        type="text"
                        value={hotlineWhatsApp}
                        onChange={(e) => setHotlineWhatsApp(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Store Address in Doha, Qatar:
                      </label>
                      <input
                        type="text"
                        value={shopAddress}
                        onChange={(e) => setShopAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">
                        Free Qatar Express Shipping Threshold (QAR):
                      </label>
                      <input
                        type="number"
                        value={freeShippingThreshold}
                        onChange={(e) => setFreeShippingThreshold(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
                    >
                      Save Settings
                    </button>
                  </form>
                </div>
              )}

            </div>
          </>
        )}

      </div>

      {/* ========================================================================= */}
      {/* VIEW 3: FULL PRODUCT CUSTOMIZER MODAL (CUSTOMIZE ANY DETAIL, ANY PRICE)   */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/60 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col animate-scaleUp">
            {/* Header */}
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-sm sm:text-base">
                    Customize Footwear: {editingProduct.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Adjust price, change category, add sizes, or upload a new photo
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Area */}
            <form onSubmit={handleSaveProductCustomization} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Product Name / Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Category:
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as Product['category'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Sneakers">Sneakers</option>
                    <option value="Running">Running</option>
                    <option value="Formal">Formal</option>
                    <option value="Loafers">Loafers</option>
                    <option value="Slides & Sandals">Slides & Sandals</option>
                    <option value="Limited Edition">Limited Edition</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Badge / Tag (e.g. HOT DROP, BESTSELLER):
                  </label>
                  <input
                    type="text"
                    value={editBadge}
                    placeholder="e.g. 50% OFF, LIMITED"
                    onChange={(e) => setEditBadge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Price Controllers (দাম বাড়ানো এবং কমানোর ফুল কাস্টমাইজেশন) */}
              <div className="p-3.5 bg-slate-950 border border-amber-500/30 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-400 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span>Price Controls (Qatari Riyal - QAR)</span>
                  </span>
                  {editOriginalPriceQAR && Number(editOriginalPriceQAR) > editPriceQAR && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 font-black rounded text-[10px] border border-red-500/30">
                      {Math.round(((Number(editOriginalPriceQAR) - editPriceQAR) / Number(editOriginalPriceQAR)) * 100)}% DISCOUNT
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Sale Price (QAR) <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        required
                        value={editPriceQAR}
                        onChange={(e) => setEditPriceQAR(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-black text-sm focus:outline-none focus:border-amber-500"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditPriceQAR(Math.max(10, editPriceQAR - 10))}
                          className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold"
                          title="Decrease 10 QAR"
                        >
                          -10
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditPriceQAR(editPriceQAR + 10)}
                          className="px-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-bold"
                          title="Increase 10 QAR"
                        >
                          +10
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Original Price (QAR) (Optional)
                    </label>
                    <input
                      type="number"
                      value={editOriginalPriceQAR}
                      placeholder="e.g. 490"
                      onChange={(e) => setEditOriginalPriceQAR(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sizes Multi-Select & Custom Size Input */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-200">
                  Available Sizes:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {standardSizes.map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleToggleEditSize(sz)}
                      className={`px-2.5 py-1 rounded text-xs font-bold border transition-all ${
                        editSizes.includes(sz)
                          ? 'bg-amber-500 text-slate-950 border-amber-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add custom size (e.g. EU 47, US 10)"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomEditSize}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-amber-400 font-bold rounded-lg text-xs"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              {/* Colors & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Available Colors (comma separated):
                  </label>
                  <input
                    type="text"
                    value={editColorsInput}
                    onChange={(e) => setEditColorsInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Product Description:
                  </label>
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Photo Upload / Image URL */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <label className="block font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>Update Product Photo (Device Upload or URL)</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {editImage && (
                    <img
                      src={editImage}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-xl border border-slate-700 bg-slate-900 flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload New Image from Phone/PC</span>
                    </button>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageUpload}
                      className="hidden"
                    />

                    <input
                      type="text"
                      placeholder="Or paste external Image URL"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editInStock}
                    onChange={(e) => setEditInStock(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-0"
                  />
                  <span className="font-semibold text-white">In Stock for Qatar 24h Courier</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsDeal}
                    onChange={(e) => setEditIsDeal(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded focus:ring-0"
                  />
                  <span className="font-semibold text-amber-400">Mark as "Today's Flash Deal"</span>
                </label>
              </div>

              {/* Save & Cancel Buttons */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes & Sync Store Live</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="py-3 px-5 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
