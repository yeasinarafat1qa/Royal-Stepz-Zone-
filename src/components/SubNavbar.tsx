import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Menu, 
  Flame, 
  Sparkles, 
  Truck, 
  MessageCircle, 
  Crown,
  ShieldAlert
} from 'lucide-react';

export const SubNavbar: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    settings,
    user,
    setIsAdminDashboardOpen,
    setIsAuthModalOpen,
    setIsNotificationsOpen,
  } = useStore();

  const navItems = [
    { label: 'All', value: 'All' },
    { label: "Today's Deals", value: 'deals', icon: Flame },
    { label: 'Sneakers', value: 'Sneakers' },
    { label: 'Running', value: 'Running' },
    { label: 'Formal Shoes', value: 'Formal' },
    { label: 'Loafers', value: 'Loafers' },
    { label: 'Slides & Sandals', value: 'Slides & Sandals' },
    { label: 'Limited Edition', value: 'Limited Edition', icon: Crown },
  ];

  const handleCategoryClick = (catValue: string) => {
    setSelectedCategory(catValue);
    const catalogElem = document.getElementById('catalog-section');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppQuickChat = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent("Hello Royal Stepz Zone Qatar! I want to inquire about your footwear collection and Qatar express delivery.");
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-4 h-10">
        {/* Navigation Categories Strip */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => handleCategoryClick('All')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded hover:bg-slate-800 text-slate-200 font-semibold"
          >
            <Menu className="w-4 h-4 text-amber-400" />
            <span>All Shoes</span>
          </button>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedCategory === item.value;
            return (
              <button
                key={item.value}
                onClick={() => handleCategoryClick(item.value)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'hover:bg-slate-800 hover:text-white text-slate-300'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action Links: Qatar Fast Delivery & WhatsApp Contact */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-emerald-400 font-medium">
            <Truck className="w-3.5 h-3.5" />
            <span>24h Delivery Across Qatar</span>
          </div>

          {/* My Orders Button */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-amber-400 hover:text-amber-300 border border-slate-700 rounded-md font-semibold transition-colors"
          >
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>My Orders & Edits</span>
          </button>

          <button
            onClick={handleWhatsAppQuickChat}
            className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md font-semibold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Order</span>
          </button>

          {/* If user is the strict admin, provide instant access tag */}
          {user?.isAdmin && (
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-md font-bold"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
