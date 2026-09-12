import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, MessageCircle, Sparkles } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { products, siteSettings } from '../data/mockData'

const FREE_SHIPPING_THRESHOLD = 120000

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, subtotal, totalItems, updateQuantity, removeItem, addItem } = useCart()
  const navigate = useNavigate()

  if (!isDrawerOpen) return null

  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  // Recommend a product not currently in the cart
  const crossSellProduct = products.find((p) => !items.some((item) => item.productId === p.id)) || products[0]

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return

    let text = `¡Hola ${siteSettings.name}! 🌿 Quisiera realizar el siguiente pedido de productos:\n\n`
    items.forEach((item, idx) => {
      text += `${idx + 1}. *${item.name}* x${item.quantity} — $${(item.price * item.quantity).toLocaleString('es-CO')}\n`
    })
    text += `\n💰 *Total:* $${subtotal.toLocaleString('es-CO')}`
    text += `\n📍 Ciudad de entrega: Cali`
    text += `\n\n¿Tienen disponibilidad para entrega inmediata?`

    const url = `https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const handleGoToCheckout = () => {
    closeDrawer()
    navigate('/checkout')
  }

  return (
    <div className="cart-drawer-overlay" onClick={closeDrawer}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()} aria-label="Carrito de compras">
        {/* Header */}
        <div className="cart-drawer-header">
          <h3>
            <ShoppingBag size={20} color="#A65F45" />
            Tu Carrito ({totalItems})
          </h3>
          <button type="button" className="cart-drawer-close" onClick={closeDrawer} aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="cart-drawer-body">
          {/* Barra de progreso de envío gratis */}
          <div className="shipping-progress-box">
            <p className="shipping-progress-text">
              {remainingForFreeShipping > 0 ? (
                <>
                  Te faltan <strong>${remainingForFreeShipping.toLocaleString('es-CO')}</strong> para <strong>Envío Gratis en Cali</strong> 🛵
                </>
              ) : (
                <>
                  🎉 <strong>¡Felicidades! Tienes Envío Gratis en Cali</strong>
                </>
              )}
            </p>
            <div className="shipping-progress-bar-bg">
              <div className="shipping-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#665' }}>
              <div style={{ width: 64, height: 64, margin: '0 auto 1rem auto', borderRadius: '50%', background: 'rgba(215, 183, 106, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={28} color="#A65F45" />
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#2A1D17' }}>Tu carrito está vacío</h4>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Descubre nuestros productos botánicos formulados para tu textura.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  closeDrawer()
                  navigate('/products')
                }}
              >
                Explorar productos
              </button>
            </div>
          ) : (
            <>
              {/* Lista de productos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map((item) => (
                  <div key={item.id} className="drawer-item">
                    <img src={item.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80'} alt={item.name} />
                    <div>
                      <h5 className="drawer-item-title">{item.name}</h5>
                      <span className="drawer-item-price">${item.price.toLocaleString('es-CO')}</span>
                      <div>
                        <div className="drawer-qty-controls">
                          <button
                            type="button"
                            className="drawer-qty-btn"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            aria-label="Disminuir"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="drawer-qty-num">{item.quantity}</span>
                          <button
                            type="button"
                            className="drawer-qty-btn"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            aria-label="Aumentar"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      style={{ background: 'transparent', border: 'none', color: '#b96551', cursor: 'pointer', padding: '0.4rem' }}
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Cross-sell */}
              {crossSellProduct && (
                <div className="cross-sell-section">
                  <p className="cross-sell-title">Completa tu rutina con:</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <img
                        src={crossSellProduct.image}
                        alt={crossSellProduct.name}
                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                      />
                      <div>
                        <strong style={{ fontSize: '0.85rem', display: 'block', color: '#2A1D17' }}>{crossSellProduct.name}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#A65F45', fontWeight: 600 }}>${crossSellProduct.price.toLocaleString('es-CO')}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', background: '#4A3025', color: '#fff', borderRadius: 8 }}
                      onClick={() => addItem(crossSellProduct)}
                    >
                      + Añadir
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-drawer-subtotal">
              <span>Subtotal:</span>
              <span>${subtotal.toLocaleString('es-CO')}</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#665', margin: 0 }}>Impuestos incluidos. Costo de envío calculado en el checkout.</p>

            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
              onClick={handleGoToCheckout}
            >
              Finalizar compra <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="btn btn-whatsapp"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
              onClick={handleWhatsAppOrder}
            >
              <MessageCircle size={18} /> Pedir directo por WhatsApp
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
