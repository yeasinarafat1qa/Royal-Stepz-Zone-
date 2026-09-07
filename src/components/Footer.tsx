import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Crown, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ChevronUp,
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setIsAdminDashboardOpen, setSelectedCategory } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWhatsApp = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=Hello%20Royal%20Stepz%20Zone%20Qatar!`, '_blank');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* Amazon-style Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white font-semibold flex items-center justify-center gap-1.5 transition-colors border-b border-slate-800"
      >
        <ChevronUp className="w-4 h-4 text-amber-400" />
        <span>Back to Top</span>
      </button>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand & Qatar Headquarters */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Crown className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-white leading-none">
                  ROYAL STEPZ ZONE
                </span>
                <span className="text-[10px] tracking-widest font-bold text-amber-400 uppercase">
                  QATAR PREMIER FOOTWEAR
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-sm">
              Royal Stepz Zone is Qatar's foremost destination for exclusive streetwear sneakers, luxury Italian calfskin loafers, and high-performance athletic footwear. Serving Doha and all municipalities with guaranteed authenticity and 24-hour fast delivery.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{settings.storeAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>WhatsApp Hotline: {settings.whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Email: {settings.supportEmail}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleOpenWhatsApp}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center gap-2 text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Contact Qatar WhatsApp Support</span>
              </button>
            </div>
          </div>

          {/* Col 3: Footwear Categories */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Footwear Collections</h4>
            <ul className="space-y-2">
              {['Sneakers', 'Running', 'Formal', 'Loafers', 'Slides & Sandals', 'Limited Edition'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    {cat} (QAR)
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Qatar Express Delivery & Policies */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Qatar Fast Service</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>24H Doha Express</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Cash on Delivery (COD)</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                <span>7-Day Free Size Exchange</span>
              </li>
              <li><span>Lusail & Pearl-Qatar Delivery</span></li>
              <li><span>Al Rayyan & Al Wakrah Delivery</span></li>
            </ul>
          </div>

          {/* Col 5: Security & Secret Admin Portal */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3">Store Operations</h4>
            <p className="text-slate-400 text-xs mb-3">
              All prices are listed in Qatari Riyal (QAR). Authentic footwear with official certification.
            </p>

            {/* Discreet Admin Login Link */}
            <div className="pt-2 border-t border-slate-850">
              <button
                onClick={() => setIsAdminDashboardOpen(true)}
                className="text-slate-600 hover:text-slate-400 flex items-center gap-1.5 text-[11px] transition-colors"
                title="Management Gate (Ctrl+Shift+A)"
              >
                <Lock className="w-3 h-3 text-slate-600" />
                <span>Private Portal</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Royal Stepz Zone Qatar. All Rights Reserved. Designed in Doha.
          </div>
          <div className="flex items-center gap-4">
            <span>Currency: <strong>QAR</strong></span>
            <span>Language: <strong>English</strong></span>
            <span className="flex items-center gap-1">
              <span>Delivery Country: Qatar</span> 🇶🇦
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
