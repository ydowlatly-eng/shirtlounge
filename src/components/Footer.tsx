import React from 'react';
import { MessageCircle, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveFilter, setIsAuthOpen, setIsAdminOpen, currentUser, settings } = useStore();

  const cleanPhone = settings.adminWhatsappNumber.replace(/\D/g, '');

  return (
    <footer className="bg-[#090a0d] border-t border-[#1b1e26] text-xs text-[#7e8594] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand info */}
          <div className="md:col-span-5 space-y-3">
            <span className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span>ShirtLoung</span>
              <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 bg-[#d4f800] text-black rounded font-bold">
                STUDIO
              </span>
            </span>
            <p className="text-xs text-[#8c94a5] max-w-sm leading-relaxed">
              Modern Gen Z streetwear destination specializing in oversized boxy t-shirts, heavyweight 500 GSM fleece hoodies, and vintage washed sweatshirts with seamless WhatsApp order dispatch.
            </p>
            <div className="pt-1">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-white bg-[#151821] hover:bg-[#1f2330] border border-[#252a36] px-3 py-1.5 rounded-lg font-mono-numbers text-[11px] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp Desk: +{settings.adminWhatsappNumber}</span>
              </a>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono-numbers">
              Collections
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    setActiveFilter('t-shirts');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Heavyweight T-Shirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveFilter('hoodies');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  500GSM Boxy Hoodies
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveFilter('sweatshirts');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Raw Crewneck Sweatshirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveFilter('all');
                    document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Full Archive Drops
                </button>
              </li>
            </ul>
          </div>

          {/* Store Ops & Admin */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono-numbers">
              Direct Orders & Administration
            </h4>
            <p className="text-xs text-[#8c94a5]">
              Every order is formatted and routed directly to the store owner's WhatsApp number with full customer address, size selections, and order breakdown.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  if (currentUser?.isAdmin) {
                    setIsAdminOpen(true);
                  } else {
                    setIsAuthOpen(true);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#141720] hover:bg-[#1d222e] border border-[#272d3b] text-white rounded-lg text-xs font-bold uppercase transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-[#d4f800]" />
                <span>Admin Login / Put Images</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-[#171a22] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#697080] font-mono-numbers">
          <p>© {new Date().getFullYear()} ShirtLoung Studios. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Direct WhatsApp Order Dispatch</span>
            <span aria-hidden="true">·</span>
            <span>Pre-Shrunk Heavy Cottons</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
