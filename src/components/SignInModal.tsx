import React, { useState } from 'react';
import { X, User, Shield, Lock, Mail, Phone, MapPin, CheckCircle, ArrowRight, LogOut, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SignInModal: React.FC = () => {
  const {
    isAuthOpen,
    setIsAuthOpen,
    currentUser,
    loginCustomer,
    loginAdmin,
    logout,
    setIsAdminOpen,
    orders,
    settings,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  if (!isAuthOpen) return null;

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!customerEmail.trim()) {
      setAuthError('Please enter a valid email');
      return;
    }
    loginCustomer(customerEmail.trim(), customerName.trim(), customerPhone.trim());
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const success = loginAdmin(adminPin);
    if (!success) {
      setAuthError('Incorrect Admin passcode. (Try "admin123" or "shirtloung2025")');
    }
  };

  // Orders placed by current customer (if customer logged in)
  const myOrders = currentUser
    ? orders.filter(
        (o) =>
          o.customer.email.toLowerCase() === currentUser.email.toLowerCase() ||
          (currentUser.phone && o.customer.phone.includes(currentUser.phone))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-[#101217] border border-[#232733] rounded-2xl sm:rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 p-2 text-[#8c94a5] hover:text-white rounded-lg hover:bg-[#1a1d25] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If user is already logged in, show user dashboard */}
        {currentUser ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1c202a] border border-[#2c3242] flex items-center justify-center text-white">
                {currentUser.isAdmin ? (
                  <Shield className="w-6 h-6 text-[#d4f800]" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white uppercase">{currentUser.name}</h2>
                  {currentUser.isAdmin && (
                    <span className="px-2 py-0.5 bg-[#d4f800]/20 text-[#d4f800] text-[10px] font-bold rounded font-mono-numbers">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8c94a5] font-mono-numbers">{currentUser.email}</p>
              </div>
            </div>

            {/* Admin Shortcuts if Admin */}
            {currentUser.isAdmin && (
              <div className="p-4 bg-[#141721] border border-[#252a38] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Admin Management Console
                    </h3>
                    <p className="text-[11px] text-[#8c94a5]">
                      Put new product images, edit catalog, and view incoming WhatsApp orders.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsAuthOpen(false);
                    setIsAdminOpen(true);
                  }}
                  className="w-full py-2.5 px-4 bg-[#d4f800] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-[#c3e400] transition-colors flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Open Admin Portal</span>
                </button>
              </div>
            )}

            {/* Customer Orders History */}
            {!currentUser.isAdmin && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4f800] flex items-center gap-1.5 font-mono-numbers">
                  <Package className="w-3.5 h-3.5" />
                  <span>My WhatsApp Orders ({myOrders.length})</span>
                </h3>

                {myOrders.length === 0 ? (
                  <p className="text-xs text-[#717887] p-4 bg-[#14161f] rounded-xl border border-[#202430]">
                    No previous orders recorded for this account.
                  </p>
                ) : (
                  <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                    {myOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3 bg-[#14161f] border border-[#222633] rounded-xl text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between font-mono-numbers">
                          <span className="font-bold text-white">#{ord.orderNumber}</span>
                          <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded text-[10px] uppercase">
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#8c94a5] flex justify-between">
                          <span>{ord.items.length} item(s)</span>
                          <span className="font-bold text-white font-mono-numbers">
                            {settings.currencySymbol}{ord.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Logout button */}
            <div className="pt-2 border-t border-[#1c202a]">
              <button
                onClick={logout}
                className="w-full py-2.5 px-4 bg-[#161821] hover:bg-[#20242f] text-red-400 border border-[#262b38] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Register Tabs */
          <div>
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#d4f800] font-mono-numbers">
                SHIRTLOUNG IDENTITY
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
                Access Portal
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-[#14161e] border border-[#232733] rounded-xl mb-6">
              <button
                onClick={() => {
                  setActiveTab('customer');
                  setAuthError('');
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'customer'
                    ? 'bg-[#d4f800] text-black shadow-md'
                    : 'text-[#9ea3af] hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setAuthError('');
                }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-[#d4f800] text-black shadow-md'
                    : 'text-[#9ea3af] hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </button>
            </div>

            {authError && (
              <div className="p-3 mb-4 bg-red-950/70 border border-red-800 text-red-200 text-xs rounded-xl font-medium">
                {authError}
              </div>
            )}

            {/* Customer Tab */}
            {activeTab === 'customer' ? (
              <form onSubmit={handleCustomerSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#9da3af] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Liam Taylor"
                    className="w-full bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9da3af] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="liam@gmail.com"
                    className="w-full bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9da3af] mb-1">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-white hover:bg-[#d4f800] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-2"
                >
                  Sign In / Create Account
                </button>

                <p className="text-[11px] text-center text-[#717887]">
                  No complex passwords required. Quick email access to track orders and save your address.
                </p>
              </form>
            ) : (
              /* Admin Tab */
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div className="p-3 bg-[#151821] border border-[#252936] rounded-xl text-xs space-y-1">
                  <p className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#d4f800]" />
                    <span>Store Admin Access</span>
                  </p>
                  <p className="text-[#8c94a5]">
                    Unlock full administrative rights to upload new images, add streetwear drops, and manage orders.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9da3af] mb-1">
                    Admin Passcode
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#5e6677] absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={adminPin}
                      onChange={(e) => setAdminPin(e.target.value)}
                      placeholder="Enter admin passcode"
                      className="w-full bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Quick 1-click Demo Admin Login button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-[#d4f800] hover:bg-[#c3e400] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    Unlock Admin Mode
                  </button>
                </div>

                <div className="pt-2 border-t border-[#1a1d26] flex items-center justify-between text-xs text-[#8c94a5]">
                  <span>Demo Passcode: <strong className="text-white font-mono-numbers">admin123</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminPin('admin123');
                      loginAdmin('admin123');
                    }}
                    className="text-[#d4f800] hover:underline font-bold"
                  >
                    Quick Unlock
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
