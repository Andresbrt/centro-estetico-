import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, MessageCircle, Truck } from 'lucide-react'
import SectionHeading from '../../components/SectionHeading'
import { useCart } from '../../context/CartContext'
import { siteSettings } from '../../data/mockData'

const FREE_SHIPPING_THRESHOLD = 120000

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart()
  const [cityDestination, setCityDestination] = useState('Cali')
  const navigate = useNavigate()

  const isCali = cityDestination.toLowerCase().includes('cali')
  const shippingCost = isCali
    ? subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : 8000
    : 15000
  const grandTotal = subtotal + shippingCost
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return

    let text = `¡Hola ${siteSettings.name}! 🌿 Quiero hacer el siguiente pedido:\n\n`
    items.forEach((item, idx) => {
      text += `${idx + 1}. *${item.name}* x${item.quantity} — $${(item.price * item.quantity).toLocaleString('es-CO')}\n`
    })
    text += `\n📦 Subtotal: $${subtotal.toLocaleString('es-CO')}`
    text += `\n🛵 Envío estimado: ${shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toLocaleString('es-CO')}`} (${cityDestination})`
    text += `\n💰 *Total estimado:* $${grandTotal.toLocaleString('es-CO')}`
    text += `\n\n¿Tienen disponibilidad para entrega en ${cityDestination}?`

    const url = `https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <div className="container section-space page-inner">
      <SectionHeading
        eyebrow="Carrito de Compras"
        title="Revisa tu selección botánica"
        description="Ajusta cantidades, verifica el costo de envío y completa tu pedido online o directamente por WhatsApp."
        align="center"
      />

      {items.length === 0 ? (
        <div className="card" style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', padding: '3.5rem 1.5rem', background: '#FFF9F3', border: '1px solid rgba(215, 183, 106, 0.3)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(215, 183, 106, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <ShoppingBag size={30} color="#A65F45" />
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2A1D17' }}>Tu carrito está vacío</h3>
          <p style={{ color: '#665', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Descubre nuestras fórmulas limpias libres de sulfatos para mimar tus rizos u ondas.
          </p>
          <Link to="/products" className="btn btn-primary">
            Ver catálogo de productos
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Lista de Items */}
          <div className="cart-items">
            {/* Barra de progreso de envío gratis */}
            <div className="shipping-progress-box" style={{ marginBottom: '1.5rem' }}>
              <p className="shipping-progress-text">
                {remainingForFreeShipping > 0 ? (
                  <>
                    🛵 Te faltan <strong>${remainingForFreeShipping.toLocaleString('es-CO')}</strong> para <strong>Envío Gratis en Cali</strong>
                  </>
                ) : (
                  <>
                    🎉 <strong>¡Tienes Envío Gratis en Cali asegurado!</strong>
                  </>
                )}
              </p>
              <div className="shipping-progress-bar-bg">
                <div
                  className="shipping-progress-bar-fill"
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>

            {items.map((item) => (
              <div key={item.productId} className="card cart-row" style={{ background: '#FFF9F3', display: 'grid', gridTemplateColumns: '80px 1fr auto auto auto', gap: '1rem', alignItems: 'center' }}>
                <img src={item.image} alt={item.name} className="cart-thumb" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} />
                <div className="cart-main">
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: '#2A1D17' }}>{item.name}</h3>
                  <p style={{ margin: 0, color: '#776', fontSize: '0.85rem' }}>${item.price.toLocaleString('es-CO')} c/u</p>
                </div>
                <div className="cart-controls" style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid rgba(74, 48, 37, 0.15)', borderRadius: 8, background: '#fff' }}>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    style={{ background: 'transparent', border: 'none', padding: '0.35rem 0.6rem', cursor: 'pointer' }}
                    aria-label="Disminuir cantidad"
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ padding: '0 0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    style={{ background: 'transparent', border: 'none', padding: '0.35rem 0.6rem', cursor: 'pointer' }}
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <strong style={{ color: '#A65F45', fontSize: '1.05rem' }}>
                  ${(item.price * item.quantity).toLocaleString('es-CO')}
                </strong>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removeItem(item.productId)}
                  style={{ background: 'transparent', border: 'none', color: '#c0533e', cursor: 'pointer', padding: '0.4rem' }}
                  title="Eliminar producto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <Link to="/products" style={{ fontSize: '0.88rem', color: '#8c4e36', textDecoration: 'none', fontWeight: 600 }}>
                ← Continuar comprando más productos
              </Link>
              <button
                type="button"
                onClick={clearCart}
                style={{ background: 'transparent', border: 'none', color: '#998', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* Resumen Lateral */}
          <aside className="card cart-summary" style={{ background: '#FFF9F3', padding: '1.75rem', position: 'sticky', top: '100px' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.25rem' }}>Resumen de Compra</h3>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.84rem', fontWeight: 600, color: '#4A3025' }}>
                Destino de envío:
              </label>
              <select
                value={cityDestination}
                onChange={(e) => setCityDestination(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 8, border: '1px solid rgba(74, 48, 37, 0.2)', background: '#fff', fontSize: '0.88rem' }}
              >
                <option value="Cali">Cali (Domicilio local)</option>
                <option value="Nacional">Otras ciudades de Colombia</option>
              </select>
            </div>

            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.92rem' }}>
              <span>Subtotal:</span>
              <strong>${subtotal.toLocaleString('es-CO')}</strong>
            </div>

            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.92rem' }}>
              <span>Envío ({isCali ? 'Cali' : 'Nacional'}):</span>
              <span>
                {shippingCost === 0 ? (
                  <strong style={{ color: '#25D366' }}>¡GRATIS!</strong>
                ) : (
                  <strong>${shippingCost.toLocaleString('es-CO')}</strong>
                )}
              </span>
            </div>

            <div className="summary-row total" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid rgba(74, 48, 37, 0.15)', paddingTop: '0.85rem', marginTop: '0.85rem', fontSize: '1.2rem', color: '#2A1D17' }}>
              <span>Total:</span>
              <strong style={{ color: '#A65F45' }}>${grandTotal.toLocaleString('es-CO')}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.95rem', fontSize: '1rem' }}
                onClick={() => navigate('/checkout')}
              >
                Continuar al checkout <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className="btn btn-whatsapp"
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
                onClick={handleWhatsAppOrder}
              >
                <MessageCircle size={18} /> Pedir directo por WhatsApp
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
