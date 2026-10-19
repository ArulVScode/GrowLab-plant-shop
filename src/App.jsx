import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { ToastProvider } from "./components/common/Toast";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import ScrollToTop from "./components/common/ScrollToTop";

// Public pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Tracking from "./pages/Tracking";
import Wishlist from "./pages/Wishlist";
import InfoPage from "./pages/Info";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminProductCreate from "./pages/admin/ProductCreate";
import AdminProductDetail from "./pages/admin/ProductDetail";
import AdminProductEdit from "./pages/admin/ProductEdit";
import AdminCategories from "./pages/admin/Categories";
import AdminCategoryForm from "./pages/admin/CategoryForm";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import AdminCustomers from "./pages/admin/Customers";
import AdminCustomerDetail from "./pages/admin/CustomerDetail";
import AdminSettings from "./pages/admin/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ---------- PUBLIC / CUSTOMER AREA ---------- */}
        <Route
          element={
            <CustomerAuthProvider>
              <CartProvider>
                <ToastProvider>
                  <Layout />
                </ToastProvider>
              </CartProvider>
            </CustomerAuthProvider>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/track-order" element={<Tracking />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/info/:slug" element={<InfoPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ---------- ADMIN AREA ---------- */}
        <Route
          path="/admin/*"
          element={
            <AdminAuthProvider>
              <ToastProvider>
                <Outlet />
              </ToastProvider>
            </AdminAuthProvider>
          }
        >
          <Route path="login" element={<AdminLogin />} />

          <Route
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductCreate />} />
            <Route path="products/:id" element={<AdminProductDetail />} />
            <Route path="products/:id/edit" element={<AdminProductEdit />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="categories/new" element={<AdminCategoryForm />} />
            <Route path="categories/:id/edit" element={<AdminCategoryForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="customers/:id" element={<AdminCustomerDetail />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
