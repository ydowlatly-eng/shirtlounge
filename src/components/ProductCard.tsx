import React, { useState } from 'react';
import { Eye, ShoppingBag, Edit3, Check } from 'lucide-react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    settings,
    addToCart,
    setSelectedProductForDetail,
    currentUser,
    setIsAdminOpen,
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || { name: 'Standard', hex: '#111' });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      onClick={() => setSelectedProductForDetail(product)}
      className="group flex flex-col bg-[#12141a] rounded-2xl border border-[#20242e] hover:border-[#353b49] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 cursor-pointer relative"
    >
      {/* Top Media Area (70% visual focus) */}
      <div className="relative aspect-[4/3] w-full bg-[#171922] overflow-hidden">
        
        {/* Loading skeleton placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#171922] animate-pulse flex items-center justify-center">
            <span className="text-xs text-[#555d6e] uppercase tracking-wider font-mono-numbers">
              Loading fabric...
            </span>
          </div>
        )}

        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-[#181b24]');
              const fallback = document.createElement('div');
              fallback.className = 'text-center p-4';
              fallback.innerHTML = `
                <div class="text-3xl mb-1">👕</div>
                <div class="text-xs font-bold text-white uppercase">${product.name}</div>
                <div class="text-[10px] text-gray-500 mt-1">${product.fabricWeight}</div>
              `;
              target.parentElement.appendChild(fallback);
            }
          }}
        />

        {/* Quiet badge top left (at most 1 subtle text tag) */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md text-[#d4f800] text-[10px] font-bold font-mono-numbers uppercase tracking-wider rounded border border-white/10">
              {product.badge}
            </span>
          </div>
        )}

        {/* Quick View and Admin shortcuts overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {currentUser?.isAdmin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAdminOpen(true);
              }}
              className="p-2 bg-black/80 hover:bg-black text-[#d4f800] rounded-lg border border-white/10 backdrop-blur-md transition-colors"
              title="Edit Product & Image in Admin"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductForDetail(product);
            }}
            className="p-2 bg-black/80 hover:bg-black text-white rounded-lg border border-white/10 backdrop-blur-md transition-colors"
            title="Inspect Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom hover bar inside media for fast size select */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2 left-2 right-2 p-1.5 bg-[#0c0d10]/90 backdrop-blur-md rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between gap-1 text-[11px]"
        >
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(s);
                }}
                className={`px-2 py-0.5 rounded font-mono-numbers text-[10px] font-bold uppercase transition-colors shrink-0 ${
                  selectedSize === s
                    ? 'bg-[#d4f800] text-black'
                    : 'text-[#9ea3af] hover:text-white bg-[#1a1d24]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={addedAnimation}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
              addedAnimation
                ? 'bg-emerald-500 text-black'
                : 'bg-white text-black hover:bg-[#d4f800]'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3 h-3" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>+ Bag</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
        <div>
          {/* Clean Unboxed Metadata with separators */}
          <div className="flex items-center gap-2 text-[11px] text-[#7d8493] uppercase font-mono-numbers">
            <span>{product.category.replace('-', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>{product.fit}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-base font-bold text-white group-hover:text-[#d4f800] transition-colors mt-1 line-clamp-1">
            {product.name}
          </h3>

          {/* Fabric Specification */}
          <p className="text-xs text-[#8c94a5] line-clamp-1 mt-0.5">
            {product.fabricWeight}
          </p>
        </div>

        {/* Price and Color Baseline */}
        <div className="pt-2 border-t border-[#1b1f28] flex items-center justify-between">
          
          {/* Price with tabular numerals */}
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-white font-mono-numbers">
              {settings.currencySymbol}{product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-[#626978] line-through font-mono-numbers">
                {settings.currencySymbol}{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Available Colors preview dots */}
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 3).map((col) => (
              <span
                key={col.name}
                title={col.name}
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: col.hex }}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-[#7d8493] font-mono-numbers">
                +{product.colors.length - 3}
              </span>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};
