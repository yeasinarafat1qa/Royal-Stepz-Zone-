import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Menu, 
  X, 
  Phone, 
  ShieldAlert, 
  LogOut,
  Bell
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    cart, 
    setIsCartOpen, 
    isAuthOpen,
    setIsAuthOpen, 
    user, 
    logout, 
    setIsAdminOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setIsNotificationsOpen,
    notifications,
    orders
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  // Calculate unread notifications & active orders count
  const unreadCount = notifications.filter(n => !n.read).length;
  const activeOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Dispatched').length;
  const notificationBadgeTotal = unreadCount > 0 ? unreadCount : (activeOrdersCount > 0 ? activeOrdersCount : 0);

  const categories = ['All', 'Sneakers', 'Casual', 'Running', 'Luxury', 'Slides'];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner - Qatar Hotline */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 text-xs py-1.5 px-4 font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
            <span>🇶🇦 Express 24h Delivery Across Qatar • Free on orders over 300 QAR</span>
          </div>
          <a 
            href="https://wa.me/97455551234" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline font-bold"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>WhatsApp: +974 5555 1234</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Mobile menu trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                <span className="text-slate-950 font-black text-xl tracking-tighter">RS</span>
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-xl tracking-wider text-white flex items-center gap-1">
                  ROYAL <span className="text-amber-400 font-black">STEPZ</span>
                </span>
                <span className="text-[10px] text-amber-500/90 font-mono tracking-widest block -mt-1 uppercase">
                  ZONE • QATAR
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sneakers, Jordans, Yeezy, Panda..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-full text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Desktop Categories */}
          <nav className="hidden lg:flex items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Orders & Notifications Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 sm:p-2.5 text-slate-300 hover:text-amber-400 transition-colors rounded-full hover:bg-slate-850"
              title="My Orders & Notifications"
            >
              <Bell className="w-5 h-5" />
              {notificationBadgeTotal > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center animate-pulse shadow">
                  {notificationBadgeTotal}
                </span>
              )}
            </button>

            {/* User Account / Admin Action */}
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2">
                {user.isAdmin ? (
                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-all shadow-sm"
                    title="Open Admin Portal"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline font-mono uppercase tracking-wider">
                      Admin
                    </span>
                  </button>
                ) : (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                    <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate max-w-[90px]">{user.name}</span>
                  </div>
                )}
                <button
                  onClick={logout}
                  title="Sign Out / Log Out"
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-full hover:bg-slate-800/80 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(!isAuthOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 hover:border-amber-500 text-slate-200 hover:text-white text-xs font-medium transition-all cursor-pointer shadow-sm"
                title="Customer / Admin Sign In"
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline font-semibold">Sign In</span>
              </button>
            )}

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold px-3.5 py-2 rounded-full transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Bag</span>
              {totalItems > 0 && (
                <span className="bg-slate-950 text-amber-400 text-xs font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shoes, sneakers..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Categories
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setIsMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800">
            {user ? (
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Signed in as: <strong>{user.name}</strong></span>
                <button
                  onClick={logout}
                  className="text-red-400 hover:underline font-bold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAuthOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer w-full text-left font-semibold"
              >
                <UserIcon className="w-4 h-4 text-amber-400" />
                <span>Sign In / Admin Access</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
