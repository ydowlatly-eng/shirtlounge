import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  ProductCategory,
  ProductColor,
  CartItem,
  CustomerInfo,
  Order,
  OrderItem,
  UserProfile,
  StoreSettings,
} from '../types/store';
import { INITIAL_PRODUCTS, DEFAULT_SETTINGS } from '../data/defaultProducts';

interface StoreContextType {
  products: Product[];
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
  
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => void;
  updateCartItemQty: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartTotal: number;
  cartShipping: number;
  cartCount: number;
  
  orders: Order[];
  placeWhatsAppOrder: (
    customer: CustomerInfo,
    paymentMethod: 'cod' | 'whatsapp_pay' | 'bank_transfer'
  ) => { order: Order; whatsappUrl: string };
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  currentUser: UserProfile | null;
  loginCustomer: (email: string, name?: string, phone?: string) => void;
  loginAdmin: (passwordOrPin: string) => boolean;
  logout: () => void;
  updateCustomerProfile: (profile: Partial<UserProfile>) => void;
  
  activeFilter: ProductCategory;
  setActiveFilter: (cat: ProductCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Modals & UI states
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (p: Product | null) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (o: Order | null) => void;
  isOrderSuccessOpen: boolean;
  setIsOrderSuccessOpen: (open: boolean) => void;
  
  // Notification toast helper
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Products State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('shirtloung_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // 2. Settings State
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('shirtloung_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // 3. Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shirtloung_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // 4. Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('shirtloung_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // 5. Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('shirtloung_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  // 6. Navigation / Filter State
  const [activeFilter, setActiveFilter] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 7. UI Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);

  // 8. Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  // Sync products to local storage
  useEffect(() => {
    try {
      localStorage.setItem('shirtloung_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to sync products to storage', e);
    }
  }, [products]);

  // Sync settings
  useEffect(() => {
    try {
      localStorage.setItem('shirtloung_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to sync settings', e);
    }
  }, [settings]);

  // Sync cart
  useEffect(() => {
    try {
      localStorage.setItem('shirtloung_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart', e);
    }
  }, [cart]);

  // Sync orders
  useEffect(() => {
    try {
      localStorage.setItem('shirtloung_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to sync orders', e);
    }
  }, [orders]);

  // Sync current user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('shirtloung_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('shirtloung_user');
      }
    } catch (e) {
      console.error('Failed to sync user', e);
    }
  }, [currentUser]);

  // Product actions
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `sl-prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to store catalog`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog');
  };

  const resetProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    showToast('Products reset to original catalog');
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Store settings saved');
  };

  // Cart actions
  const addToCart = (product: Product, size: string, color: ProductColor, quantity = 1) => {
    const cartItemId = `${product.id}_${size}_${color.name}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
        },
      ];
    });
    showToast(`Added ${quantity}× ${product.name} (${size}) to bag`);
    setIsCartOpen(true);
  };

  const updateCartItemQty = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from bag');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartShipping =
    cartSubtotal >= settings.freeShippingThreshold || cartSubtotal === 0
      ? 0
      : settings.flatShippingRate;

  const cartTotal = cartSubtotal + cartShipping;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Authentication
  const loginCustomer = (email: string, name = 'Customer', phone = '') => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      phone,
      address: '',
      city: '',
      postalCode: '',
      country: '',
      isAdmin: false,
    };
    setCurrentUser(user);
    showToast(`Signed in as ${user.name}`);
    setIsAuthOpen(false);
  };

  const loginAdmin = (passwordOrPin: string) => {
    // Admin password check: 'admin123' or 'shirtloung2025' or 'admin'
    const normalized = passwordOrPin.trim().toLowerCase();
    if (normalized === 'admin123' || normalized === 'shirtloung2025' || normalized === 'admin') {
      const adminUser: UserProfile = {
        id: 'admin-01',
        name: 'ShirtLoung Admin',
        email: 'admin@shirtloung.com',
        phone: settings.adminWhatsappNumber,
        address: 'HQ Studio',
        city: 'Metropolis',
        postalCode: '10001',
        country: 'Global',
        isAdmin: true,
      };
      setCurrentUser(adminUser);
      showToast('Admin mode unlocked');
      setIsAuthOpen(false);
      setIsAdminOpen(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out');
  };

  const updateCustomerProfile = (profile: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...profile };
    setCurrentUser(updated);
    showToast('Profile updated');
  };

  // WhatsApp Order Flow
  const placeWhatsAppOrder = (
    customer: CustomerInfo,
    paymentMethod: 'cod' | 'whatsapp_pay' | 'bank_transfer'
  ) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SL-${randomSuffix}`;

    const orderItems: OrderItem[] = cart.map((c) => ({
      productId: c.product.id,
      productName: c.product.name,
      category: c.product.category,
      size: c.selectedSize,
      color: c.selectedColor.name,
      quantity: c.quantity,
      price: c.product.price,
      image: c.product.image,
    }));

    // Payment method label
    const paymentLabel =
      paymentMethod === 'cod'
        ? 'Cash on Delivery (COD)'
        : paymentMethod === 'whatsapp_pay'
        ? 'Instant WhatsApp Pay Confirmation'
        : 'Direct Bank Transfer';

    // Format WhatsApp message
    const lines = [
      `🛍️ *NEW ORDER: #${orderNumber}*`,
      `*Store:* ${settings.storeName} Streetwear`,
      `--------------------------------`,
      `👤 *CUSTOMER DETAILS:*`,
      `• *Name:* ${customer.name}`,
      `• *WhatsApp / Phone:* ${customer.phone}`,
      `• *Email:* ${customer.email || 'N/A'}`,
      `• *Address:* ${customer.address}${customer.apartment ? `, ${customer.apartment}` : ''}`,
      `• *City / Zip:* ${customer.city}, ${customer.postalCode}`,
      `• *Country:* ${customer.country}`,
      customer.notes ? `• *Special Notes:* ${customer.notes}` : null,
      `--------------------------------`,
      `📦 *ORDER ITEMS (${cartCount} items):*`,
      ...orderItems.map(
        (it, idx) =>
          `${idx + 1}. *${it.productName}*\n   - Size: *${it.size}* | Color: *${it.color}*\n   - Qty: ${it.quantity} × ${settings.currencySymbol}${it.price.toFixed(2)} = *${settings.currencySymbol}${(it.quantity * it.price).toFixed(2)}*`
      ),
      `--------------------------------`,
      `💵 *Subtotal:* ${settings.currencySymbol}${cartSubtotal.toFixed(2)}`,
      `🚚 *Shipping:* ${cartShipping === 0 ? 'FREE' : `${settings.currencySymbol}${cartShipping.toFixed(2)}`}`,
      `💰 *GRAND TOTAL:* *${settings.currencySymbol}${cartTotal.toFixed(2)}*`,
      `💳 *Payment Method:* ${paymentLabel}`,
      `--------------------------------`,
      `🕒 *Order Date:* ${new Date().toLocaleString()}`,
      `✨ Placed via ${settings.storeName} Web Store`,
    ].filter(Boolean) as string[];

    const formattedMessage = lines.join('\n');

    // Clean destination phone number: remove all non-digits
    const cleanDestinationPhone = settings.adminWhatsappNumber.replace(/\D/g, '');

    const whatsappUrl = `https://wa.me/${cleanDestinationPhone}?text=${encodeURIComponent(
      formattedMessage
    )}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customer,
      items: orderItems,
      subtotal: cartSubtotal,
      shipping: cartShipping,
      total: cartTotal,
      paymentMethod,
      status: 'new',
      createdAt: new Date().toISOString(),
      whatsappMessage: formattedMessage,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setIsOrderSuccessOpen(true);
    setIsCheckoutOpen(false);
    clearCart();

    // Auto update customer profile info if logged in
    if (currentUser) {
      updateCustomerProfile({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || currentUser.email,
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
        country: customer.country,
      });
    }

    return { order: newOrder, whatsappUrl };
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order status updated to "${status}"`);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        updateSettings,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        cart,
        addToCart,
        updateCartItemQty,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotal,
        cartShipping,
        cartCount,
        orders,
        placeWhatsAppOrder,
        updateOrderStatus,
        currentUser,
        loginCustomer,
        loginAdmin,
        logout,
        updateCustomerProfile,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        isAuthOpen,
        setIsAuthOpen,
        isAdminOpen,
        setIsAdminOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductForDetail,
        setSelectedProductForDetail,
        lastPlacedOrder,
        setLastPlacedOrder,
        isOrderSuccessOpen,
        setIsOrderSuccessOpen,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
