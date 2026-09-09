import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Lock, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, login } = useStore();
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [contactInfo, setContactInfo] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!contactInfo) {
      setError('Please enter your Mobile Number or Email');
      return;
    }

    if (role === 'admin' && !adminKey) {
      setError('Please enter Admin Secret Key');
      return;
    }

    const success = login(contactInfo, role, adminKey);
    if (!success) {
      setError('Invalid Admin Secret Key. Try: admin123 or royal2025');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Background Glow */}
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-wide">
            {role === 'customer' ? 'Customer Sign In' : 'Admin Portal Access'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {role === 'customer' 
              ? 'Track orders & receive exclusive Qatar drops' 
              : 'Authorized store management only'}
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => { setRole('customer'); setError(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              role === 'customer'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => { setRole('admin'); setError(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              role === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Store Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {role === 'customer' ? 'Qatar Mobile Number or Email' : 'Admin Username / Email'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {role === 'customer' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              </div>
              <input
                type="text"
                required
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder={role === 'customer' ? '+974 5555 1234 or email' : 'admin@royalstepz.qa'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
              />
            </div>
          </div>

          {role === 'admin' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Admin Secret Passkey
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
                  placeholder="Enter Secret Key (e.g. admin123)"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-amber-500/80 mt-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Default Admin Passkey: <strong>admin123</strong></span>
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all cursor-pointer active:scale-[0.99] mt-2"
          >
            <span>{role === 'customer' ? 'Sign In / Continue' : 'Unlock Admin Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 text-center text-[11px] text-slate-500">
          Qatar Footwear Marketplace • Royal Stepz Zone
        </div>
      </div>
    </div>
  );
};
