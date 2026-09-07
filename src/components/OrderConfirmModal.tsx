import React, { useState } from 'react';
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
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Bell
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
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert('Please enter your full name');
      return;
    }

    if (!phone.trim() || phone.length < 8) {
      alert('Please enter a valid Qatar phone or WhatsApp number');
      return;
    }

    if (!address.trim()) {
      alert('Please provide your Qatar delivery address (Zone, Street, Building / Villa)');
      return;
    }

    setIsSubmitting(true);

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

    // Call store placeOrder
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

    // Note: Do not auto-open WhatsApp - the customer confirmed on the website,
    // so show the full successful order receipt page right on the website.
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-1.5">
                <span>{orderSuccess ? 'Order Placed Successfully!' : 'Order Confirmation & Checkout'}</span>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold border border-amber-500/30">
                  🇶🇦 Qatar 24H Delivery
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {orderSuccess
                  ? 'Your order has been confirmed on the website and sent to our Qatar operations team.'
                  : 'Fill in your details below to confirm order for fast 24h delivery across Qatar.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {orderSuccess ? (
          /* DEDICATED CUSTOMER SUCCESS RECEIPT PAGE */
          <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Top Celebration Badge */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                  Order Successfully Placed
                </span>
                <h2 className="text-2xl font-black text-white mt-2">
                  Order #{orderSuccess.orderNumber}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
                  Thank you, <strong className="text-amber-400">{orderSuccess.customerName}</strong>! Your order is confirmed and scheduled for 24-hour express courier delivery in Qatar.
                </p>
              </div>
            </div>

            {/* Notification alert banner */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-3 text-xs text-amber-200">
              <Bell className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Account Notification Added:</strong> A confirmation alert has been delivered to your Account Notifications. You can review your order status anytime from the top bell icon.
              </div>
            </div>

            {/* Order Progress Stepper */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                Qatar Delivery Tracker
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-xs">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center mb-1 shadow">
                    ✓
                  </div>
                  <span className="font-bold text-emerald-400">Order Placed</span>
                  <span className="text-[9px] text-slate-500">Confirmed</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center mb-1 animate-pulse">
                    2
                  </div>
                  <span className="font-bold text-amber-400">Processing</span>
                  <span className="text-[9px] text-slate-400">In Preparation</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-500 font-bold flex items-center justify-center mb-1">
                    3
                  </div>
                  <span className="text-slate-400 font-medium">Dispatched</span>
                  <span className="text-[9px] text-slate-500">24H Courier</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-500 font-bold flex items-center justify-center mb-1">
                    4
                  </div>
                  <span className="text-slate-400 font-medium">Delivered</span>
                  <span className="text-[9px] text-slate-500">Qatar Doorstep</span>
                </div>
              </div>
            </div>

            {/* Customer & Delivery Information Card */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-white text-xs uppercase tracking-wider">
                  Customer & Delivery Information
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(orderSuccess.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[11px]">Customer Full Name:</span>
                  <strong className="text-white text-xs">{orderSuccess.customerName}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Mobile / WhatsApp:</span>
                  <strong className="text-amber-400 text-xs">{orderSuccess.customerPhone}</strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Municipality / City:</span>
                  <strong className="text-white text-xs">{orderSuccess.city}, Qatar</strong>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px]">Payment Method:</span>
                  <strong className="text-emerald-400 text-xs">{orderSuccess.paymentMethod}</strong>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-slate-500 block text-[11px]">Full Delivery Address:</span>
                  <span className="text-slate-200 text-xs">{orderSuccess.fullAddress}</span>
                </div>

                {orderSuccess.notes && (
                  <div className="sm:col-span-2 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Special Instructions:</span>
                    <span className="text-amber-200 text-xs">{orderSuccess.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ordered Items Itemized Receipt */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <span className="font-bold text-white text-xs uppercase tracking-wider block pb-2 border-b border-slate-800">
                Ordered Footwear ({orderSuccess.items.length} item{orderSuccess.items.length > 1 ? 's' : ''})
              </span>

              <div className="space-y-2">
                {orderSuccess.items.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${idx}`}
                    className="flex items-center gap-3 py-1.5 border-b border-slate-900 last:border-0"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Size: <strong className="text-amber-400">{item.selectedSize}</strong>
                        {item.selectedColor && ` • ${item.selectedColor}`}
                        {' • '}Qty: <strong>{item.quantity}</strong>
                      </div>
                    </div>
                    <div className="text-xs font-black text-amber-400 text-right">
                      QAR {item.product.priceQAR * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="text-slate-200 font-semibold">QAR {orderSuccess.subtotalQAR}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Qatar 24H Express Delivery:</span>
                  <span className="text-emerald-400 font-semibold">
                    {orderSuccess.deliveryFeeQAR === 0 ? 'FREE' : `QAR ${orderSuccess.deliveryFeeQAR}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="font-bold text-white text-sm">Total Payable on Delivery:</span>
                  <span className="text-xl font-black text-amber-400">
                    QAR {orderSuccess.totalQAR}
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
                  className="py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span>View in My Notifications</span>
                </button>

                <button
                  onClick={handleClose}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <span>Continue Shopping</span>
                </button>
              </div>

              {/* Optional WhatsApp Inquiry if customer wants to contact */}
              <div className="text-center pt-2 border-t border-slate-800/80">
                <a
                  href={generatedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Have questions? Optional: Chat about this order on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ORDER FORM VIEW (THE INTER-PAGE) */
          <form onSubmit={handleOrderSubmit} className="p-4 sm:p-6 space-y-5">
            {/* Selected Product Review Strip */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
              {targetCheckoutItem ? (
                <>
                  <img
                    src={targetCheckoutItem.product.image}
                    alt={targetCheckoutItem.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-amber-500 uppercase">
                      {targetCheckoutItem.product.category}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">
                      {targetCheckoutItem.product.name}
                    </h4>
                    <div className="text-xs font-black text-amber-400 mt-0.5">
                      QAR {targetCheckoutItem.product.priceQAR}
                    </div>

                    {/* Quick Size and Qty Selector in the Inter-Page */}
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">Size:</span>
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
                        <span className="text-slate-400">Qty:</span>
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
                  <div className="text-xs text-amber-400 font-bold mb-1">
                    Checking out {checkoutItems.length} item(s) from Bag:
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {checkoutItems.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-slate-300">
                        <span>{it.quantity}x {it.product.name} ({it.selectedSize})</span>
                        <span className="font-bold text-amber-400">QAR {it.product.priceQAR * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Customer Information Inputs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Customer & Delivery Details (Qatar)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mohammed Al-Kuwari"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Qatar Phone / WhatsApp <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+974 5555 1234"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
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
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
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
                    Detailed Delivery Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Zone 69, Street 250, Building 14, Villa/Apt 402"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
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
                    { id: 'Direct QAR Transfer', label: 'QAR Bank Transfer', icon: ShieldCheck },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as Order['paymentMethod'])}
                        className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300'
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
                <span>Express 24h Qatar Delivery:</span>
                <span className={`font-semibold ${deliveryFeeQAR === 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                  {deliveryFeeQAR === 0 ? 'FREE (Qatar Special)' : `QAR ${deliveryFeeQAR}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Grand Total:</span>
                <span className="text-xl font-black text-amber-400">QAR {totalQAR}</span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all text-sm sm:text-base cursor-pointer transform active:scale-98"
              >
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
                <span>Confirm & Place Order (QAR {totalQAR})</span>
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
  );
};
