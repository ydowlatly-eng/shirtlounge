import React from 'react';
import { ShoppingBag, User, Shield, Search, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types/store';

export const Navbar: React.FC = () => {
  const {
    settings,
    cartCount,
    setIsCartOpen,
    setIsAuthOpen,
    setIsAdminOpen,
    currentUser,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [showSearchInput, setShowSearchInput] = React.useState(false);

  const categories: { label: string; value: ProductCategory }[] = [
    { label: 'All Drops', value: 'all' },
    { label: 'T-Shirts', value: 't-shirts' },
    { label: 'Hoodies', value: 'hoodies' },
    { label: 'Sweatshirts', value: 'sweatshirts' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#12141a] border-b border-[#20232b] text-[11px] tracking-widest uppercase py-2 px-4 text-[#9da3af] text-center font-mono-numbers">
        <span>{settings.announcementText}</span>
      </div>

      {/* Main Top Bar - Adheres strictly to Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#0c0d10]/90 backdrop-blur-md border-b border-[#1c1f26]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-2xl font-black tracking-tighter text-white uppercase whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-2 text-left"
          >
            <span>ShirtLoung</span>
            <span className="text-[10px] tracking-normal font-mono-numbers px-1.5 py-0.5 bg-[#d4f800] text-black rounded font-bold uppercase">
              STUDIO
            </span>
          </button>

          {/* Zone 2: 4 clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#9ea3af]">
            {categories.map((cat) => {
              const isActive = activeFilter === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => {
                    setActiveFilter(cat.value);
                    const catalogEl = document.getElementById('catalog-section');
                    if (catalogEl) {
                      catalogEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`hover:text-white transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                    isActive ? 'text-white' : ''
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4f800]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Interactive controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Input toggle */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-[#171a21] border border-[#2b303c] rounded-lg px-2.5 py-1.5 text-xs text-white">
                  <Search className="w-3.5 h-3.5 text-[#888f9d] mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search drops..."
                    className="bg-transparent border-none outline-none text-xs w-28 sm:w-44 text-white placeholder-[#606775]"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSearchInput(false);
                    }}
                    className="text-[#888f9d] hover:text-white ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  aria-label="Search"
                  className="p-2 text-[#9da3af] hover:text-white hover:bg-[#171a21] rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Admin Portal Button */}
            <button
              onClick={() => {
                if (currentUser?.isAdmin) {
                  setIsAdminOpen(true);
                } else {
                  setIsAuthOpen(true);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                currentUser?.isAdmin
                  ? 'bg-[#d4f800]/10 text-[#d4f800] border-[#d4f800]/40'
                  : 'text-[#9ea3af] hover:text-white bg-[#15181f] border-[#252933]'
              }`}
              title="Admin Portal (Put new images & manage orders)"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Sign In / Account Button */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#15181f] hover:bg-[#1e222c] border border-[#252933] text-[#e0e3eb] transition-colors whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 text-[#9da3af]" />
              <span className="hidden sm:inline">
                {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-2.5 rounded-lg bg-[#d4f800] text-black font-bold hover:bg-[#c2e400] transition-colors shrink-0"
              aria-label="View bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-black text-[#d4f800] border border-[#d4f800] text-[10px] font-mono-numbers font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden flex items-center overflow-x-auto py-2.5 px-4 gap-2 border-t border-[#1a1d24] no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeFilter === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveFilter(cat.value);
                  const catalogEl = document.getElementById('catalog-section');
                  if (catalogEl) {
                    catalogEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#d4f800] text-black font-bold'
                    : 'bg-[#15181f] text-[#9ea3af] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </header>
    </>
  );
};
