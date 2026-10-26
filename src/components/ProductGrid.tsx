import React, { useState, useMemo } from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { ProductCategory } from '../types/store';

export const ProductGrid: React.FC = () => {
  const {
    products,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    currentUser,
    setIsAdminOpen,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');

  const filterTabs: { label: string; value: ProductCategory }[] = [
    { label: 'All Pieces', value: 'all' },
    { label: 'T-Shirts', value: 't-shirts' },
    { label: 'Hoodies', value: 'hoodies' },
    { label: 'Sweatshirts', value: 'sweatshirts' },
  ];

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory =
        activeFilter === 'all' || prod.category === activeFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.fabricWeight.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeFilter, searchQuery]);

  // Sort Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'newest') {
      return list.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    // 'featured'
    return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }, [filteredProducts, sortBy]);

  return (
    <section id="catalog-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header bar with tabs and sort */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#1b1f28]">
        
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8b92a2] uppercase font-mono-numbers">
            <span>COLLECTION ARCHIVE</span>
            <span aria-hidden="true">·</span>
            <span>{filteredProducts.length} PRODUCTS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1 tracking-tight">
            Curated Drops
          </h2>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented Filter Buttons */}
          <div className="flex items-center p-1 bg-[#14161e] border border-[#232733] rounded-xl overflow-x-auto no-scrollbar">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#d4f800] text-black shadow-md'
                      : 'text-[#9ea3af] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 bg-[#14161e] border border-[#232733] rounded-xl px-3 py-1.5 text-xs text-[#9ea3af]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6c7484]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white border-none outline-none text-xs cursor-pointer pr-1"
            >
              <option value="featured" className="bg-[#14161e] text-white">
                Featured
              </option>
              <option value="newest" className="bg-[#14161e] text-white">
                Newest Drops
              </option>
              <option value="price-low" className="bg-[#14161e] text-white">
                Price: Low to High
              </option>
              <option value="price-high" className="bg-[#14161e] text-white">
                Price: High to Low
              </option>
            </select>
          </div>

          {/* Admin Fast Add Button */}
          {currentUser?.isAdmin && (
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d4f800] text-black font-bold text-xs rounded-xl hover:bg-[#c2e400] transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Search Notice */}
      {searchQuery && (
        <div className="flex items-center justify-between py-3 px-4 my-4 bg-[#141720] rounded-xl border border-[#252a38] text-xs">
          <p className="text-[#9ea3af]">
            Showing results for <span className="text-white font-bold font-mono-numbers">"{searchQuery}"</span> ({filteredProducts.length} items)
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#d4f800] hover:underline font-bold"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-[#232733] rounded-2xl bg-[#101217] my-8 p-8">
          <div className="w-14 h-14 rounded-2xl bg-[#181b24] flex items-center justify-center text-2xl mb-4 border border-[#2b303e]">
            👕
          </div>
          <h3 className="text-lg font-bold text-white uppercase tracking-wider">
            No products match this filter
          </h3>
          <p className="text-xs text-[#7d8493] mt-1 max-w-sm">
            Try resetting your search query or selecting a different category to see available streetwear drops.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-[#d4f800] text-black font-bold text-xs uppercase rounded-xl hover:bg-[#c3e400] transition-colors"
            >
              View All Pieces
            </button>
            {currentUser?.isAdmin && (
              <button
                onClick={() => setIsAdminOpen(true)}
                className="px-4 py-2 bg-[#1b1e28] text-white border border-[#2f3544] font-bold text-xs uppercase rounded-xl hover:bg-[#252936] transition-colors"
              >
                Upload New Image & Product
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
