import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CartItem, Order } from '../types';
import { 
  X, 
  CheckCircle2, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  CreditCard, 
  Banknote, 
  ShoppingBag,
  Bell,
  Copy,
  Check,
  Printer,
  Clock,
  AlertCircle,
  PackageCheck
} from 'lucide-react';

export const OrderConfirmModal: React.FC = () => {
  const {
    isOrderConfirmModalOpen,
    setIsOrderConfirmModalOpen,
    targetCheckoutItem,
    setTargetCheckoutItem,
    cart,
    user,
    settings,
    placeOrder,
    lastConfirmedOrder,
    setLastConfirmedOrder,
    setIsNotificationsOpen
  } = useStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Determine items to order
  const checkoutItems: CartItem[] = targetCheckoutItem
    ? [targetCheckoutItem]
    : cart;

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '+974 ');
  const [city, setCity] = useState('Doha');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Cash on Delivery');
  const [selectedSize, setSelectedSize] = useState<string>(
    targetCheckoutItem?.selectedSize || (checkoutItems[0]?.selectedSize || 'EU 42')
  );
  const [quantity, setQuantity] = useState<number>(targetCheckoutItem?.quantity || 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [copiedOrderNumber, setCopiedOrderNumber] = useState<boolean>(false);

  // Sync with target item and user data
  useEffect(() => {
    if (targetCheckoutItem) {
      setSelectedSize(targetCheckoutItem.selectedSize || 'EU 42');
      setQuantity(targetCheckoutItem.quantity || 1);
      setOrderSuccess(null);
    } else if (cart.length > 0 && !orderSuccess) {
      setSelectedSize(cart[0].selectedSize || 'EU 42');
      setQuantity(1);
    }
    setFormError('');
  }, [targetCheckoutItem, isOrderConfirmModalOpen]);

  useEffect(() => {
    if (user?.name && !fullName) {
      setFullName(user.name);
    }
    if (user?.phone && (!phone || phone === '+974 ')) {
      setPhone(user.phone);
    }
  }, [user]);

  if (!isOrderConfirmModalOpen) return null;

  // Qatar municipalities
  const qatarCities = [
    'Doha',
    'Lusail',
    'Al Rayyan',
    'Al Wakrah',
    'Al Khor',
    'Umm Salal',
    'Al Daayen',
    'Al Shahaniya',
  ];

  // Pricing calculation
  const subtotalQAR = targetCheckoutItem
    ? targetCheckoutItem.product.priceQAR * quantity
    : checkoutItems.reduce((acc, it) => acc + it.product.priceQAR * it.quantity, 0);

  const deliveryFeeQAR = subtotalQAR >= settings.freeShippingThresholdQAR ? 0 : 25;
  const totalQAR = subtotalQAR + deliveryFeeQAR;

  const handleClose = () => {
    setIsOrderConfirmModalOpen(false);
    setOrderSuccess(null);
    setTargetCheckoutItem(null);
    setFormError('');
  };

  const handleCopyOrderNumber = (orderNum: string) => {
    navigator.clipboard.writeText(orderNum).then(() => {
      setCopiedOrderNumber(true);
      setTimeout(() => setCopiedOrderNumber(false), 2500);
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('Please enter your full name (অনুগ্রহ করে আপনার পুরো নাম লিখুন)');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 7) {
      setFormError('Please enter a valid Qatar mobile or WhatsApp number (সঠিক কাতারি ফোন বা WhatsApp নম্বর লিখুন)');
      return;
    }

    if (!address.trim()) {
      setFormError('Please enter your Qatar delivery address (Zone, Street, Building / Villa) - কাতারের বিস্তারিত ঠিকানা লিখুন');
      return;
    }

    // Prepare final items
    const finalItems: CartItem[] = targetCheckoutItem
      ? [
          {
            ...targetCheckoutItem,
            selectedSize,
            quantity,
          },
        ]
      : checkoutItems;

    if (finalItems.length === 0) {
      setFormError('No footwear items selected for checkout. Please add shoes to bag.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { order, whatsappUrl } = placeOrder({
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        city,
        fullAddress: address.trim(),
        notes: notes.trim() || undefined,
        paymentMethod,
        items: finalItems,
      });

      setOrderSuccess(order);
      setGeneratedWhatsAppUrl(whatsappUrl);
      setIsSubmitting(false);

      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } catch (err) {
      console.error('Order submission error:', err);
      setFormError('There was an issue recording your order. Please try again or WhatsApp us.');
      setIsSubmitting(false);
    }
  };

  const activeDisplayOrder = orderSuccess || (isOrderConfirmModalOpen && !targetCheckoutItem && cart.length === 0 && lastConfirmedOrder ? lastConfirmedOrder : null);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        ref={scrollContainerRef}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              {activeDisplayOrder ? <PackageCheck className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-1.5">
                <span>{activeDisplayOrder ? 'Order Confirmed! / অর্ডার নিশ্চিত হয়েছে' : 'Order Checkout & Delivery'}</span>
                <span className="text-[11px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold border border-amber-500/30">
                  🇶🇦 Qatar Express
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {activeDisplayOrder
                  ? 'Your order has been officially received and scheduled for 24h delivery across Qatar.'
                  : 'Enter your Qatar delivery details to complete your order directly on the website.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {activeDisplayOrder ? (
            /* =========================================================================
               DEDICATED FULL ORDER CONFIRMATION RECEIPT PAGE
               ========================================================================= */
            <div className="space-y-6 animate-fadeIn">
              {/* Celebration Icon & Main Status */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 animate-bounce">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                    Official Order Confirmed 🇶🇦
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                    Thank You, {activeDisplayOrder.customerName}!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                    আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে। কাতারে ২৪ ঘণ্টার মধ্যে আপনার ঠিকানায় জুতো ডেলিভারি দেওয়া হবে।
                  </p>
                </div>
              </div>

              {/* PROMINENT ORDER NUMBER CARD (Large & Copyable) */}
              <div className="bg-slate-950 border-2 border-amber-500/50 rounded-2xl p-4 sm:p-5 text-center space-y-3 shadow-xl shadow-amber-500/10 relative overflow-hidden">
                <div className="text-xs font-black text-amber-500 uppercase tracking-widest">
                  YOUR ORDER NUMBER / অর্ডার নম্বর
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <span className="text-2xl sm:text-4xl font-black text-white font-mono tracking-wider bg-slate-900 px-4 py-2 rounded-xl border border-amber-500/40">
                    #{activeDisplayOrder.orderNumber}
                  </span>
                  <button
                    onClick={() => handleCopyOrderNumber(activeDisplayOrder.orderNumber)}
                    className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    {copiedOrderNumber ? (
                      <>
                        <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-950" />
                        <span>Copy Order #</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Placed on: {new Date(activeDisplayOrder.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Qatar Delivery Stepper */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center justify-between">
                  <span>Qatar 24H Delivery Tracker</span>
                  <span className="text-emerald-400 font-bold text-[11px]">Step 1 Complete</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center mb-1 shadow">
                      ✓
                    </div>
                    <span className="font-bold text-emerald-400">Confirmed</span>
                    <span className="text-[9px] text-slate-400">Order Received</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center mb-1 animate-pulse">
                      2
                    </div>
                    <span className="font-bold text-amber-400">Preparing</span>
                    <span className="text-[9px] text-slate-400">Quality Check</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 font-bold flex items-center justify-center mb-1">
                      3
                    </div>
                    <span className="text-slate-400 font-medium">Dispatched</span>
                    <span className="text-[9px] text-slate-500">24H Courier</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-500 font-bold flex items-center justify-center mb-1">
                      4
                    </div>
                    <span className="text-slate-400 font-medium">Delivered</span>
                    <span className="text-[9px] text-slate-500">Doorstep Qatar</span>
                  </div>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>Customer & Delivery Destination</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    {activeDisplayOrder.city}, Qatar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Customer Name:</span>
                    <strong className="text-white text-sm">{activeDisplayOrder.customerName}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Qatar Mobile / WhatsApp:</span>
                    <strong className="text-amber-400 text-sm">{activeDisplayOrder.customerPhone}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Payment Method:</span>
                    <strong className="text-emerald-400 text-sm">{activeDisplayOrder.paymentMethod}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Delivery Timeframe:</span>
                    <strong className="text-slate-200 text-sm">Within 24 Hours Express</strong>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[11px]">Delivery Address:</span>
                    <div className="text-slate-200 text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800 mt-1 flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{activeDisplayOrder.fullAddress}</span>
                    </div>
                  </div>

                  {activeDisplayOrder.notes && (
                    <div className="sm:col-span-2 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Special Instructions:</span>
                      <span className="text-amber-300 text-xs">{activeDisplayOrder.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ordered Items Itemized Receipt */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
                <span className="font-bold text-white text-xs uppercase tracking-wider block pb-2 border-b border-slate-800">
                  Ordered Footwear Items ({activeDisplayOrder.items.length})
                </span>

                <div className="space-y-2.5">
                  {activeDisplayOrder.items.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${idx}`}
                      className="flex items-center gap-3 py-2 border-b border-slate-900 last:border-0"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {item.product.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Size: <strong className="text-amber-400 font-bold">{item.selectedSize}</strong>
                          {item.selectedColor && ` • Color: ${item.selectedColor}`}
                          {' • '}Qty: <strong>{item.quantity}</strong>
                        </div>
                      </div>
                      <div className="text-xs font-black text-amber-400 text-right">
                        QAR {item.product.priceQAR * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="text-slate-200 font-semibold">QAR {activeDisplayOrder.subtotalQAR}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Qatar 24H Express Courier:</span>
                    <span className="text-emerald-400 font-semibold">
                      {activeDisplayOrder.deliveryFeeQAR === 0 ? 'FREE (Special)' : `QAR ${activeDisplayOrder.deliveryFeeQAR}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="font-bold text-white text-sm sm:text-base">Total Payable on Delivery:</span>
                    <span className="text-xl sm:text-2xl font-black text-amber-400">
                      QAR {activeDisplayOrder.totalQAR}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Customer */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={() => {
                      handleClose();
                      setIsNotificationsOpen(true);
                    }}
                    className="py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    <span>View in My Orders (আমার অর্ডার)</span>
                  </button>

                  <button
                    onClick={handleClose}
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors cursor-pointer"
                  >
                    <span>Continue Shopping (আরও জুতো দেখুন)</span>
                  </button>
                </div>

                {/* WhatsApp & Print Receipt buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <a
                    href={generatedWhatsAppUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Chat about Order on WhatsApp</span>
                  </a>

                  <button
                    onClick={handlePrintReceipt}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================================
               ORDER CHECKOUT FORM VIEW
               ========================================================================= */
            <form onSubmit={handleOrderSubmit} className="space-y-5">
              {/* Validation error message banner */}
              {formError && (
                <div className="bg-red-500/15 border-2 border-red-500/60 text-red-300 px-4 py-3 rounded-xl flex items-start gap-2.5 text-xs font-semibold animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Selected Shoes Review Strip */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                {targetCheckoutItem ? (
                  <>
                    <img
                      src={targetCheckoutItem.product.image}
                      alt={targetCheckoutItem.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                        {targetCheckoutItem.product.category}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">
                        {targetCheckoutItem.product.name}
                      </h4>
                      <div className="text-xs font-black text-amber-400 mt-0.5">
                        QAR {targetCheckoutItem.product.priceQAR}
                      </div>

                      {/* Quick Size and Qty Selector */}
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 font-medium">Size:</span>
                          <select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            className="bg-slate-800 text-white rounded px-2 py-0.5 border border-slate-700 text-xs font-semibold cursor-pointer"
                          >
                            {targetCheckoutItem.product.sizes.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 font-medium">Qty:</span>
                          <div className="flex items-center bg-slate-800 rounded border border-slate-700">
                            <button
                              type="button"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="px-2 py-0.5 text-slate-300 hover:text-white"
                            >
                              -
                            </button>
                            <span className="px-1.5 font-bold text-white">{quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity(quantity + 1)}
                              className="px-2 py-0.5 text-slate-300 hover:text-white"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full">
                    <div className="text-xs text-amber-400 font-bold mb-1.5 flex items-center justify-between">
                      <span>Checking out {checkoutItems.length} item(s) from Shopping Bag:</span>
                      <span className="text-slate-400 font-normal">Subtotal: QAR {subtotalQAR}</span>
                    </div>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto">
                      {checkoutItems.map((it, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                          <div className="flex items-center gap-2 truncate">
                            <img src={it.product.image} alt={it.product.name} className="w-8 h-8 rounded object-cover" />
                            <span className="truncate">{it.quantity}x {it.product.name} ({it.selectedSize})</span>
                          </div>
                          <span className="font-bold text-amber-400 ml-2">QAR {it.product.priceQAR * it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Information Inputs */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Customer & Delivery Details in Qatar</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Full Name (আপনার পুরো নাম) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mohammed Al-Kuwari"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (formError) setFormError('');
                        }}
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Phone / WhatsApp */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Qatar Mobile / WhatsApp (মোবাইল নম্বর) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        placeholder="+974 5555 1234"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (formError) setFormError('');
                        }}
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* City & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Municipality / City <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full py-2 px-3 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      {qatarCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Detailed Delivery Address (ঠিকানা) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        placeholder="Zone 69, Street 250, Building 14, Villa/Apt 402"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (formError) setFormError('');
                        }}
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Special instructions / notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Special Delivery Instructions / Notes (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Call before arrival, deliver after 5:00 PM"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Payment Method in Qatar
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote },
                      { id: 'Card on Delivery', label: 'Card on Delivery', icon: CreditCard },
                      { id: 'Direct QAR Transfer', label: 'QAR Transfer', icon: ShieldCheck },
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id as Order['paymentMethod'])}
                          className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500 text-amber-300 ring-1 ring-amber-500/50'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                          <span>{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Price Breakdown in QAR */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({checkoutItems.length} item{checkoutItems.length > 1 ? 's' : ''}):</span>
                  <span className="font-semibold text-slate-200">QAR {subtotalQAR}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Express 24h Qatar Courier:</span>
                  <span className={`font-semibold ${deliveryFeeQAR === 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {deliveryFeeQAR === 0 ? 'FREE (Qatar Special)' : `QAR ${deliveryFeeQAR}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Grand Total Payable:</span>
                  <span className="text-xl font-black text-amber-400">QAR {totalQAR}</span>
                </div>
              </div>

              {/* Submit Action */}
              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all text-sm sm:text-base cursor-pointer transform active:scale-98 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-5 h-5 text-slate-950" />
                  <span>
                    {isSubmitting ? 'Processing Order...' : `Confirm & Place Order (QAR ${totalQAR})`}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Instant Order Placement on Website
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-amber-400" /> 24H Qatar Express Courier
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
