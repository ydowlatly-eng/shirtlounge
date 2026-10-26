import React from 'react';
import { ArrowDown, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HERO_IMAGE } from '../data/defaultProducts';

export const HeroBanner: React.FC = () => {
  const { setActiveFilter } = useStore();

  const scrollToCatalog = (cat?: 't-shirts' | 'hoodies' | 'sweatshirts') => {
    if (cat) setActiveFilter(cat);
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0c0d10] border-b border-[#1c1f26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Streetwear Brand Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Quiet Unboxed Metadata */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#9da3af] font-mono-numbers">
              <span className="text-[#d4f800]">DROP 04</span>
              <span aria-hidden="true">·</span>
              <span>HEAVYWEIGHT APPAREL</span>
              <span aria-hidden="true">·</span>
              <span>FALL / WINTER 2026</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.05]" style={{ textWrap: 'balance' }}>
              BOXY CUTS. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f3f4f6] to-[#a0a5b1]">
                HEAVY FLEECE.
              </span> <br />
              <span className="text-[#d4f800]">RAW VIBES.</span>
            </h1>

            {/* Prose description */}
            <p className="text-sm sm:text-base text-[#9ea3af] max-w-xl leading-relaxed">
              ShirtLoung drops premium 300–520 GSM oversized t-shirts, boxy hoodies, and vintage washed sweatshirts. Orders are dispatched instantly to our WhatsApp desk for fast, personalized handling.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => scrollToCatalog()}
                className="px-6 py-3.5 bg-[#d4f800] hover:bg-[#c3e400] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:shadow-[#d4f800]/20 flex items-center gap-2"
              >
                <span>Shop New Drops</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToCatalog('hoodies')}
                className="px-5 py-3.5 bg-[#171a21] hover:bg-[#20242f] text-white border border-[#2c313d] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                500GSM Hoodies
              </button>

              <button
                onClick={() => scrollToCatalog('t-shirts')}
                className="px-5 py-3.5 bg-[#171a21] hover:bg-[#20242f] text-white border border-[#2c313d] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Heavyweight Tees
              </button>
            </div>

            {/* Trust features row (Adjacent proof) */}
            <div className="pt-4 border-t border-[#1a1d25] grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp First</span>
                </p>
                <p className="text-[11px] text-[#787f8d] mt-0.5">Instant live order chat</p>
              </div>

              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4f800]" />
                  <span>Custom Weights</span>
                </p>
                <p className="text-[11px] text-[#787f8d] mt-0.5">300 to 520 GSM fabrics</p>
              </div>

              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Admin Control</span>
                </p>
                <p className="text-[11px] text-[#787f8d] mt-0.5">Live image & stock updates</p>
              </div>
            </div>

          </div>

          {/* Right Column: Editorial Hero Lookbook Imagery */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-2xl overflow-hidden border border-[#232732] bg-[#14161d] shadow-2xl">
              <img
                src={HERO_IMAGE}
                alt="ShirtLoung Gen Z Streetwear Lookbook"
                referrerPolicy="no-referrer"
                className="w-full h-[380px] sm:h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  // Fallback container if image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.innerHTML = `
                      <div class="w-full h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1c23] to-[#0d0e12] p-8 text-center">
                        <span class="text-4xl mb-3">🔥</span>
                        <h3 class="text-xl font-bold uppercase text-white">ShirtLoung Drop 04</h3>
                        <p class="text-xs text-[#9da3af] mt-2">Streetwear, Heavyweight Hoodies & Graphic Tees</p>
                      </div>
                    `;
                  }
                }}
              />
              {/* Subtle filmic gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono-numbers tracking-widest text-[#d4f800] font-bold">
                    ARCHIVE LOOKBOOK
                  </span>
                  <p className="text-sm font-bold text-white tracking-tight mt-0.5">
                    Industrial Brutalist Series
                  </p>
                </div>
                <span className="text-[11px] text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-mono-numbers">
                  EST. 2026
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
