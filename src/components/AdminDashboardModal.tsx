import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  Edit2,
  MessageCircle,
  Settings,
  Package,
  Layers,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory, ProductColor } from '../types/store';
import { PRESET_STREETWEAR_IMAGES } from '../data/defaultProducts';

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts,
    orders,
    updateOrderStatus,
    settings,
    updateSettings,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'add-product' | 'inventory' | 'orders' | 'settings'>('add-product');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const quickChangeImageInputRef = useRef<HTMLInputElement>(null);
  const [productToChangeImage, setProductToChangeImage] = useState<Product | null>(null);

  // New Product Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'t-shirts' | 'hoodies' | 'sweatshirts'>('hoodies');
  const [price, setPrice] = useState<number>(75);
  const [originalPrice, setOriginalPrice] = useState<number>(95);
  const [image, setImage] = useState<string>(PRESET_STREETWEAR_IMAGES[1].url);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url' | 'preset'>('upload');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [description, setDescription] = useState(
    'Engineered from 500 GSM heavyweight French terry with double-needle ribbed hems, dropped shoulders, and a clean boxy silhouette.'
  );
  const [fit, setFit] = useState('Boxy Oversized');
  const [fabricWeight, setFabricWeight] = useState('500 GSM Heavyweight Terry');
  const [badge, setBadge] = useState('NEW DROP');
  const [stock, setStock] = useState<number>(25);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL', 'XXL']);

  // Settings form state
  const [sellerWhatsapp, setSellerWhatsapp] = useState(settings.adminWhatsappNumber);
  const [storeName, setStoreName] = useState(settings.storeName);
  const [currency, setCurrency] = useState(settings.currencySymbol);
  const [freeShipping, setFreeShipping] = useState(settings.freeShippingThreshold);

  if (!isAdminOpen) return null;

  // Handle local file upload (converts file to Base64 Data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'quick-change') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        if (target === 'new') {
          setImage(result);
          showToast('Image uploaded successfully!');
        } else if (target === 'quick-change' && productToChangeImage) {
          updateProduct(productToChangeImage.id, { image: result });
          showToast(`Updated image for ${productToChangeImage.name}`);
          setProductToChangeImage(null);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a product title');
      return;
    }
    if (!image) {
      showToast('Please upload or provide an image');
      return;
    }

    const defaultColors: ProductColor[] = [
      { name: 'Vintage Black', hex: '#16181b' },
      { name: 'Raw Chalk', hex: '#ded9cd' },
      { name: 'Washed Olive', hex: '#585f52' },
    ];

    addProduct({
      name: name.trim(),
      category,
      price: Number(price) || 45,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      image,
      description: description.trim(),
      fit: fit.trim() || 'Boxy Fit',
      fabricWeight: fabricWeight.trim() || '380 GSM Cotton',
      sizes: selectedSizes.length > 0 ? selectedSizes : ['M', 'L', 'XL'],
      colors: defaultColors,
      badge: badge.trim() || undefined,
      stock: Number(stock) || 20,
      isFeatured: true,
    });

    // Reset fields
    setName('');
    setActiveTab('inventory');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      adminWhatsappNumber: sellerWhatsapp.replace(/\D/g, ''),
      storeName: storeName.trim(),
      currencySymbol: currency.trim() || '$',
      freeShippingThreshold: Number(freeShipping) || 90,
    });
  };

  const toggleSize = (sz: string) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-[#101217] border border-[#232733] rounded-2xl sm:rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden File Input for quick change on existing products */}
        <input
          ref={quickChangeImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageFileUpload(e, 'quick-change')}
        />

        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#1f232e] bg-[#12151c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4f800]/15 border border-[#d4f800]/30 flex items-center justify-center text-[#d4f800]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black uppercase tracking-wider text-white">
                  ShirtLoung Admin Studio
                </h2>
                <span className="px-2 py-0.5 bg-[#d4f800] text-black text-[10px] font-bold rounded font-mono-numbers">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-[#8c94a5]">
                Upload images, add drops, and manage direct WhatsApp customer orders
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminOpen(false)}
            className="p-2 text-[#8c94a5] hover:text-white rounded-lg hover:bg-[#1a1d25] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 py-2.5 bg-[#14161f] border-b border-[#1f232e] overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('add-product')}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'add-product'
                ? 'bg-[#d4f800] text-black shadow-md'
                : 'text-[#9ea3af] hover:text-white hover:bg-[#1a1d26]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Put New Images & Add Drop</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-[#d4f800] text-black shadow-md'
                : 'text-[#9ea3af] hover:text-white hover:bg-[#1a1d26]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap relative ${
              activeTab === 'orders'
                ? 'bg-[#d4f800] text-black shadow-md'
                : 'text-[#9ea3af] hover:text-white hover:bg-[#1a1d26]'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Orders ({orders.length})</span>
            {orders.filter((o) => o.status === 'new').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#d4f800] text-black shadow-md'
                : 'text-[#9ea3af] hover:text-white hover:bg-[#1a1d26]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Seller WhatsApp Settings</span>
          </button>
        </div>

        {/* Tab 1: Put New Images & Add Product */}
        {activeTab === 'add-product' && (
          <form onSubmit={handleAddProductSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            
            {/* Image Upload Showcase Section */}
            <div className="p-5 bg-[#141720] border border-[#242937] rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#d4f800]" />
                    <span>Product Image Source (Put New Images)</span>
                  </h3>
                  <p className="text-[11px] text-[#8c94a5]">
                    Upload photos directly from your computer/phone, paste image URLs, or select presets.
                  </p>
                </div>

                {/* Sub-tabs for image source */}
                <div className="flex p-0.5 bg-[#101217] border border-[#232733] rounded-lg">
                  <button
                    type="button"
                    onClick={() => setImageInputMode('upload')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase transition-colors ${
                      imageInputMode === 'upload'
                        ? 'bg-[#d4f800] text-black'
                        : 'text-[#8c94a5] hover:text-white'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('preset')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase transition-colors ${
                      imageInputMode === 'preset'
                        ? 'bg-[#d4f800] text-black'
                        : 'text-[#8c94a5] hover:text-white'
                    }`}
                  >
                    Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputMode('url')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase transition-colors ${
                      imageInputMode === 'url'
                        ? 'bg-[#d4f800] text-black'
                        : 'text-[#8c94a5] hover:text-white'
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {/* Mode 1: Local File Upload */}
              {imageInputMode === 'upload' && (
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFileUpload(e, 'new')}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#2d3444] hover:border-[#d4f800] bg-[#101217] rounded-xl p-6 text-center cursor-pointer transition-all hover:bg-[#12151e] flex flex-col items-center justify-center space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#1c202c] group-hover:bg-[#d4f800] text-[#9ea3af] group-hover:text-black flex items-center justify-center transition-colors">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      Click to Browse & Upload Image
                    </p>
                    <p className="text-[11px] text-[#717887]">
                      Supports PNG, JPG, WEBP photos from your device (renders immediately)
                    </p>
                  </div>
                </div>
              )}

              {/* Mode 2: Curated Presets */}
              {imageInputMode === 'preset' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_STREETWEAR_IMAGES.map((preset) => {
                    const isSelected = image === preset.url;
                    return (
                      <div
                        key={preset.name}
                        onClick={() => setImage(preset.url)}
                        className={`p-2 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#d4f800] bg-[#1a1d26]'
                            : 'border-[#252936] bg-[#111319] hover:border-[#3d4455]'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full aspect-[4/3] object-cover rounded-lg bg-black mb-1.5"
                        />
                        <p className="text-[10px] font-bold text-white truncate">{preset.name}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Mode 3: Direct URL */}
              {imageInputMode === 'url' && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="https://example.com/streetwear-hoodie.jpg"
                    className="flex-1 bg-[#101217] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customImageUrl.trim()) {
                        setImage(customImageUrl.trim());
                        showToast('Applied custom image URL');
                      }
                    }}
                    className="px-4 py-2 bg-[#d4f800] text-black font-bold text-xs rounded-xl hover:bg-[#c3e400]"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Live Preview Box */}
              {image && (
                <div className="p-3 bg-[#101217] border border-[#222632] rounded-xl flex items-center gap-4">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg bg-black shrink-0 border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#d4f800] font-mono-numbers">
                      ACTIVE IMAGE PREVIEW
                    </span>
                    <p className="text-xs text-white truncate font-mono-numbers mt-0.5">
                      {image.startsWith('data:') ? 'Custom Uploaded Data Image' : image}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[#1c1f2a] hover:bg-[#252a38] text-white text-xs font-bold rounded-lg border border-[#2e3444] shrink-0"
                  >
                    Replace Image
                  </button>
                </div>
              )}
            </div>

            {/* Product Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acid Wash Drop Shoulder Hoodie"
                  className="w-full bg-[#151720] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#151720] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="hoodies">Hoodies</option>
                  <option value="t-shirts">T-Shirts</option>
                  <option value="sweatshirts">Sweatshirts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  Selling Price ({settings.currencySymbol}) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  placeholder="75"
                  className="w-full bg-[#151720] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  Original Price ({settings.currencySymbol}) for Strike-through
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(parseFloat(e.target.value))}
                  placeholder="95"
                  className="w-full bg-[#151720] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  Fabric Weight & Material
                </label>
                <input
                  type="text"
                  value={fabricWeight}
                  onChange={(e) => setFabricWeight(e.target.value)}
                  placeholder="e.g. 500 GSM French Terry Fleece"
                  className="w-full bg-[#151720] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  Fit Type
                </label>
                <input
                  type="text"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  placeholder="e.g. Boxy Oversized Fit"
                  className="w-full bg-[#151720] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  Drop Badge Tag
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. NEW DROP or LIMITED RUN"
                  className="w-full bg-[#151720] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none uppercase font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  Stock Units Available
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  placeholder="25"
                  className="w-full bg-[#151720] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-mono-numbers"
                />
              </div>
            </div>

            {/* Sizes Checkboxes */}
            <div>
              <label className="block text-xs font-medium text-[#9da3af] mb-2">
                Available Sizes
              </label>
              <div className="flex gap-2">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                  const isChecked = selectedSizes.includes(sz);
                  return (
                    <button
                      type="button"
                      key={sz}
                      onClick={() => toggleSize(sz)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono-numbers transition-colors ${
                        isChecked
                          ? 'bg-[#d4f800] text-black'
                          : 'bg-[#151720] text-[#787f8e] border border-[#262a37]'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-[#9da3af] mb-1">
                Product Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product design and construction details..."
                className="w-full bg-[#151720] border border-[#272c3a] focus:border-[#d4f800] rounded-xl p-3 text-xs text-white outline-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-[#d4f800] hover:bg-[#c3e400] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#d4f800]/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Drop to Store Catalog</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Inventory & Quick Image Switcher */}
        {activeTab === 'inventory' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Active Catalog Items ({products.length})
                </h3>
                <p className="text-[11px] text-[#8c94a5]">
                  Click "Change Image" on any product to instantly upload a new photo from your device.
                </p>
              </div>
              <button
                onClick={resetProducts}
                className="flex items-center gap-1 text-[11px] text-[#8c94a5] hover:text-white px-2.5 py-1.5 bg-[#151720] border border-[#252936] rounded-lg transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Default</span>
              </button>
            </div>

            <div className="space-y-3">
              {products.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-[#14161f] border border-[#222633] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative group/thumb shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-black border border-white/10"
                      />
                      <button
                        onClick={() => {
                          setProductToChangeImage(item);
                          quickChangeImageInputRef.current?.click();
                        }}
                        className="absolute inset-0 bg-black/75 rounded-xl opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center text-[9px] text-[#d4f800] font-bold uppercase p-1 text-center"
                      >
                        <Upload className="w-3.5 h-3.5 mb-0.5" />
                        <span>Swap</span>
                      </button>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                        <span className="text-[10px] font-mono-numbers px-1.5 py-0.2 bg-[#1d212c] text-[#8e95a5] rounded uppercase">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7a8190] truncate mt-0.5">{item.fabricWeight}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs font-mono-numbers">
                        <span className="text-[#d4f800] font-bold">
                          {settings.currencySymbol}{item.price.toFixed(2)}
                        </span>
                        <span className="text-[#7a8190]">Stock: {item.stock}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1c1f2b]">
                    {/* Change Image Button */}
                    <button
                      onClick={() => {
                        setProductToChangeImage(item);
                        quickChangeImageInputRef.current?.click();
                      }}
                      className="px-3 py-1.5 bg-[#1c1f2c] hover:bg-[#252a3a] text-white border border-[#2b3142] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#d4f800]" />
                      <span>Change Image</span>
                    </button>

                    {/* Delete Product */}
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${item.name}" from catalog?`)) {
                          deleteProduct(item.id);
                        }
                      }}
                      className="p-2 bg-[#1c1f2c] hover:bg-red-950/60 text-[#7a8190] hover:text-red-400 border border-[#2b3142] rounded-xl transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Incoming WhatsApp Orders */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Orders Received ({orders.length})
              </h3>
              <p className="text-[11px] text-[#8c94a5]">
                When customers place orders, all their details route to WhatsApp and stay logged here.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-[#13151d] rounded-2xl border border-dashed border-[#232733]">
                <MessageCircle className="w-10 h-10 text-[#25D366] mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold uppercase text-white">No customer orders placed yet</p>
                <p className="text-[11px] text-[#717887] mt-1">
                  Place a test order from the bag to verify the WhatsApp message formatting!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => {
                  const cleanCustomerPhone = ord.customer.phone.replace(/\D/g, '');
                  const customerChatUrl = `https://wa.me/${cleanCustomerPhone}`;

                  return (
                    <div
                      key={ord.id}
                      className="p-4 bg-[#14161f] border border-[#222633] rounded-2xl space-y-3"
                    >
                      {/* Top Bar of order */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1f232e]">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white font-mono-numbers">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-[11px] text-[#717887]">·</span>
                          <span className="text-[11px] text-[#8c94a5]">
                            {new Date(ord.createdAt).toLocaleDateString()} {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center gap-2">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                            className="bg-[#1a1d26] border border-[#292f3f] text-xs text-white rounded-lg px-2.5 py-1 outline-none font-bold uppercase"
                          >
                            <option value="new">New Order</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>

                          {/* Direct WhatsApp chat with customer */}
                          {cleanCustomerPhone && (
                            <a
                              href={customerChatUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 bg-[#25D366] hover:bg-[#20ba5a] text-black text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Chat Customer</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#101217] p-3 rounded-xl border border-[#1e222d]">
                        <div>
                          <p className="text-[#8c94a5]">Customer Contact:</p>
                          <p className="font-bold text-white mt-0.5">{ord.customer.name}</p>
                          <p className="font-mono-numbers text-[#d4f800]">{ord.customer.phone}</p>
                          {ord.customer.email && (
                            <p className="text-[#8c94a5] text-[11px]">{ord.customer.email}</p>
                          )}
                        </div>

                        <div>
                          <p className="text-[#8c94a5]">Delivery Address:</p>
                          <p className="text-white mt-0.5">
                            {ord.customer.address}
                            {ord.customer.apartment ? `, ${ord.customer.apartment}` : ''}
                          </p>
                          <p className="text-[#8c94a5] text-[11px]">
                            {ord.customer.city}, {ord.customer.postalCode} ({ord.customer.country})
                          </p>
                          {ord.customer.notes && (
                            <p className="text-amber-400 text-[11px] mt-1">
                              Note: {ord.customer.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Item list */}
                      <div className="space-y-1 text-xs">
                        <p className="text-[11px] font-bold text-[#8c94a5] uppercase font-mono-numbers">
                          Items Breakdown:
                        </p>
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-[#d0d4dd]">
                            <span>
                              {it.quantity}× {it.productName} ({it.size} / {it.color})
                            </span>
                            <span className="font-mono-numbers text-white">
                              {settings.currencySymbol}{(it.price * it.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="pt-2 border-t border-[#1e222d] flex items-center justify-between text-xs font-mono-numbers">
                        <span className="text-[#8c94a5]">Payment: {ord.paymentMethod.toUpperCase()}</span>
                        <span className="text-white font-bold text-sm">
                          Total: <strong className="text-[#d4f800]">{settings.currencySymbol}{ord.total.toFixed(2)}</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Seller WhatsApp & Store Settings */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            <div className="p-4 bg-[#141721] border border-[#242938] rounded-2xl space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Seller WhatsApp Receiving Number</span>
              </h3>
              <p className="text-[11px] text-[#8c94a5]">
                When buyers order on ShirtLoung, their full order information and delivery address will be sent to THIS WhatsApp number.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9da3af] mb-1">
                  Your WhatsApp Phone Number (with Country Code, no + or spaces)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-[#717887] font-mono-numbers">+</span>
                  <input
                    type="text"
                    required
                    value={sellerWhatsapp}
                    onChange={(e) => setSellerWhatsapp(e.target.value)}
                    placeholder="15552345678 or 201012345678"
                    className="w-full bg-[#151720] border border-[#272c3a] focus:border-[#d4f800] rounded-xl pl-7 pr-3.5 py-2.5 text-xs text-white outline-none font-mono-numbers"
                  />
                </div>
                <p className="text-[11px] text-[#717887] mt-1">
                  Example: 15551234567 (US), 447123456789 (UK), 201012345678 (Egypt), 966512345678 (Saudi).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#9da3af] mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full bg-[#151720] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9da3af] mb-1">
                    Currency Symbol
                  </label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-[#151720] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono-numbers"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9da3af] mb-1">
                    Free Shipping Threshold
                  </label>
                  <input
                    type="number"
                    value={freeShipping}
                    onChange={(e) => setFreeShipping(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#151720] border border-[#272c3a] focus:border-[#d4f800] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono-numbers"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#d4f800] hover:bg-[#c3e400] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                Save WhatsApp Settings
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
