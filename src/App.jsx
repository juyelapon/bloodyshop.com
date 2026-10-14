
import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'

import Header from './components/Header'
import Hero from './components/Hero'
import Second from './components/Second'
import Card from './components/Card'
import Deals from './components/Deals'
import Footer from './components/Footer'
import ScrollToTop from './ScrollToTop'

import ProductDetails from './pages/ProductDetails'
import ShoppingCart from './pages/ShoppingCart'
import Checkout from './pages/Checkout'
import LoginRegister from './pages/LoginRegister'
import Categories from './pages/Categories'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import DealsPage from './pages/Dealso'
import Wishlist from './pages/Wishlist'
import SearchResults from './pages/SearchResults'
import FlashSale from './pages/FlashSale'
import FreeShipping from './pages/FreeShipping'
import MyOrders from './pages/MyOrders'
import AdminDashboard from './pages/AdminDashboard'
import MyAccount from './pages/MyAccount'
import OrderTracking from './pages/OrderTracking'
import AdminLogin from './pages/AdminLogin'

const Home = () => {
  return (
    <>
      <Hero />
      <Second />
      <Card />
      <Deals />
    </>
  )
}

// Protect Admin Dashboard
const ProtectedAdminRoute = ({ children }) => {
  const location = useLocation()

  const isAdmin = sessionStorage.getItem('shophub_admin_logged_in') === 'true'

  if (!isAdmin) {
    return (
      <Navigate
        to="/admin-login"
        replace
        state={{ from: location }}
      />
    )
  }

  return children
}

// Admin login page layout without the normal Header/Footer
const AdminLoginLayout = () => {
  return <AdminLogin />
}

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Admin login */}
        <Route
          path="/admin-login"
          element={<AdminLoginLayout />}
        />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        {/* Normal website pages */}
        <Route
          path="/*"
          element={
            <>
              <Header />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<LoginRegister />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/deals" element={<DealsPage />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/deals/flash-sale" element={<FlashSale />} />
                <Route path="/deals/free-shipping" element={<FreeShipping />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/account" element={<MyAccount />} />
                <Route path="/track-order" element={<OrderTracking />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
