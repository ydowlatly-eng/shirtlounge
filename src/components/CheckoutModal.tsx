import React, { useState } from 'react';
import { X, MessageCircle, ShieldCheck, MapPin, Phone, User, Mail, FileText, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerInfo } from '../types/store';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartShipping,
    cartTotal,
    settings,
    placeWhatsAppOrder,
    currentUser,
  } = useStore();

  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState(currentUser?.city || '');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '');
  const [country, setCountry] = useState(currentUser?.country || 'United States');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'whatsapp_pay' | 'bank_transfer'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isCheckoutOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter your WhatsApp phone number');
      return;
    }

    if (!address.trim() || !city.trim()) {
      setErrorMessage('Please enter your delivery street address and city');
      return;
    }

    setIsSubmitting(true);

    const fullPhone = phoneNumber.startsWith('+')
      ? phoneNumber
      : `${countryCode} ${phoneNumber}`;

    const customerData: CustomerInfo = {
      name: fullName.trim(),
      phone: fullPhone.trim(),
      email: email.trim(),
      address: address.trim(),
      apartment: apartment.trim() || undefined,
      city: city.trim(),
      postalCode: postalCode.trim() || 'N/A',
      country: country.trim(),
      notes: notes.trim() || undefined,
    };

    try {
      const { whatsappUrl } = placeWhatsAppOrder(customerData, paymentMethod);
      
      // Attempt opening WhatsApp in a new tab
      try {
        window.open(whatsappUrl, '_blank');
      } catch {
        // Popups might be blocked; OrderSuccessModal provides direct click button
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate WhatsApp order');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-[#101217] border border-[#232733] rounded-2xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#1e222d] flex items-center justify-between bg-[#13151c]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 border border-[#25D366]/30 flex items-center justify-center text-[#25D366]">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white">
                WhatsApp Direct Checkout
              </h2>
              <p className="text-xs text-[#8c94a5]">
                Your order information is packaged & sent directly to the seller on WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-[#8c94a5] hover:text-white rounded-lg hover:bg-[#1c202a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {errorMessage && (
            <div className="p-3 bg-red-950/70 border border-red-800 text-red-200 text-xs rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {/* 1. Customer Contact */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4f800] flex items-center gap-1.5 font-mono-numbers">
              <User className="w-3.5 h-3.5" />
              <span>1. Customer & WhatsApp Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jordan Vance"
                  className="w-full bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  Email (Optional for invoice)
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#5e6677] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan@domain.com"
                    className="w-full bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp Phone with Country Code */}
            <div>
              <label className="block text-xs font-medium text-[#9da3af] mb-1">
                WhatsApp Phone Number * (Where seller will confirm with you)
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-2.5 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="+1">🇺🇸 +1 (US/CA)</option>
                  <option value="+44">🇬🇧 +44 (UK)</option>
                  <option value="+20">🇪🇬 +20 (Egypt)</option>
                  <option value="+966">🇸🇦 +966 (Saudi)</option>
                  <option value="+971">🇦🇪 +971 (UAE)</option>
                  <option value="+49">🇩🇪 +49 (Germany)</option>
                  <option value="+33">🇫🇷 +33 (France)</option>
                  <option value="+61">🇦🇺 +61 (Australia)</option>
                  <option value="+91">🇮🇳 +91 (India)</option>
                  <option value="+34">🇪🇸 +34 (Spain)</option>
                  <option value="+39">🇮🇹 +39 (Italy)</option>
                  <option value="">Other</option>
                </select>
                <div className="relative flex-1">
                  <Phone className="w-3.5 h-3.5 text-[#25D366] absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 555-0199 or full mobile number"
                    className="w-full bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="space-y-3 pt-2 border-t border-[#1a1d26]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4f800] flex items-center gap-1.5 font-mono-numbers">
              <MapPin className="w-3.5 h-3.5" />
              <span>2. Delivery Address</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-[#9da3af] mb-1">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Building / Street address"
                className="w-full bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  Apt / Suite / Floor
                </label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="Apt 4B"
                  className="w-full bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  className="w-full bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  Postal Code / Zip
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="10001"
                  className="w-full bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9da3af] mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United States"
                className="w-full bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9da3af] mb-1">
                Delivery Instructions / Order Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Call before delivery or leave with doorman"
                className="w-full bg-[#161821] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
              />
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="space-y-3 pt-2 border-t border-[#1a1d26]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#d4f800] flex items-center gap-1.5 font-mono-numbers">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>3. Payment Preference</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#d4f800] bg-[#1a1e27] text-white'
                    : 'border-[#242936] bg-[#14161f] text-[#8e95a5] hover:border-[#384052]'
                }`}
              >
                <p className="text-xs font-bold text-white uppercase">Cash on Delivery</p>
                <p className="text-[11px] text-[#717887] mt-0.5">Pay upon package arrival</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('whatsapp_pay')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMethod === 'whatsapp_pay'
                    ? 'border-[#25D366] bg-[#15251c] text-white'
                    : 'border-[#242936] bg-[#14161f] text-[#8e95a5] hover:border-[#384052]'
                }`}
              >
                <p className="text-xs font-bold text-white uppercase flex items-center gap-1">
                  <span>WhatsApp Pay</span>
                  <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                </p>
                <p className="text-[11px] text-[#717887] mt-0.5">Instant proof in chat</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#d4f800] bg-[#1a1e27] text-white'
                    : 'border-[#242936] bg-[#14161f] text-[#8e95a5] hover:border-[#384052]'
                }`}
              >
                <p className="text-xs font-bold text-white uppercase">Bank / Instapay</p>
                <p className="text-[11px] text-[#717887] mt-0.5">Direct wire details</p>
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="p-4 bg-[#14161f] border border-[#232733] rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono-numbers">
              <span className="text-[#8c94a5]">{cart.length} items selected</span>
              <span className="text-white font-bold">
                Subtotal: {settings.currencySymbol}{cartSubtotal.toFixed(2)}
              </span>
            </div>

            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
              {cart.map((it) => (
                <div key={it.id} className="flex justify-between text-[11px] text-[#a4abb8]">
                  <span className="truncate max-w-[280px]">
                    {it.quantity}× {it.product.name} ({it.selectedSize} / {it.selectedColor.name})
                  </span>
                  <span className="font-mono-numbers text-white shrink-0 ml-2">
                    {settings.currencySymbol}{(it.product.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#222632] flex items-center justify-between text-sm font-mono-numbers font-bold">
              <span className="text-white">Total with Delivery:</span>
              <span className="text-[#d4f800] text-base">
                {settings.currencySymbol}{cartTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba5a] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#25D366]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Complete Order on WhatsApp</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>

            <p className="text-[11px] text-center text-[#7a8190]">
              Seller WhatsApp Desk: <span className="text-white font-mono-numbers">+{settings.adminWhatsappNumber}</span>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};
