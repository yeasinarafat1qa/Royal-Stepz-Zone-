import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Mail, ShieldAlert, ArrowRight, X, AlertCircle } from 'lucide-react';

interface SecretAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const SecretAdminModal: React.FC<SecretAdminModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { login } = useStore();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminEmail.trim()) {
      setError('দয়া করে আপনার অনুমোদিত অ্যাডমিন জিমেইল প্রবেশ করান');
      return;
    }
    if (!adminKey.trim()) {
      setError('গোপন স্পেশাল কোড (Admin Passkey) প্রবেশ করান');
      return;
    }

    const success = login(adminEmail.trim(), 'admin', adminKey.trim());
    if (success) {
      onLoginSuccess();
      onClose();
    } else {
      setError('ভুল স্পেশাল কোড! অ্যাডমিন কোড সঠিক নয়।');
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/30">
            <ShieldAlert className="w-6 h-6 text-slate-950" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide">
            Royal Stepz • Secret Admin Portal
          </h3>
          <p className="text-xs text-amber-400/90 mt-1 font-mono">
            [Authorized Personnel Access Only]
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Gmail / Email Address:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="yeasinarafat1.qa@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Secret Security Key (গোপন কোড):
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter special passkey"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              ডিফল্ট অ্যাডমিন কোড: <strong className="text-amber-400">admin123</strong> অথবা <strong className="text-amber-400">royal2025</strong>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer mt-2"
          >
            <span>Login & Open Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
