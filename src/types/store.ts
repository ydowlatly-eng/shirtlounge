export type ProductCategory = 'all' | 't-shirts' | 'hoodies' | 'sweatshirts';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: 't-shirts' | 'hoodies' | 'sweatshirts';
  price: number;
  originalPrice?: number;
  image: string;
  additionalImages?: string[];
  description: string;
  fit: string;
  fabricWeight: string;
  sizes: string[];
  colors: ProductColor[];
  badge?: string;
  stock: number;
  isFeatured?: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item id in cart (product.id + size + color)
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  category: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: 'cod' | 'whatsapp_pay' | 'bank_transfer';
  status: 'new' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  whatsappMessage: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isAdmin: boolean;
}

export interface StoreSettings {
  storeName: string;
  adminWhatsappNumber: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  flatShippingRate: number;
  announcementText: string;
}
