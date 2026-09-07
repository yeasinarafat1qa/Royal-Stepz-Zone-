import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    setIsOrderConfirmModalOpen,
    setTargetCheckoutItem,
    settings,
  } = useStore();

  if (!isCartOpen) return null;

  const subtotalQAR = cart.reduce(
    (acc, item) => acc + item.product.priceQAR * item.quantity,
    0
  );
  const deliveryFeeQAR = subtotalQAR >= settings.freeShippingThresholdQAR ? 0 : 25;
  const totalQAR = subtotalQAR + deliveryFeeQAR;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setTargetCheckoutItem(null); // Whole cart checkout
    setIsOrderConfirmModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">
                Your Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery progress bar */}
          <div className="p-3 bg-slate-950/60 border-b border-slate-800 text-xs">
            {subtotalQAR >= settings.freeShippingThresholdQAR ? (
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Truck className="w-4 h-4" />
                <span>You unlocked FREE 24H Delivery in Qatar! 🇶🇦</span>
              </div>
            ) : (
              <div>
                <span className="text-slate-300">
                  Add <strong className="text-amber-400">QAR {settings.freeShippingThresholdQAR - subtotalQAR}</strong> more for Free Qatar Express Delivery.
                </span>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (subtotalQAR / settings.freeShippingThresholdQAR) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-slate-300">Your bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore our premium footwear collection and select your favorite shoes in Qatar.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex gap-3 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {item.product.name}
                    </h4>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Size: <strong className="text-slate-200">{item.selectedSize}</strong>
                      {item.selectedColor && ` • ${item.selectedColor}`}
                    </div>
                    <div className="text-xs font-black text-amber-400 mt-1">
                      QAR {item.product.priceQAR}
                    </div>

                    {/* Quantity modifier */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-slate-800 rounded border border-slate-700">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                        className="text-[11px] text-slate-500 hover:text-red-400 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-white">QAR {subtotalQAR}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Qatar Delivery:</span>
                  <span className={`font-semibold ${deliveryFeeQAR === 0 ? 'text-emerald-400' : 'text-white'}`}>
                    {deliveryFeeQAR === 0 ? 'FREE' : `QAR ${deliveryFeeQAR}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Total:</span>
                  <span className="text-xl font-black text-amber-400">QAR {totalQAR}</span>
                </div>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer transform active:scale-98"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Proceed to Fast Checkout (QAR {totalQAR})</span>
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-[11px] text-slate-500 hover:text-red-400 py-1"
              >
                Clear Entire Bag
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
