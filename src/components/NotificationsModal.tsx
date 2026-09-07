import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Package, 
  Flame, 
  ShoppingBag, 
  MapPin, 
  Truck, 
  CheckCircle2,
  Calendar,
  AlertCircle,
  Edit3,
  Trash2,
  RotateCcw,
  Plus,
  Minus,
  Save,
  ArrowRight,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Order, CartItem, Product } from '../types';

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationsAsRead,
    orders,
    user,
    products,
    settings,
    editOrder,
    cancelOrder,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'notifications' | 'orders'>('orders');

  // Edit order state
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editItems, setEditItems] = useState<CartItem[]>([]);
  const [editPhone, setEditPhone] = useState<string>('');
  const [editCity, setEditCity] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  
  // Product swap modal/selector state
  const [swappingItemIdx, setSwappingItemIdx] = useState<number | null>(null);

  // Cancel order state
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Found another shoe I like better');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  if (!isNotificationsOpen) return null;

  // Initialize edit form
  const startEditingOrder = (ord: Order) => {
    setEditingOrderId(ord.id);
    // Clone items so edits don't mutate original until saved
    setEditItems(JSON.parse(JSON.stringify(ord.items)));
    setEditPhone(ord.customerPhone);
    setEditCity(ord.city);
    setEditAddress(ord.fullAddress);
    setEditNotes(ord.notes || '');
    setCancellingOrderId(null);
    setSwappingItemIdx(null);
  };

  const cancelEditing = () => {
    setEditingOrderId(null);
    setEditItems([]);
    setSwappingItemIdx(null);
  };

  // Update item quantity in editor
  const updateItemQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      if (editItems.length === 1) {
        alert('An order must have at least 1 item. If you wish to discard this entire order, please use Cancel Order.');
        return;
      }
      setEditItems(prev => prev.filter((_, idx) => idx !== index));
    } else {
      setEditItems(prev =>
        prev.map((it, idx) => (idx === index ? { ...it, quantity: newQty } : it))
      );
    }
  };

  // Update item size
  const updateItemSize = (index: number, newSize: string) => {
    setEditItems(prev =>
      prev.map((it, idx) => (idx === index ? { ...it, selectedSize: newSize } : it))
    );
  };

  // Swap item with another product from store
  const handleSwapProduct = (index: number, newProd: Product) => {
    setEditItems(prev =>
      prev.map((it, idx) => {
        if (idx !== index) return it;
        return {
          product: newProd,
          selectedSize: newProd.sizes[0] || 'EU 42',
          selectedColor: newProd.colors[0] || 'Standard',
          quantity: it.quantity,
        };
      })
    );
    setSwappingItemIdx(null);
    setActionMessage(`Swapped to "${newProd.name}"`);
    setTimeout(() => setActionMessage(null), 2500);
  };

  // Save edited order
  const handleSaveOrderChanges = (orderId: string) => {
    if (editItems.length === 0) {
      alert('Order must have at least one product.');
      return;
    }

    editOrder(orderId, {
      items: editItems,
      customerPhone: editPhone,
      city: editCity,
      fullAddress: editAddress,
      notes: editNotes,
    });

    setEditingOrderId(null);
    setActionMessage('Your order has been updated successfully!');
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Confirm cancellation
  const handleConfirmCancel = (orderId: string) => {
    cancelOrder(orderId, cancelReason);
    setCancellingOrderId(null);
    setActionMessage('Your order has been cancelled.');
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Recalculate totals for edit mode
  const currentEditSubtotal = editItems.reduce(
    (acc, it) => acc + it.product.priceQAR * it.quantity,
    0
  );
  const currentEditDeliveryFee =
    currentEditSubtotal >= settings.freeShippingThresholdQAR ? 0 : 25;
  const currentEditTotal = currentEditSubtotal + currentEditDeliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              {activeTab === 'notifications' ? <Bell className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Customer Account & Order Manager
              </h3>
              <p className="text-xs text-slate-400">
                {user ? `Logged in as ${user.name}` : 'Manage, edit or cancel your orders in Qatar'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Action Toast Message */}
        {actionMessage && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2 text-xs text-emerald-400 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold">{actionMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 bg-slate-950/90 border-b border-slate-800 text-xs">
          <button
            onClick={() => {
              setActiveTab('orders');
              setEditingOrderId(null);
              setCancellingOrderId(null);
            }}
            className={`py-3 px-4 font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-amber-500 text-amber-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('notifications');
              setEditingOrderId(null);
              setCancellingOrderId(null);
            }}
            className={`py-3 px-4 font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
              activeTab === 'notifications'
                ? 'border-amber-500 text-amber-400 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications ({notifications.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 max-h-[72vh] overflow-y-auto space-y-4">
          
          {activeTab === 'orders' ? (
            /* MY ORDERS TAB WITH EDIT / CANCEL FUNCTIONALITY */
            <>
              {orders.length === 0 ? (
                <div className="py-14 text-center text-slate-400 text-xs space-y-2">
                  <Package className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="font-bold text-slate-300 text-sm">No orders placed yet</p>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    Browse our Qatar footwear collection. When you place an order, you can manage or modify it here anytime.
                  </p>
                </div>
              ) : (
                orders.map((ord: Order) => {
                  const isEditingThis = editingOrderId === ord.id;
                  const isCancellingThis = cancellingOrderId === ord.id;
                  const canModify = ord.status !== 'Delivered' && ord.status !== 'Cancelled';

                  return (
                    <div
                      key={ord.id}
                      className={`border rounded-2xl p-4 sm:p-5 transition-all ${
                        isEditingThis
                          ? 'bg-slate-900 border-amber-500/80 shadow-2xl ring-1 ring-amber-500/50'
                          : ord.status === 'Cancelled'
                          ? 'bg-slate-950/50 border-slate-800/80 opacity-75'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      {/* Top Order Details Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-amber-400">
                              #{ord.orderNumber}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              ord.status === 'Delivered'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : ord.status === 'Cancelled'
                                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                : ord.status === 'Dispatched'
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                : ord.status === 'Confirmed'
                                ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            }`}>
                              {ord.status === 'Pending' ? 'In Preparation (Qatar 24H)' : ord.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </span>
                        </div>

                        {/* Customer Action Buttons (Edit / Cancel) */}
                        {canModify && !isEditingThis && !isCancellingThis && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditingOrder(ord)}
                              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold rounded-lg text-xs border border-amber-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Change shoes, size or delivery info"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Order</span>
                            </button>

                            <button
                              onClick={() => setCancellingOrderId(ord.id)}
                              className="px-3 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 font-bold rounded-lg text-xs border border-red-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Cancel this order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Cancel Order</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* CANCEL CONFIRMATION DIALOG */}
                      {isCancellingThis && (
                        <div className="my-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl space-y-3 animate-fadeIn">
                          <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>Confirm Cancellation for Order #{ord.orderNumber}</span>
                          </div>
                          <p className="text-xs text-slate-300">
                            Are you sure you want to cancel this order? Please select a reason:
                          </p>
                          <select
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-full py-1.5 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-red-500"
                          >
                            <option value="Found another shoe I like better">Found another shoe I like better</option>
                            <option value="Ordered wrong size or color">Ordered wrong size or color</option>
                            <option value="Need to change delivery location">Need to change delivery location</option>
                            <option value="Will order at a later time">Will order at a later time</option>
                          </select>
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleConfirmCancel(ord.id)}
                              className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs transition-colors"
                            >
                              Yes, Cancel My Order
                            </button>
                            <button
                              onClick={() => setCancellingOrderId(null)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs transition-colors"
                            >
                              Keep Order
                            </button>
                          </div>
                        </div>
                      )}

                      {/* EDIT ORDER VIEW */}
                      {isEditingThis ? (
                        <div className="mt-4 space-y-4 animate-fadeIn">
                          <div className="flex items-center justify-between bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30 text-xs text-amber-300">
                            <div className="flex items-center gap-1.5 font-bold">
                              <Sparkles className="w-4 h-4 text-amber-400" />
                              <span>Edit Shoes, Choose Different Footwear or Change Size</span>
                            </div>
                            <span className="text-[10px] text-slate-400">Live QAR recalculation</span>
                          </div>

                          {/* Editable Items */}
                          <div className="space-y-3">
                            <span className="text-xs font-bold text-slate-300 block">
                              Order Items ({editItems.length}):
                            </span>

                            {editItems.map((item, idx) => (
                              <div
                                key={`${item.product.id}-${idx}`}
                                className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-3"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-14 h-14 object-cover rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-white truncate">
                                      {item.product.name}
                                    </h4>
                                    <div className="text-xs font-black text-amber-400 mt-0.5">
                                      QAR {item.product.priceQAR}
                                    </div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">
                                      Category: {item.product.category}
                                    </div>
                                  </div>

                                  {/* Change Product Button (Swapping) */}
                                  <button
                                    onClick={() => setSwappingItemIdx(swappingItemIdx === idx ? null : idx)}
                                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-lg text-[11px] font-bold border border-slate-700 flex items-center gap-1 transition-colors flex-shrink-0"
                                    title="Choose another shoe from catalog"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                    <span>Swap Shoe</span>
                                  </button>
                                </div>

                                {/* Product Swap Selector Dropdown */}
                                {swappingItemIdx === idx && (
                                  <div className="p-3 bg-slate-900 border border-amber-500/40 rounded-xl space-y-2 animate-fadeIn">
                                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                                      <span>Select another footwear to replace:</span>
                                      <button
                                        onClick={() => setSwappingItemIdx(null)}
                                        className="text-slate-400 hover:text-white"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                                      {products
                                        .filter(p => p.id !== item.product.id)
                                        .map((p) => (
                                          <div
                                            key={p.id}
                                            onClick={() => handleSwapProduct(idx, p)}
                                            className="p-2 bg-slate-950 hover:bg-slate-850 rounded-lg border border-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
                                          >
                                            <img
                                              src={p.image}
                                              alt={p.name}
                                              className="w-8 h-8 rounded object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0 text-xs">
                                              <div className="font-bold text-white truncate">{p.name}</div>
                                              <div className="text-[10px] text-slate-400">{p.category}</div>
                                            </div>
                                            <span className="text-xs font-bold text-amber-400">
                                              QAR {p.priceQAR}
                                            </span>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                )}

                                {/* Size & Quantity Controls */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-900 text-xs">
                                  <div>
                                    <label className="text-[11px] text-slate-400 block mb-1">
                                      Select Shoe Size (EU):
                                    </label>
                                    <div className="flex flex-wrap gap-1">
                                      {item.product.sizes.map((sz) => (
                                        <button
                                          key={sz}
                                          type="button"
                                          onClick={() => updateItemSize(idx, sz)}
                                          className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all ${
                                            item.selectedSize === sz
                                              ? 'bg-amber-500 text-slate-950 border-amber-500'
                                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                                          }`}
                                        >
                                          {sz}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[11px] text-slate-400 block mb-1">
                                      Quantity:
                                    </label>
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center bg-slate-900 rounded border border-slate-800">
                                        <button
                                          type="button"
                                          onClick={() => updateItemQty(idx, item.quantity - 1)}
                                          className="px-2 py-1 text-slate-400 hover:text-white"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="px-2 text-xs font-bold text-white">
                                          {item.quantity}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => updateItemQty(idx, item.quantity + 1)}
                                          className="px-2 py-1 text-slate-400 hover:text-white"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => updateItemQty(idx, 0)}
                                        className="text-[11px] text-slate-500 hover:text-red-400 flex items-center gap-0.5 ml-auto"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                        <span>Remove Item</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Editable Delivery Information */}
                          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                            <span className="font-bold text-white text-xs block">
                              Delivery & Contact Info:
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[11px] text-slate-400 block mb-1">Qatar Mobile:</label>
                                <input
                                  type="text"
                                  value={editPhone}
                                  onChange={(e) => setEditPhone(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] text-slate-400 block mb-1">City/Municipality:</label>
                                <input
                                  type="text"
                                  value={editCity}
                                  onChange={(e) => setEditCity(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] text-slate-400 block mb-1">Full Street/Building Address:</label>
                              <input
                                type="text"
                                value={editAddress}
                                onChange={(e) => setEditAddress(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] text-slate-400 block mb-1">Notes / Instructions:</label>
                              <input
                                type="text"
                                value={editNotes}
                                placeholder="e.g. Deliver before Maghrib or call gate security"
                                onChange={(e) => setEditNotes(e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                              />
                            </div>
                          </div>

                          {/* Updated Total Summary */}
                          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                            <div className="flex justify-between text-slate-400">
                              <span>New Items Subtotal:</span>
                              <span className="font-semibold text-white">QAR {currentEditSubtotal}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                              <span>Qatar Delivery:</span>
                              <span className="font-semibold text-emerald-400">
                                {currentEditDeliveryFee === 0 ? 'FREE' : `QAR ${currentEditDeliveryFee}`}
                              </span>
                            </div>
                            <div className="pt-1.5 border-t border-slate-850 flex justify-between items-baseline">
                              <span className="font-bold text-white">Updated Total:</span>
                              <span className="text-lg font-black text-amber-400">
                                QAR {currentEditTotal}
                              </span>
                            </div>
                          </div>

                          {/* Save or Cancel Editing Buttons */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleSaveOrderChanges(ord.id)}
                              className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                            >
                              <Save className="w-4 h-4" />
                              <span>Save Changes to Order</span>
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                            >
                              Discard
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* REGULAR READ-ONLY ORDER CARD */
                        <div className="mt-3 space-y-3">
                          {/* Order items list */}
                          <div className="space-y-2">
                            {ord.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 bg-slate-900/60 p-2 rounded-xl border border-slate-850"
                              >
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-10 h-10 object-cover rounded-lg bg-slate-900 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0 text-xs">
                                  <div className="font-bold text-white truncate">
                                    {item.product.name}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    Size: <strong className="text-amber-400">{item.selectedSize}</strong>
                                    {' • '}Qty: <strong>{item.quantity}</strong>
                                  </div>
                                </div>
                                <div className="text-xs font-black text-amber-400 text-right">
                                  QAR {item.product.priceQAR * item.quantity}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Delivery & total overview */}
                          <div className="pt-2 border-t border-slate-850 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                              <span className="truncate max-w-xs">{ord.city}, Qatar ({ord.fullAddress})</span>
                            </div>
                            <div className="text-xs">
                              <span className="text-slate-400">Total: </span>
                              <strong className="text-amber-400 font-black">QAR {ord.totalQAR}</strong>
                              <span className="text-slate-500"> ({ord.paymentMethod})</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </>
          ) : (
            /* NOTIFICATIONS TAB */
            <>
              <div className="flex items-center justify-between pb-1 text-xs">
                <span className="text-slate-400">Recent account activity & alerts</span>
                {notifications.some(n => !n.read) && (
                  <button
                    onClick={markNotificationsAsRead}
                    className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all as read</span>
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs space-y-2">
                  <Bell className="w-8 h-8 mx-auto text-slate-600" />
                  <p>No notifications yet.</p>
                  <p className="text-[11px] text-slate-500">
                    When you place an order, edit items or when new shoes arrive, you will receive alerts here.
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      notif.read
                        ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                        : 'bg-slate-950 border-amber-500/40 text-slate-200 shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                        {notif.type === 'order' ? (
                          <Package className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Flame className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-white">
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 flex-shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>24H Qatar Express Customer Care</span>
          </div>
          <button
            onClick={() => setIsNotificationsOpen(false)}
            className="py-2 px-5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
