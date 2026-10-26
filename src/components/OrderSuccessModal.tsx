import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Copy, Check, ExternalLink, X, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderSuccessModal: React.FC = () => {
  const {
    lastPlacedOrder,
    isOrderSuccessOpen,
    setIsOrderSuccessOpen,
    settings,
  } = useStore();

  const [copied, setCopied] = useState(false);

  if (!isOrderSuccessOpen || !lastPlacedOrder) return null;

  const cleanPhone = settings.adminWhatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    lastPlacedOrder.whatsappMessage
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(lastPlacedOrder.whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-[#101217] border border-[#232733] rounded-2xl sm:rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOrderSuccessOpen(false)}
          className="absolute top-4 right-4 p-2 text-[#8c94a5] hover:text-white rounded-lg hover:bg-[#1a1d25] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero checkmark icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shadow-lg shadow-[#25D366]/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#d4f800] font-mono-numbers">
              ORDER CREATED · #{lastPlacedOrder.orderNumber}
            </span>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              Ready for WhatsApp Dispatch
            </h2>
            <p className="text-xs text-[#9ea3af] max-w-md mx-auto">
              Your order has been recorded. Tap below to launch your WhatsApp chat with our store team and confirm shipping.
            </p>
          </div>
        </div>

        {/* Main WhatsApp Launch CTA */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba5a] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#25D366]/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Open WhatsApp to Complete Order</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-3 px-4 bg-[#161922] hover:bg-[#202430] border border-[#292f3f] text-[#d4d8e3] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Order Text Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#9ea3af]" />
                <span>Copy Order Message Text</span>
              </>
            )}
          </button>
        </div>

        {/* Order Details Breakdown */}
        <div className="mt-6 p-4 bg-[#14161f] border border-[#222633] rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#212633]">
            <span className="text-[#8c94a5]">Recipient:</span>
            <span className="text-white font-bold">{lastPlacedOrder.customer.name}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-[#212633]">
            <span className="text-[#8c94a5]">Phone / WhatsApp:</span>
            <span className="text-white font-mono-numbers">{lastPlacedOrder.customer.phone}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-[#212633]">
            <span className="text-[#8c94a5]">Shipping Address:</span>
            <span className="text-white text-right max-w-[240px] truncate">
              {lastPlacedOrder.customer.address}, {lastPlacedOrder.customer.city}
            </span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-[#212633]">
            <span className="text-[#8c94a5]">Items Ordered:</span>
            <span className="text-white font-mono-numbers">{lastPlacedOrder.items.length} styles</span>
          </div>

          <div className="flex items-center justify-between font-mono-numbers font-bold text-sm pt-1">
            <span className="text-white">Total Amount:</span>
            <span className="text-[#d4f800]">
              {settings.currencySymbol}{lastPlacedOrder.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Back to store */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsOrderSuccessOpen(false)}
            className="text-xs text-[#8c94a5] hover:text-white transition-colors uppercase tracking-wider font-bold inline-flex items-center gap-1"
          >
            <span>Back to Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
