import React from 'react';
import { X, Trash2, ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartItemQty,
    removeFromCart,
    cartSubtotal,
    cartShipping,
    cartTotal,
    cartCount,
    settings,
    setIsCheckoutOpen,
  } = useStore();

  if (!isCartOpen) return null;

  const freeShippingLeft = Math.max(0, settings.freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(
    100,
    (cartSubtotal / settings.freeShippingThreshold) * 100
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#101217] border-l border-[#20242e] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#1d212b]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#d4f800]" />
                <h2 className="text-base font-bold uppercase tracking-wider text-white">
                  Shopping Bag
                </h2>
                <span className="text-xs font-mono-numbers px-2 py-0.5 bg-[#1b1f29] text-[#9ea3af] rounded-full border border-white/10">
                  {cartCount} items
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-[#8c93a4] hover:text-white rounded-lg hover:bg-[#1a1d25] transition-colors"
                aria-label="Close bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free shipping progress bar */}
            <div className="mt-4 p-3 bg-[#161821] border border-[#232733] rounded-xl text-xs space-y-1.5">
              <div className="flex items-center justify-between font-mono-numbers">
                <span className="text-[#9ea3af]">
                  {freeShippingLeft === 0
                    ? '🎉 You unlocked FREE SHIPPING!'
                    : `Add ${settings.currencySymbol}${freeShippingLeft.toFixed(2)} for Free Shipping`}
                </span>
                <span className="text-white font-bold">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#252a37] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d4f800] transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-[#171a22] flex items-center justify-center text-2xl mb-3 border border-[#272d3b]">
                  🛍️
                </div>
                <p className="text-sm font-bold uppercase text-white">Your bag is empty</p>
                <p className="text-xs text-[#717887] mt-1 max-w-[220px]">
                  Explore our heavyweight tees and hoodies to find your next fit.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-4 py-2 bg-[#d4f800] text-black font-bold text-xs uppercase rounded-xl hover:bg-[#c3e400] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#151720] border border-[#212530] rounded-xl relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-20 object-cover rounded-lg bg-[#1a1d26] shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-white truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#656c7d] hover:text-red-400 p-0.5 transition-colors shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Size & Color unboxed metadata */}
                      <div className="flex items-center gap-1.5 text-[11px] text-[#868d9e] mt-0.5 font-mono-numbers">
                        <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{item.selectedColor.name}</span>
                      </div>
                    </div>

                    {/* Quantity & Item Total */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#272c3a] bg-[#111319] rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartItemQty(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#9ea3af] hover:text-white text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono-numbers text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQty(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#9ea3af] hover:text-white text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-white font-mono-numbers">
                        {settings.currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#1d212b] bg-[#12141a] space-y-3">
              <div className="space-y-1.5 text-xs text-[#8c94a5]">
                <div className="flex justify-between font-mono-numbers">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold">
                    {settings.currencySymbol}{cartSubtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-mono-numbers">
                  <span>Estimated Shipping</span>
                  <span className="text-white font-semibold">
                    {cartShipping === 0 ? 'FREE' : `${settings.currencySymbol}${cartShipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#202430] font-mono-numbers">
                  <span>Total</span>
                  <span className="text-base text-[#d4f800]">
                    {settings.currencySymbol}{cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* WhatsApp Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp ({settings.currencySymbol}{cartTotal.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <p className="text-[10px] text-center text-[#6e7585] tracking-tight">
                Order details and delivery address route directly to our WhatsApp support team.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
