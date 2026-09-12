import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import Home from './pages/Home/Home'
import AboutPage from './pages/About/About'
import ServicesPage from './pages/Services/Services'
import ProductsPage from './pages/Products/Products'
import GalleryPage from './pages/Gallery/Gallery'
import ContactPage from './pages/Contact/Contact'
import BookingPage from './pages/Booking/Booking'
import CartPage from './pages/Cart/Cart'
import CheckoutPage from './pages/Checkout/Checkout'
import ProfilePage from './pages/Profile/Profile'
import AdminPage from './pages/Admin/Admin'
import HairQuiz from './pages/Quiz/HairQuiz'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="quiz" element={<HairQuiz />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>
    </Routes>
  )
}
