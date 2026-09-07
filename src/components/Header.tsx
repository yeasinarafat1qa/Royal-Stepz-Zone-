import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  ShoppingCart, 
  MapPin, 
  User as UserIcon, 
  Bell, 
  Crown, 
  ChevronDown, 
  X, 
  ShieldCheck, 
  LogOut, 
  PackageCheck,
  CheckCircle2,
  Menu
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    user,
    cart,
    notifications,
    unreadNotificationsCount,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setIsCartOpen,
    setIsAuthModalOpen,
    setIsAdminDashboardOpen,
    setIsNotificationsOpen,
    logout,
    settings,
  } = useStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLocationTooltip, setShowLocationTooltip] = useState(false);

  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPriceQAR = cart.reduce(
    (acc, item) => acc + item.product.priceQAR * item.quantity,
    0
  );

  const categories = [
    'All Categories',
    'Sneakers',
    'Running',
    'Formal',
    'Loafers',
    'Slides & Sandals',
    'Limited Edition',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled reactively by searchQuery
    const catalogSection = document.getElementById('catalog-section');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a] text-white shadow-xl border-b border-slate-800">
      {/* Top Banner for Qatar Delivery */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 font-semibold text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 tracking-wide">
        <span className="inline-flex items-center gap-1 font-bold">
          ROYAL STEPZ ZONE QATAR
        </span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">
          Fast 24H Delivery in Doha, Lusail & Al Rayyan | Cash on Delivery Available
        </span>
        <span className="hidden sm:inline">•</span>
        <span className="bg-slate-950 text-amber-400 px-2 py-0.5 rounded text-[11px] font-bold">
          Free Delivery
        </span>
      </div>

      {/* Main Amazon-Style Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Menu & Brand Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg lg:hidden"
              aria-label="Open Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          <a href="#" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-400 bg-clip-text text-transparent leading-none">
                ROYAL STEPZ
              </span>
              <span className="text-[10px] tracking-[0.25em] font-bold text-amber-400 uppercase">
                ZONE • QATAR
              </span>
            </div>
          </a>

          {/* Deliver to Qatar Pill (Amazon style) */}
          <div
            className="relative hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:border hover:border-slate-700 cursor-pointer text-xs"
            onClick={() => setShowLocationTooltip(!showLocationTooltip)}
          >
            <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-slate-400 leading-tight">Deliver to</span>
              <span className="font-bold text-slate-100 flex items-center gap-1">
                Doha, Qatar 🇶🇦
              </span>
            </div>

            {showLocationTooltip && (
              <div className="absolute top-12 left-0 w-64 bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-2xl z-50 text-xs">
                <div className="font-bold text-amber-400 mb-1">Coverage in Qatar</div>
                <p className="text-slate-300">
                  We offer 24h express delivery to all municipalities: Doha, Lusail, Al Rayyan, Al Wakrah, Al Khor, and Umm Salal.
                </p>
                <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cash on Delivery available
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Amazon-Style Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-2xl mx-1 sm:mx-2 flex items-center rounded-lg overflow-hidden bg-slate-900 border border-slate-700 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/30 transition-all"
        >
          {/* Category Dropdown */}
          <div className="relative hidden md:block">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by Category"
              className="h-10 bg-slate-800 text-slate-200 text-xs font-medium px-3 pr-7 border-r border-slate-700 focus:outline-none cursor-pointer appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === 'All Categories' ? 'All' : cat}>
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-3 pointer-events-none" />
          </div>

          {/* Search Input */}
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sneakers, loafers, running shoes in QAR..."
              className="w-full h-10 px-3.5 bg-slate-900 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            aria-label="Submit search"
            className="h-10 px-4 sm:px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition-colors flex items-center justify-center flex-shrink-0"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Right Action Icons & User Controls */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          {/* Qatar Flag & Currency */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 font-semibold border border-slate-800 rounded-md bg-slate-900/60">
            <span className="text-sm">🇶🇦</span>
            <span>QAR</span>
          </div>

          {/* Customer Notifications Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800/80 rounded-lg transition-colors"
            title="Notifications & Order Updates"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Account / User Menu Dropdown (Amazon style) */}
          <div className="relative">
            <button
              onClick={() => {
                if (!user) {
                  setIsAuthModalOpen(true);
                } else {
                  setIsUserMenuOpen(!isUserMenuOpen);
                }
              }}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
                {user?.isAdmin ? (
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="text-[10px] text-slate-400">
                  {user ? 'Welcome,' : 'Hello, sign in'}
                </span>
                <span className="text-xs font-bold text-slate-100 truncate max-w-[90px] flex items-center gap-0.5">
                  {user ? user.name.split(' ')[0] : 'Account'}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-sm">
                <div className="p-2 border-b border-slate-800">
                  <p className="font-bold text-slate-100 truncate">{user.name}</p>
                 <p className="text-xs text-slate-400 truncate">
  {user.isAdmin ? 'Qatar Store Headquarters' : user.email}
</p>
                  {user.isAdmin && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full border border-amber-500/30">
                      Master Administrator 👑
                    </span>
                  )}
                </div>

                <div className="py-1">
                  {/* ADMIN DASHBOARD LINK - ONLY APPEARS IF USER IS THE STRICT MASTER ADMIN! */}
                  {user.isAdmin && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setIsAdminDashboardOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-amber-400 hover:bg-amber-500/10 font-bold rounded-lg flex items-center gap-2"
                    >
                      <Crown className="w-4 h-4 text-amber-400" />
                      Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsNotificationsOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg flex items-center gap-2 text-xs"
                  >
                    <PackageCheck className="w-4 h-4 text-amber-400" />
                    My Orders & Notifications
                  </button>
                </div>

                <div className="border-t border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 text-xs"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon & Total (Amazon style) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all text-slate-100"
            title="View Cart"
            aria-label="View shopping cart"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              {cartTotalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartTotalItems}
                </span>
              )}
            </div>
            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="text-[10px] text-amber-400 font-semibold">Cart</span>
              <span className="text-xs font-bold text-white">
                QAR {cartTotalPriceQAR}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
