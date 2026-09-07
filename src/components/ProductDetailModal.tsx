import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Star, 
  Truck, 
  ShieldCheck, 
  MessageCircle, 
  Zap, 
  ShoppingCart, 
  CheckCircle2, 
  Share2, 
  RotateCcw,
  Sparkles 
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    isProductDetailModalOpen,
    setIsProductDetailModalOpen,
    selectedProduct,
    setSelectedProduct,
    addToCart,
    openFastCheckout,
    settings,
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isProductDetailModalOpen || !selectedProduct) return null;

  const currentSize = selectedSize || selectedProduct.sizes[0] || 'EU 42';
  const currentColor = selectedColor || selectedProduct.colors[0] || 'Standard';

  const discountPercent = selectedProduct.originalPriceQAR
    ? Math.round(
        ((selectedProduct.originalPriceQAR - selectedProduct.priceQAR) /
          selectedProduct.originalPriceQAR) *
          100
      )
    : 0;

  const handleClose = () => {
    setIsProductDetailModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDirectWhatsAppInquiry = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello Royal Stepz Zone Qatar! I am interested in ordering:\n\n*${selectedProduct.name}*\n- Size: ${currentSize}\n- Color: ${currentColor}\n- Price: QAR ${selectedProduct.priceQAR}\n\nIs this available for 24h express delivery in Qatar?`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white bg-slate-950/60 hover:bg-slate-800 rounded-full backdrop-blur-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Media Gallery */}
          <div className="relative bg-slate-950 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
            {selectedProduct.badge && (
              <span className="absolute top-4 left-4 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full">
                {selectedProduct.badge}
              </span>
            )}

            <div className="w-full aspect-square max-w-sm rounded-xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800/80 group">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Qatar Delivery & Quality Guarantee Strip */}
            <div className="mt-4 grid grid-cols-3 gap-2 w-full text-center text-[10px] text-slate-400">
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <Truck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span>24h Qatar Delivery</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span>100% Authentic</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                <RotateCcw className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <span>7-Day Exchange</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="p-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                  {selectedProduct.category}
                </span>
                <button
                  onClick={handleShare}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-snug">
                {selectedProduct.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{selectedProduct.rating}</span>
                </div>
                <span className="text-xs text-slate-400">
                  {selectedProduct.reviewsCount} customer reviews in Qatar
                </span>
              </div>

              {/* Price in QAR */}
              <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-baseline gap-3">
                <span className="text-2xl font-black text-amber-400">
                  QAR {selectedProduct.priceQAR}
                </span>
                {selectedProduct.originalPriceQAR && (
                  <span className="text-sm text-slate-500 line-through">
                    QAR {selectedProduct.originalPriceQAR}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Size Selector (EU sizes) */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300">Select Shoe Size (EU):</span>
                  <span className="font-bold text-amber-400">{currentSize}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProduct.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        currentSize === sz
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                          : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              {selectedProduct.colors.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-semibold text-slate-300 mb-1.5">
                    Color Variant: <span className="font-bold text-amber-400">{currentColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                          currentColor === col
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-300">Quantity:</span>
                <div className="flex items-center bg-slate-950 rounded-lg border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-slate-300 hover:text-white font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-bold text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-slate-300 hover:text-white font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-emerald-400 font-medium">In Stock for Qatar</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800">
              {/* Primary Action: Direct Order Confirmation Inter-Page */}
              <button
                onClick={() => {
                  handleClose();
                  openFastCheckout(selectedProduct, currentSize, currentColor);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer transform active:scale-98"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Instant Checkout (QAR {selectedProduct.priceQAR * quantity})</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    addToCart(selectedProduct, currentSize, currentColor, quantity);
                    handleClose();
                  }}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleDirectWhatsAppInquiry}
                  className="py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-emerald-500/40 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-emerald-400" />
                  <span>Ask on WhatsApp</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
