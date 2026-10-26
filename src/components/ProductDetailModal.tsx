import React, { useState } from 'react';
import { X, ShoppingBag, MessageCircle, ShieldCheck, Check, Truck, RefreshCw, Ruler } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    addToCart,
    settings,
    setIsCheckoutOpen,
    currentUser,
    setIsAdminOpen,
  } = useStore();

  const product = selectedProductForDetail;

  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Standard', hex: '#111' });
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleInstantWhatsAppBuy = () => {
    // Add to cart and immediately open checkout modal
    addToCart(product, selectedSize, selectedColor, quantity);
    setSelectedProductForDetail(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Container */}
      <div
        className="relative bg-[#101217] border border-[#232733] rounded-2xl sm:rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForDetail(null)}
          className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-black text-[#9da3af] hover:text-white rounded-full border border-white/10 backdrop-blur-md transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image Showcase */}
        <div className="md:w-1/2 relative bg-[#151720] min-h-[320px] md:min-h-full flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center max-h-[520px]"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'p-8');
                target.parentElement.innerHTML = `
                  <div class="text-center">
                    <span class="text-5xl">👕</span>
                    <h4 class="text-sm font-bold text-white mt-2 uppercase">${product.name}</h4>
                  </div>
                `;
              }
            }}
          />

          {product.badge && (
            <div className="absolute top-4 left-4">
              <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md text-[#d4f800] text-[11px] font-bold font-mono-numbers uppercase tracking-wider rounded border border-white/10">
                {product.badge}
              </span>
            </div>
          )}

          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-mono-numbers text-white/90">
            {product.fabricWeight}
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            
            {/* Category & Fit */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#828a9b] uppercase font-mono-numbers">
                <span>{product.category.replace('-', ' ')}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#d4f800]">{product.fit}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                {product.name}
              </h2>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white font-mono-numbers">
                {settings.currencySymbol}{product.price.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-base text-[#6b7280] line-through font-mono-numbers">
                  {settings.currencySymbol}{product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-xs text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-950/60 border border-emerald-800/40 rounded">
                In Stock ({product.stock} units)
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#9ea3af] leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2 font-mono-numbers">
                Color: <span className="text-[#9ea3af] font-normal">{selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => {
                  const isSelected = selectedColor.name === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c)}
                      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? 'border-[#d4f800] bg-[#1a1d26] text-white'
                          : 'border-[#292e3c] bg-[#13151b] text-[#9ea3af] hover:border-[#404759]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white font-mono-numbers">
                  Select Size: <span className="text-[#d4f800]">{selectedSize}</span>
                </label>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-xs text-[#8c93a4] hover:text-[#d4f800] flex items-center gap-1 transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2.5 rounded-xl font-mono-numbers text-xs font-bold uppercase transition-all ${
                        isSelected
                          ? 'bg-[#d4f800] text-black shadow-lg shadow-[#d4f800]/20'
                          : 'bg-[#161922] text-[#9ea3af] hover:text-white border border-[#272b38] hover:border-[#3d4455]'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              {/* Pop-out Size Guide */}
              {showSizeGuide && (
                <div className="mt-3 p-3 bg-[#161922] border border-[#2a2f3e] rounded-xl text-[11px] text-[#9ea3af] space-y-1 animate-in fade-in duration-150">
                  <p className="font-bold text-white uppercase tracking-wider">Streetwear Sizing Note:</p>
                  <p>All ShirtLoung drops are tailored with an authentic relaxed drop-shoulder cut. Order your true size for a boxy streetwear drape, or size down for standard tailoring.</p>
                </div>
              )}
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-white font-mono-numbers">
                Quantity
              </span>
              <div className="flex items-center border border-[#2a2f3e] bg-[#14161f] rounded-xl p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#9ea3af] hover:text-white font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono-numbers font-bold text-xs text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="w-8 h-8 flex items-center justify-center text-[#9ea3af] hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-[#1c202a] space-y-3 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className={`py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-emerald-500 text-black'
                    : 'bg-white hover:bg-[#d4f800] text-black shadow-md'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={handleInstantWhatsAppBuy}
                className="py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Buy</span>
              </button>
            </div>

            {/* Admin Edit Shortcut */}
            {currentUser?.isAdmin && (
              <button
                onClick={() => {
                  setSelectedProductForDetail(null);
                  setIsAdminOpen(true);
                }}
                className="w-full py-2 bg-[#171a22] hover:bg-[#222633] text-[#d4f800] border border-[#d4f800]/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Edit This Product & Image in Admin Panel</span>
              </button>
            )}

            {/* Value markers */}
            <div className="flex items-center justify-between text-[11px] text-[#717887] pt-2">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Fast Dispatch
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Cotton Authenticity
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Hassle-free Exchange
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
