import React, { useState, useMemo, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { SubNavbar } from './components/SubNavbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderConfirmModal } from './components/OrderConfirmModal';
import { CartDrawer } from './components/CartDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { NotificationsModal } from './components/NotificationsModal';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { 
  SlidersHorizontal, 
  Flame, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Crown, 
  Filter, 
  Search, 
  Sparkles,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    products, 
    searchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    setSearchQuery,
    setIsAdminDashboardOpen,
  } = useStore();

  // Secret Admin shortcut: Ctrl+Shift+A or Cmd+Shift+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminDashboardOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAdminDashboardOpen]);

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('All');
  const [priceMax, setPriceMax] = useState<number>(1000);

  // Filtered & Sorted products list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesDesc) return false;
      }

      // Category filter
      if (selectedCategory === 'deals') {
        if (!product.isDeal && (!product.originalPriceQAR || product.originalPriceQAR <= product.priceQAR)) {
          return false;
        }
      } else if (selectedCategory !== 'All') {
        if (product.category !== selectedCategory) return false;
      }

      // Size filter
      if (selectedSizeFilter !== 'All') {
        if (!product.sizes.includes(selectedSizeFilter)) return false;
      }

      // Price filter
      if (product.priceQAR > priceMax) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceQAR - b.priceQAR;
      if (sortBy === 'price-desc') return b.priceQAR - a.priceQAR;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0; // featured
    });
  }, [products, searchQuery, selectedCategory, selectedSizeFilter, priceMax, sortBy]);

  const allAvailableSizes = ['All', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header & Sub Nav */}
      <Header />
      <SubNavbar />

      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Main Store Catalog Section */}
      <main id="catalog-section" className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Catalog Control Header */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>Qatar Footwear Showcase</span>
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-semibold">
                  {filteredProducts.length} Footwear Item{filteredProducts.length === 1 ? '' : 's'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {selectedCategory === 'All' 
                  ? 'All Shoes & Luxury Sneakers' 
                  : selectedCategory === 'deals'
                  ? "Today's Flash Deals in Qatar"
                  : `${selectedCategory} Collection (QAR)`}
              </h2>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
                <span>Sort by:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="price-asc">Price: Low to High (QAR)</option>
                <option value="price-desc">Price: High to Low (QAR)</option>
                <option value="rating">Top Rated (★)</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          {/* Quick Filters: Shoe Size Chips & Max Price */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Size filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                <span>Size:</span>
              </span>
              {allAvailableSizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSizeFilter(sz)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                    selectedSizeFilter === sz
                      ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Active search tag */}
            {searchQuery && (
              <div className="flex items-center gap-2 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-md border border-amber-500/30 text-xs">
                <span>Search: "<strong>{searchQuery}</strong>"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-amber-400 hover:text-white font-bold ml-1"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-amber-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No footwear found matching your filter</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              We couldn't find any shoes matching your search or size criteria. Try clearing your search or switching categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedSizeFilter('All');
              }}
              className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Value Proposition Highlights in Qatar */}
        <section className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              WHY ROYAL STEPZ ZONE
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              Qatar's Most Trusted Footwear Experience
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Engineered for seamless ordering in Qatari Riyal with direct WhatsApp communication and same-day Doha dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">24H Express Qatar Delivery</h4>
              <p className="text-xs text-slate-400">
                Fast courier to Doha, Lusail, Al Rayyan, Al Wakrah, and Al Khor right to your villa or apartment door.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">100% Authentic Guarantee</h4>
              <p className="text-xs text-slate-400">
                Every sneaker, running shoe, and loafer is strictly inspected for original craft, premium leather, and durability.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
                <Crown className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Direct WhatsApp Ordering</h4>
              <p className="text-xs text-slate-400">
                Confirm your order details in one click. Our Qatar team communicates directly with you on WhatsApp.
              </p>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Free Size Exchange</h4>
              <p className="text-xs text-slate-400">
                Need a size adjustment? We provide hassle-free size replacement at your convenience across Qatar.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Global Modals & Overlays */}
      <ProductDetailModal />
      <OrderConfirmModal />
      <CartDrawer />
      <AdminDashboard />
      <AuthModal />
      <NotificationsModal />

      {/* Floating WhatsApp Contact */}
      <FloatingWhatsApp />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
