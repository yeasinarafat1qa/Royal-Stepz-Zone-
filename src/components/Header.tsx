import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  ShoppingBag, 
  Search, 
  Crown, 
  User as UserIcon, 
  Bell, 
  PackageCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  Layers,
  PhoneCall
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    cart, 
    setIsCartOpen, 
    user, 
    setIsAuthModalOpen, 
    setIsAdminDashboardOpen,
    setIsNotificationsOpen,
    notifications,
    settings,
    logout,
    orders,
    setSelectedCategory
  } = useStore();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-850 shadow-lg">
      {/* Top micro announcement bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-[11px] py-1 px-4 text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <Sparkles className="w-3 h-3" /> Premier Footwear Qatar
          </span>
          <span className="hidden sm:inline text-slate-400">• Direct WhatsApp Checkout in QAR</span>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Hotline: {settings.whatsappNumber}</span>
          </a>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Logo */}
        <div 
          onClick={() => {
            setSelectedCategory('All');
            setSearchQuery('');
          }}
          className="flex items-center gap-2.5 cursor-pointer flex-shrink-0 group"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
              Royal <span className="text-amber-400">Stepz</span>
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-slate-400 uppercase -mt-1">
              Zone Qatar
            </span>
          </div>
        </div>

        {/* Global Search Bar (Amazon Style) */}
        <form 
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-xl mx-1 sm:mx-4 relative"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Nike, Adidas, Jordan, Qatar Sneaker..."
              className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-400 text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 sm:py-2.5 border border-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          
          {/* Notifications & Orders Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800/80 transition-all relative flex items-center gap-1.5"
            title="Orders & Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <span className="hidden md:inline text-xs font-semibold">Orders</span>
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* User Account / Sign In Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                if (user) {
                  setIsUserMenuOpen(!isUserMenuOpen);
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
              className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-slate-200 hover:bg-slate-900 border border-slate-800/80 transition-all flex items-center gap-1.5"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-xs">
                {user ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <UserIcon className="w-4 h-4" />
                )}
              </div>
              <div className="flex flex-col leading-none text-left">
                <span className="text-[10px] text-slate-400">
                  {user ? 'Welcome,' : 'Hello, sign in'}
                </span>
                <span className="text-xs font-bold text-slate-100 truncate max-w-[80px] sm:max-w-[120px] flex items-center gap-0.5">
                  {user ? user.name.split(' ')[0] : 'Account'}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-750 rounded-xl shadow-2xl p-2 z-50 text-sm">
                <div className="p-2 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-100 truncate">{user.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">
                      {user.isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {user.isAdmin ? 'Qatar Store Headquarters' : user.email}
                  </p>
                  {user.isAdmin && (
                    <span className="mt-1.5 inline-block text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
                      👑 Master Store Admin
                    </span>
                  )}
                </div>

                <div className="py-1">
                  {/* ADMIN DASHBOARD LINK */}
                  {user.isAdmin ? (
                    <>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsAdminDashboardOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 font-bold rounded-lg flex items-center gap-2 text-xs border border-amber-500/20 mb-1"
                      >
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span>Master Admin Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsNotificationsOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg flex items-center gap-2 text-xs"
                      >
                        <PackageCheck className="w-4 h-4 text-amber-400" />
                        <span>স্টোর অর্ডার ও নোটিফিকেশন</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsNotificationsOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-800 hover:text-white rounded-lg flex items-center gap-2 text-xs font-semibold"
                      >
                        <UserIcon className="w-4 h-4 text-amber-400" />
                        <span>কাস্টমার প্রোফাইল ও হিস্ট্রি</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsNotificationsOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg flex items-center gap-2 text-xs"
                      >
                        <PackageCheck className="w-4 h-4 text-emerald-400" />
                        <span>আমার অর্ডারসমূহ (Order History)</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="border-t border-slate-800 pt-1.5">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-lg flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer border border-red-500/20"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      <span>Log Out (লগআউট)</span>
                    </div>
                    <span className="text-[10px] text-red-300/80">Exit</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Drawer Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 sm:px-3 sm:py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-2"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-slate-950 text-amber-400 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-amber-400">
                  {totalCartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline text-xs font-black">
              Cart
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
