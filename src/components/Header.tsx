import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Bell,
  LogOut,
  Package,
  MessageCircle,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    cart,
    setIsCartOpen,
    isAuthOpen,
    setIsAuthOpen,
    user,
    logout,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setIsNotificationsOpen,
    notifications,
    orders,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const categories = [
    'All',
    'Sneakers',
    'Casual',
    'Running',
    'Luxury',
    'Slides',
  ];

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const activeOrdersCount = orders.filter(
    (order) =>
      order.status === 'Pending' ||
      order.status === 'Confirmed' ||
      order.status === 'Processing' ||
      order.status === 'Dispatched' ||
      order.status === 'Shipped'
  ).length;

  const notificationBadgeTotal =
    unreadCount > 0 ? unreadCount : activeOrdersCount;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setIsMobileMenuOpen(false);
  };

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(e.target.value);
  };

  const handleAccountClick = () => {
    if (user) {
      setIsUserMenuOpen((current) => !current);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const whatsappNumber = '97455551234';

  return (
    <>
      {/* WhatsApp Announcement Bar */}
      <div className="bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <MessageCircle size={16} />

          <span>Need help? WhatsApp us:</span>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline underline-offset-2 hover:text-emerald-100"
          >
            +974 5555 1234
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950 text-white shadow-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[72px] items-center gap-3">
            {/* Mobile Menu */}
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() =>
                setIsMobileMenuOpen((current) => !current)
              }
              className="rounded-lg p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>

            {/* Logo */}
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              }}
              className="shrink-0 text-left"
            >
              <div className="text-lg font-black leading-none tracking-tight sm:text-xl">
                <span className="text-amber-400">ROYAL</span>
                <span className="ml-1 text-white">STEPZ</span>
              </div>

              <div className="mt-1 text-[9px] font-semibold tracking-[0.28em] text-zinc-400">
                ZONE • QATAR
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 lg:flex">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-amber-400 text-black'
                      : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </nav>

            {/* Search */}
            <div className="relative ml-auto hidden max-w-md flex-1 md:block">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search shoes, sneakers, sandals..."
                aria-label="Search products"
                className="w-full rounded-xl border border-white/10 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />

              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative rounded-xl p-2.5 text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              <Bell size={21} />

              {notificationBadgeTotal > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {notificationBadgeTotal > 99
                    ? '99+'
                    : notificationBadgeTotal}
                </span>
              )}
            </button>

            {/* Account */}
            <div className="relative">
              <button
                type="button"
                onClick={handleAccountClick}
                className="hidden items-center gap-2 rounded-xl p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white sm:flex"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-black">
                  <User size={17} />
                </div>

                <div className="hidden max-w-[110px] text-left xl:block">
                  <div className="truncate text-xs text-zinc-400">
                    {user ? 'Welcome' : 'Hello, sign in'}
                  </div>

                  <div className="truncate text-sm font-semibold text-white">
                    {user?.name || 'Account'}
                  </div>
                </div>

                <ChevronDown size={15} />
              </button>

              {isUserMenuOpen && user && (
                <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
                  <div className="border-b border-white/10 px-4 py-4">
                    <p className="font-bold text-white">
                      {user.name}
                    </p>

                    {user.email && (
                      <p className="mt-1 truncate text-xs text-zinc-400">
                        {user.email}
                      </p>
                    )}

                    {user.phone && (
                      <p className="mt-1 text-xs text-zinc-400">
                        {user.phone}
                      </p>
                    )}

                    {user.isAdmin && (
                      <span className="mt-2 inline-block rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold text-black">
                        ADMIN
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsNotificationsOpen(true);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-white/10 hover:text-white"
                  >
                    <Package size={17} />
                    My Orders
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 border-t border-white/10 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              type="button"
              aria-label="Open shopping cart"
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-xl bg-amber-400 p-2.5 text-black transition hover:bg-amber-300"
            >
              <ShoppingCart size={21} />

              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white ring-2 ring-zinc-950">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Search */}
          <div className="pb-3 md:hidden">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                aria-label="Search products"
                className="w-full rounded-xl border border-white/10 bg-zinc-900 py-2.5 pl-10 pr-10 text-sm text-white outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />

              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t border-white/10 bg-zinc-950 lg:hidden">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      handleCategoryChange(category)
                    }
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      selectedCategory === category
                        ? 'border-amber-400 bg-amber-400 text-black'
                        : 'border-white/10 bg-zinc-900 text-zinc-300 hover:border-amber-400/50 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Mobile Account */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);

                  if (user) {
                    setIsUserMenuOpen(true);
                  } else {
                    setIsAuthOpen(true);
                  }
                }}
                className="mt-3 flex w-full items-center gap-3 rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-left text-sm font-semibold text-white"
              >
                <User size={18} />
                {user ? `Account: ${user.name}` : 'Sign in / Register'}
              </button>

              {/* Mobile Notifications */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsNotificationsOpen(true);
                }}
                className="mt-2 flex w-full items-center justify-between rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
              >
                <span className="flex items-center gap-3">
                  <Bell size={18} />
                  Notifications
                </span>

                {notificationBadgeTotal > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold">
                    {notificationBadgeTotal}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
