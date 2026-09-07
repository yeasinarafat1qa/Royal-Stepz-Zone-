import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Crown, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    login, 
    setIsAdminDashboardOpen 
  } = useStore();

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password');
      return;
    }

    const result = login(email, password, name || undefined);

    if (result.success) {
      setSuccessMsg(result.message);
      setTimeout(() => {
        handleClose();
        // If master admin logged in, open the Admin Dashboard immediately!
        if (result.isAdmin) {
          setIsAdminDashboardOpen(true);
        }
      }, 700);
    } else {
      setErrorMsg(result.message);
    }
  };

  // Quick helper to autofill admin credentials for testing
  const handleAutofillAdmin = () => {
    setEmail('yeasinarafat1.qa@gmail.com');
    setPassword('Ar@2925');
    setName('Yeasin Arafat');
    setAuthMode('admin');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              {authMode === 'admin' ? <Crown className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {authMode === 'admin'
                  ? 'Master Admin Portal 🇶🇦'
                  : authMode === 'register'
                  ? 'Create Royal Stepz Account'
                  : 'Customer Sign In'}
              </h3>
              <p className="text-xs text-slate-400">
                {authMode === 'admin'
                  ? 'Authorized administrator login only'
                  : 'Access your orders, wishlist, and exclusive Qatar footwear drops'}
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

        {/* Auth Mode Toggle Bar */}
        <div className="grid grid-cols-3 bg-slate-950 p-1 border-b border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMsg('');
            }}
            className={`py-2 text-center font-bold rounded-lg transition-colors ${
              authMode === 'login'
                ? 'bg-slate-800 text-amber-400 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMsg('');
            }}
            className={`py-2 text-center font-bold rounded-lg transition-colors ${
              authMode === 'register'
                ? 'bg-slate-800 text-amber-400 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('admin');
              setErrorMsg('');
            }}
            className={`py-2 text-center font-bold rounded-lg transition-colors ${
              authMode === 'admin'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Admin 👑
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Name Field (if registering) */}
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Faisal Al-Hajri"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder={authMode === 'admin' ? 'yeasinarafat1.qa@gmail.com' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-2.5 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all ${
              authMode === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {authMode === 'admin' ? (
              <>
                <Crown className="w-3.5 h-3.5" />
                <span>Sign In as Master Admin</span>
              </>
            ) : authMode === 'register' ? (
              <span>Create Customer Account</span>
            ) : (
              <span>Sign In to Royal Stepz</span>
            )}
          </button>

          {/* Helpful quick test button for Admin */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={handleAutofillAdmin}
              className="w-full py-1.5 px-2 bg-slate-950 hover:bg-slate-800 text-amber-400 text-[11px] rounded-lg border border-amber-500/20 flex items-center justify-center gap-1 font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Authorized Admin Credentials (yeasinarafat1.qa@gmail.com)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
