import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Bell, 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle, 
  ShoppingBag, 
  MapPin, 
  Calendar,
  Phone,
  MessageCircle,
  FileText,
  AlertCircle,
  Edit2,
  Trash2,
  Check,
  Save,
  ChevronRight
} from 'lucide-react';
import { Order, CartItem } from '../types';

// Self-contained device identifier for privacy & isolation
const getCustomerDeviceId = (): string => {
  if (typeof window === 'undefined') return 'server_device';
  let id = localStorage.getItem('rsz_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem('rsz_device_id', id);
  }
  return id;
};

export const NotificationsModal: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    orders,
    user,
    markNotificationAsRead,
    cancelOrder,
    editOrder,
    settings,
    setIsOrderConfirmModalOpen,
    setLastConfirmedOrder,
    setTargetCheckoutItem,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'notifications' | 'orders'>('orders');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');
  
  // Order Editing State
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editCustomerName, setEditCustomerName] = useState<string>('');
  const [editCustomerPhone, setEditCustomerPhone] = useState<string>('');
  const [editFullAddress, setEditFullAddress] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editItems, setEditItems] = useState<CartItem[]>([]);
  const [editSuccessMsg, setEditSuccessMsg] = useState<string>('');

  const currentDeviceId = useMemo(() => getCustomerDeviceId(), []);

  // Filter orders strictly for the current customer / device (Admins see all)
  const myOrders = useMemo(() => {
    if (user?.isAdmin) return orders;

    let storedOrderIds: string[] = [];
    try {
      const raw = localStorage.getItem('rsz_my_order_ids');
      if (raw) storedOrderIds = JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading stored order IDs:', e);
    }

    return orders.filter(o => {
      // Check 1: Explicit match with saved order IDs in this browser's local storage
      if (storedOrderIds.includes(o.id) || storedOrderIds.includes(o.orderNumber)) {
        return true;
      }
      // Check 2: Device ID exact match
      if (o.deviceId && o.deviceId === currentDeviceId) {
        return true;
      }
      // Check 3: Logged in email
      if (user?.email && o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()) {
        return true;
      }
      // Check 4: Logged in phone
      if (user?.phone && o.customerPhone && o.customerPhone.replace(/[^0-9]/g, '') === user.phone.replace(/[^0-9]/g, '')) {
        return true;
      }
      return false;
    });
  }, [orders, user, currentDeviceId]);

  // Filter notifications strictly for the current customer / device (Admins see all)
  const myNotifications = useMemo(() => {
    if (user?.isAdmin) return notifications;
    return notifications.filter(n => {
      if (n.type === 'system' || n.type === 'deal') {
        return true;
      }
      if (user?.email && n.recipientEmail && n.recipientEmail.toLowerCase() === user.email.toLowerCase()) {
        return true;
      }
      if (n.deviceId && n.deviceId === currentDeviceId) {
        return true;
      }
      return false;
    });
  }, [notifications, user, currentDeviceId]);

  if (!isNotificationsOpen) return null;

  const handleClose = () => {
    setIsNotificationsOpen(false);
    setCancellingOrderId(null);
    setEditingOrderId(null);
    setEditSuccessMsg('');
  };

  const handleStartEdit = (order: Order) => {
    setEditingOrderId(order.id);
    setEditCustomerName(order.customerName);
    setEditCustomerPhone(order.customerPhone);
    setEditFullAddress(order.fullAddress);
    setEditNotes(order.notes || '');
    setEditItems(JSON.parse(JSON.stringify(order.items)));
    setCancellingOrderId(null);
    setEditSuccessMsg('');
  };

  const handleSaveEdit = (orderId: string) => {
    if (!editCustomerName.trim() || !editCustomerPhone.trim() || !editFullAddress.trim()) {
      alert('Please fill in Name, Phone, and Address.');
      return;
    }

    editOrder(orderId, {
      customerName: editCustomerName.trim(),
      customerPhone: editCustomerPhone.trim(),
      fullAddress: editFullAddress.trim(),
      notes: editNotes.trim() || undefined,
      items: editItems,
    });

    setEditSuccessMsg('Order details updated successfully!');
    setTimeout(() => {
      setEditingOrderId(null);
      setEditSuccessMsg('');
    }, 1500);
  };

  const handleConfirmCancel = (orderId: string) => {
    cancelOrder(orderId, cancelReason.trim() || 'Cancelled via customer portal');
    setCancellingOrderId(null);
    setCancelReason('');
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30"><Clock className="w-3 h-3" /> Received</span>;
      case 'Confirmed':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30"><CheckCircle className="w-3 h-3" /> Confirmed</span>;
      case 'Dispatched':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30"><Truck className="w-3 h-3" /> Out for Delivery</span>;
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30"><CheckCircle className="w-3 h-3" /> Delivered</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Tabs */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>My Orders ({myOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications ({myNotifications.filter(n => !n.read).length})</span>
            </button>
          </div>

          <button
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'orders' ? (
            myOrders.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-white font-bold text-base">No Orders Placed Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  আপনার এই ডিভাইস থেকে এখনো কোনো জুতো অর্ডার করা হয়নি। পছন্দের জুতো বেছে নিয়ে অর্ডার প্লেস করুন!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((ord) => {
                  const isEditingThis = editingOrderId === ord.id;
                  const isCancellingThis = cancellingOrderId === ord.id;
                  const canModify = ord.status === 'Pending' || ord.status === 'Confirmed';

                  return (
                    <div
                      key={ord.id}
                      className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-colors"
                    >
                      {/* Top Info */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                        <div>
                          <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                            #{ord.orderNumber}
                          </span>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>{new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(ord.status)}
                          <span className="text-sm font-black text-white ml-1">
                            QAR {ord.totalQAR}
                          </span>
                        </div>
                      </div>

                      {/* EDIT MODE FORM */}
                      {isEditingThis ? (
                        <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-3.5 space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit Order Details / সাইজ পরিবর্তন</span>
                            </span>
                            <button
                              onClick={() => setEditingOrderId(null)}
                              className="text-[11px] text-slate-400 hover:text-white"
                            >
                              Cancel Edit
                            </button>
                          </div>

                          {editSuccessMsg && (
                            <div className="p-2 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded flex items-center gap-1.5">
                              <Check className="w-4 h-4" />
                              <span>{editSuccessMsg}</span>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                            <div>
                              <label className="block text-slate-400 mb-1">Customer Name:</label>
                              <input
                                type="text"
                                value={editCustomerName}
                                onChange={(e) => setEditCustomerName(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-slate-400 mb-1">Phone / WhatsApp:</label>
                              <input
                                type="text"
                                value={editCustomerPhone}
                                onChange={(e) => setEditCustomerPhone(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white font-mono"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-slate-400 mb-1">Delivery Address:</label>
                              <input
                                type="text"
                                value={editFullAddress}
                                onChange={(e) => setEditFullAddress(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white"
                              />
                            </div>
                          </div>

                          {/* Shoe Sizes in Order */}
                          <div className="space-y-2 pt-2 border-t border-slate-800">
                            <span className="text-xs font-bold text-slate-300">Change Shoes Size:</span>
                            {editItems.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs bg-slate-950 p-2 rounded border border-slate-800">
                                <span className="text-slate-200 truncate flex-1">{item.product.name}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-slate-400">Size:</span>
                                  <select
                                    value={item.selectedSize}
                                    onChange={(e) => {
                                      const newSize = e.target.value;
                                      setEditItems(prev => prev.map((it, i) => i === idx ? { ...it, selectedSize: newSize } : it));
                                    }}
                                    className="bg-slate-800 border border-slate-700 text-amber-400 rounded px-2 py-0.5 font-bold"
                                  >
                                    {(item.product.sizes || ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44']).map(s => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => handleSaveEdit(ord.id)}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Changes</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* NORMAL VIEW */
                        <>
                          {/* Items */}
                          <div className="space-y-1.5">
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                                <img src={it.product.image} alt={it.product.name} className="w-8 h-8 rounded object-cover border border-slate-800" />
                                <span className="truncate flex-1 font-medium">{it.quantity}x {it.product.name}</span>
                                <span className="text-[11px] text-amber-400 font-semibold">{it.selectedSize}</span>
                              </div>
                            ))}
                          </div>

                          {/* Address Strip */}
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1 truncate">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span className="truncate">{ord.fullAddress}, {ord.city}</span>
                          </div>

                          {/* CANCEL CONFIRMATION BOX */}
                          {isCancellingThis && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 space-y-2 text-xs">
                              <span className="text-red-400 font-bold block">
                                Are you sure you want to cancel this order? (অর্ডারটি বাতিল করতে চান?)
                              </span>
                              <input
                                type="text"
                                placeholder="Reason for cancellation (optional)"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-white text-xs"
                              />
                              <div className="flex justify-end gap-2 pt-1">
                                <button
                                  onClick={() => setCancellingOrderId(null)}
                                  className="px-2.5 py-1 text-slate-400 hover:text-white"
                                >
                                  Keep Order
                                </button>
                                <button
                                  onClick={() => handleConfirmCancel(ord.id)}
                                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-xs"
                                >
                                  Confirm Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2">
                            {/* Receipt Button */}
                            <button
                              onClick={() => {
                                setLastConfirmedOrder(ord);
                                setTargetCheckoutItem(null);
                                setIsNotificationsOpen(false);
                                setIsOrderConfirmModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 font-bold rounded-lg text-xs border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-amber-400" />
                              <span>View Golden Receipt</span>
                            </button>

                            {/* Edit & Cancel Buttons (Only if Pending or Confirmed) */}
                            {canModify && !isCancellingThis && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleStartEdit(ord)}
                                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-lg text-xs border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit Details</span>
                                </button>

                                <button
                                  onClick={() => setCancellingOrderId(ord.id)}
                                  className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-lg text-xs border border-red-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Cancel</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            /* NOTIFICATIONS TAB */
            myNotifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                কোনো নতুন নোটিফিকেশন নেই
              </div>
            ) : (
              <div className="space-y-2.5">
                {myNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{notif.title}</span>
                      <span className="text-[10px] text-slate-500">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-400">{notif.message}</p>

                    {/* Quick view receipt link */}
                    {notif.orderId && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            const found = orders.find(o => o.id === notif.orderId);
                            if (found) {
                              setLastConfirmedOrder(found);
                              setTargetCheckoutItem(null);
                              setIsNotificationsOpen(false);
                              setIsOrderConfirmModalOpen(true);
                            } else {
                              setActiveTab('orders');
                            }
                          }}
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>View Golden Receipt</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
