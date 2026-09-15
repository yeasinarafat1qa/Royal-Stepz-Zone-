import React, { useEffect, useState } from 'react';
import { useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { SubNavbar } from './components/SubNavbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { NotificationsModal } from './components/NotificationsModal';
import { OrderConfirmModal } from './components/OrderConfirmModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { 
  ShieldCheck, 
  Crown, 
  ShoppingBag, 
  Search, 
  Sparkles,
  ChevronRight,
  ArrowUpDown,
  LogOut
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    filteredProducts, 
    selectedCategory, 
    searchQuery, 
    sortBy, 
    setSortBy,
    setSelectedCategory,
    products
  } = useStore();

  const [itemsToShow, setItemsToShow] = useState(12);

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Search or Category Banner Notification */}
      {(searchQuery || selectedCategory !== 'All') && (
        <div className="mb-6 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {searchQuery ? (
                <>
                  <Search className="w-5 h-5 text-amber-500" />
                  Search Results for "{searchQuery}"
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Category: {selectedCategory}
                </>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Found {filteredProducts.length} premium footwear items matching your criteria in Qatar
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="featured">Featured / Best Deals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>

            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                }}
                className="text-xs text-amber-500 hover:text-amber-400 font-semibold px-2 py-1"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Grid of Products */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 my-8">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Shoes Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            We couldn't find any footwear matching your exact search. Try exploring all sneakers or clearing your filters.
          </p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
          >
            Browse All Qatar Footwear
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.slice(0, itemsToShow).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length > itemsToShow && (
            <div className="text-center mt-10">
              <button
                onClick={() => setItemsToShow(prev => prev + 12)}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold rounded-xl text-sm transition-all shadow-lg hover:border-slate-700"
              >
                Load More Footwear ({filteredProducts.length - itemsToShow} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export const App: React.FC = () => {
  const { 
    setSelectedCategory, 
    setSearchQuery,
    setIsAdminDashboardOpen,
    user,
    logout
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Master Admin Persistent Header Banner (Keeps Admin logged in & accessible at all times) */}
      {user?.isAdmin && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-xl sticky top-0 z-50 border-b border-amber-400 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> MASTER ADMIN
            </span>
            <span className="font-semibold text-slate-950 text-xs">
              এডমিন লগইন চালু রয়েছে: <strong className="font-extrabold">{user.name}</strong> ({user.email})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="px-3.5 py-1 bg-slate-950 hover:bg-slate-900 text-amber-400 hover:text-amber-300 rounded-lg text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>এডমিন ড্যাশবোর্ডে ফিরে যান (Admin Panel)</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to log out from Master Admin?')) {
                  logout();
                }
              }}
              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 active:scale-95 shadow-sm"
              title="Sign out from Master Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Header & Sub Nav */}
      <Header />
      <SubNavbar />

      {/* Hero Showcase Banner */}
      <HeroBanner />

      {/* Primary Store Products Area */}
      <MainContent />

      {/* Footer Area */}
      <Footer />

      {/* Global Interactive Modals & Drawers */}
      <CartDrawer />
      <ProductDetailModal />
      <AdminDashboard />
      <AuthModal />
      <NotificationsModal />
      <OrderConfirmModal />
      <FloatingWhatsApp />
    </div>
  );
};

export default App;
