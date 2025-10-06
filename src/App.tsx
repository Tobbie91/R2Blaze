// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout";
import AdminLayout from "./layouts/AdminLayout";
import RequireAdmin from "./components/admin/RequireAdmin";

// public pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Policies from "./pages/Policies";
import OrderConfirmation from "./pages/order";

// admin pages
import AdminLogin from "./pages/AdminLogin";

import AdminPage from "./pages/AdminPage";
import AdminProductEditor from "./pages/AdminUploader";
import CheckoutSuccess from "./pages/checkoutSuccess";


export default function App() {
  return (
    <Routes>
      {/* Public site, wrapped by SiteLayout */}
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
      </Route>

      {/* Admin login is public (no layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected admin area, wrapped by AdminLayout */}
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/uploader/new" element={<AdminProductEditor/>} />
          <Route path="/admin/uploader/:id" element={<AdminProductEditor/>} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

