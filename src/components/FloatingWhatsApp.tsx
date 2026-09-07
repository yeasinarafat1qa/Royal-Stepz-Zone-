import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { settings, cart } = useStore();
  const [showTooltip, setShowTooltip] = useState(true);

  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const handleWhatsAppClick = () => {
    let text = "Hello Royal Stepz Zone Qatar! 🇶🇦\nI am browsing your footwear store and would like to order.";
    if (cart.length > 0) {
      const itemsList = cart.map(it => `• ${it.quantity}x ${it.product.name} (Size ${it.selectedSize}) - QAR ${it.product.priceQAR * it.quantity}`).join('\n');
      text = `Hello Royal Stepz Zone Qatar! 🇶🇦\nI have the following shoes in my cart and want to confirm order:\n\n${itemsList}\n\nPlease let me know about 24h express delivery in Qatar!`;
    }
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {showTooltip && (
        <div className="bg-slate-900 border border-slate-700 text-white text-xs py-1.5 px-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Order or Chat on WhatsApp 🇶🇦</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <button
        onClick={handleWhatsAppClick}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 hover:scale-110 active:scale-95 transition-all group"
        title="Direct WhatsApp Order & Support"
        aria-label="Order on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};
