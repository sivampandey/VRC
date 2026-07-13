import React from 'react'
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'

// Layout & UI Imports
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import FloatingWhatsApp from './components/ui/FloatingWhatsApp'
import IntroSplash from './components/ui/IntroSplash'

// Page Imports
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Collections from './pages/Collections'
import CollectionDetail from './pages/CollectionDetail'
import CustomOrder from './pages/CustomOrder'
import About from './pages/About'
import Contact from './pages/Contact'
import Journal from './pages/Journal'
import JournalPost from './pages/JournalPost'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import GoogleAuthPopup from './pages/auth/GoogleAuthPopup'
import Dashboard from './pages/admin/Dashboard'
import ScrollToTop from './components/ui/ScrollToTop'

// Account section — uses its own layout (no Navbar/Footer)
import AccountLayout  from './components/account/AccountLayout'
import Profile        from './pages/account/Profile'
import Orders         from './pages/account/Orders'
import OrderDetail    from './pages/account/OrderDetail'
import Addresses      from './pages/account/Addresses'
import AccountWishlist from './pages/account/Wishlist'
import Security       from './pages/account/Security'

function Layout() {
  const location = useLocation()
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname)

  return (
    <div className="flex flex-col min-h-screen">
      <IntroSplash />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
      <FloatingWhatsApp />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ── Main site layout (with Navbar + Footer) ── */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:slug" element={<ProductDetail />} />
          <Route path="collections" element={<Collections />} />
          <Route path="collections/:slug" element={<CollectionDetail />} />
          <Route path="custom-order" element={<CustomOrder />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="journal" element={<Journal />} />
          <Route path="journal/:slug" element={<JournalPost />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success/:id" element={<OrderSuccess />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* ── Account section — own sidebar layout ── */}
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<Profile />} />
          <Route path="profile"    element={<Profile />} />
          <Route path="orders"     element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="addresses"  element={<Addresses />} />
          <Route path="wishlist"   element={<AccountWishlist />} />
          <Route path="security"   element={<Security />} />
        </Route>

        {/* ── Standalone pages ── */}
        <Route path="/admin"       element={<Dashboard />} />
        <Route path="/google-auth" element={<GoogleAuthPopup />} />
      </Routes>
    </>
  )
}
