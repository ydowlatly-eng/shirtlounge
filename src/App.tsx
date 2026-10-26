/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { SignInModal } from './components/SignInModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { Toast } from './components/Toast';

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-[#0c0d10] text-[#f4f4f2] flex flex-col font-sans selection:bg-[#d4f800] selection:text-black">
        <Navbar />
        <main className="flex-1">
          <HeroBanner />
          <ProductGrid />
        </main>
        <Footer />

        {/* Interactive Modals & Drawers */}
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <OrderSuccessModal />
        <SignInModal />
        <AdminDashboardModal />
        <Toast />
      </div>
    </StoreProvider>
  );
}
