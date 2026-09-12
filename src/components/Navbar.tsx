import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, ShoppingCart, Sparkles } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { totalItems, openDrawer } = useCart()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { label: 'Inicio', to: '/' },
    { label: 'Servicios', to: '/services' },
    { label: 'Productos', to: '/products' },
    { label: 'Test Capilar ✨', to: '/quiz' },
    { label: 'Galería', to: '/gallery' },
    { label: 'Nosotros', to: '/about' },
    { label: 'Contacto', to: '/contact' },
  ]

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-shell">
        <Link to="/" className="brand">
          <span className="brand-mark"><Sparkles size={16} /></span>
          <span>Centro Afro</span>
        </Link>

        <nav className="desktop-nav" aria-label="Principal">
          {navItems.map(({ label, to }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="cart-button"
            aria-label="Carrito de compras"
            onClick={openDrawer}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>

          <Link to="/booking" className="btn btn-primary nav-cta">
            Agendar cita
          </Link>

          <button className="menu-toggle" aria-label="Abrir menú" onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
            <Menu size={20} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-nav">
          {navItems.map(({ label, to }) => (
            <NavLink key={to} to={to} onClick={() => setIsMobileMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          <Link to="/booking" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
            Agendar cita
          </Link>
        </div>
      )}
    </header>
  )
}
