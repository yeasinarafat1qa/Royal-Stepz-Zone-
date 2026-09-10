import React, { useState, useMemo, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SecretAdminModal } from './components/SecretAdminModal';
import { OrderConfirmModal } from './components/OrderConfirmModal';
import { NotificationsModal } from './components/NotificationsModal';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

function StoreContent() {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory,
    selectedBrand, 
    setSelectedBrand,
    searchQuery,
    isAdminOpen,
    setIsAdminOpen,
    isOrderConfirmModalOpen,
    user,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [showDiscountsOnly, setShowDiscountsOnly] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSecretAdminModalOpen, setIsSecretAdminModalOpen] = useState(false);

  // Secret Keyboard Shortcut: Ctrl + F12
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'F12' || e.code === 'F12')) {
        e.preventDefault();
        if (user?.isAdmin) {
          setIsAdminOpen(true);
        } else {
          setIsSecretAdminModalOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [user, setIsAdminOpen]);

  // Brands list
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => set.add(p.brand));
    return ['All', ...Array.from(set)];
  }, [products]);

  const categories = ['All', 'Sneakers', 'Casual', 'Running', 'Luxury', 'Slides'];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
        if (selectedBrand !== 'All' && product.brand !== selectedBrand) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchCategory = product.category.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCategory) return false;
        }
        if (product.priceQAR < priceRange[0] || product.priceQAR > priceRange[1]) return false;
        if (showDiscountsOnly && (!product.originalPriceQAR || product.originalPriceQAR <= product.priceQAR)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.priceQAR - b.priceQAR;
        if (sortBy === 'price-high') return b.priceQAR - a.priceQAR;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedBrand, searchQuery, priceRange, showDiscountsOnly, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <Header />

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 pt-8 pb-12 sm:pt-14 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>QATAR'S EXCLUSIVE FOOTWEAR VAULT</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                STEP INTO <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">ROYALTY</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover 100% verified authentic Air Jordans, Yeezys, Dunks, and luxury lifestyle footwear in Qatar. Express 24h delivery with Cash on Delivery across Qatar.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#collection"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  Explore Collection
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-4 shadow-2xl">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 relative">
                    <img
                      src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80"
                      alt="Air Jordan 1"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full uppercase">
                      Hot in Qatar
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-400 font-semibold">AIR JORDAN 1</span>
                      <span className="text-sm font-black text-white">QAR 650</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">Retro High OG "Chicago"</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Fast Qatar Delivery</h4>
                <p className="text-[11px] text-slate-400">Within 24 Hours in Doha</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">100% Genuine</h4>
                <p className="text-[11px] text-slate-400">Verified Authentic</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">Size Exchange</h4>
                <p className="text-[11px] text-slate-400">Easy size swap</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">24/7 WhatsApp</h4>
                <p className="text-[11px] text-slate-400">+974 5555 1234</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Shop */}
      <main id="collection" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>EXPLORE COLLECTION</span>
              <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                {filteredProducts.length} Items
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Available for immediate delivery in Qatar</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Filters</span>
            </button>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filters Box */}
        {isFilterDrawerOpen && (
          <div className="mt-4 p-4 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase">Filter Options</span>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedBrand('All');
                  setShowDiscountsOnly(false);
                }}
                className="text-xs text-amber-400 hover:underline"
              >
                Reset All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Category:</label>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        selectedCategory === cat
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Brand:</label>
                <div className="flex flex-wrap gap-1.5">
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        selectedBrand === b
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <CartDrawer />
      <AuthModal />
      <SecretAdminModal 
        isOpen={isSecretAdminModalOpen} 
        onClose={() => setIsSecretAdminModalOpen(false)} 
        onLoginSuccess={() => setIsAdminOpen(true)} 
      />
      {isAdminOpen && <AdminDashboard />}
      {isOrderConfirmModalOpen && <OrderConfirmModal />}
      <NotificationsModal />
    </div>
  );
}

export function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}

export default App;
