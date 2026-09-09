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
  FileText
} from 'lucide-react';
import { Order } from '../types';

// Self-contained device identifier for privacy
const getCustomerDeviceId = (): string => {
  if (typeof window === 'undefined') return 'server_id';
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
    setIsOrderConfirmModalOpen,
    setLastConfirmedOrder,
    setTargetCheckoutItem,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'notifications' | 'orders'>('orders');
  const currentDeviceId = useMemo(() => getCustomerDeviceId(), []);

  // Filter orders strictly for the current customer / device (Admins see all)
  const myOrders = useMemo(() => {
    if (user?.isAdmin) return orders;
    return orders.filter(o => {
      if (user?.email && o.customerEmail && o.customerEmail.toLowerCase() === user.email.toLowerCase()) {
        return true;
      }
      if (o.deviceId && o.deviceId === currentDeviceId) {
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
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
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
              <div className="space-y-3">
                {myOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                          #{ord.orderNumber}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(ord.status)}
                        <span className="text-sm font-black text-white ml-1">
                          QAR {ord.totalQAR}
                        </span>
                      </div>
                    </div>

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

                    {/* Actions */}
                    <div className="pt-2 border-t border-slate-900 flex justify-end gap-2">
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
                        <span>View Receipt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
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
