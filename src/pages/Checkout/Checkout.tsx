import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, CheckCircle2, Truck, CreditCard, DollarSign, MessageCircle, MapPin, ArrowLeft } from 'lucide-react'
import SectionHeading from '../../components/SectionHeading'
import { useCart } from '../../context/CartContext'
import { siteSettings } from '../../data/mockData'

const FREE_SHIPPING_THRESHOLD = 120000

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('Cali')
  const [neighborhood, setNeighborhood] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'contra-entrega' | 'transferencia' | 'whatsapp'>('contra-entrega')

  // Submission state
  const [completedOrder, setCompletedOrder] = useState<any | null>(null)

  // Shipping calculation
  const isCali = city.toLowerCase().includes('cali')
  const shippingCost = isCali
    ? subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : 8000
    : 15000
  const grandTotal = subtotal + shippingCost

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.')
      return
    }

    if (!fullName || !phone || !address) {
      alert('Por favor completa tu nombre, teléfono y dirección de entrega.')
      return
    }

    const orderId = `AFRO-${Math.floor(1000 + Math.random() * 9000)}`
    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: [...items],
      subtotal,
      shippingCost,
      grandTotal,
      customer: {
        fullName,
        email,
        phone,
        city,
        neighborhood,
        address,
        notes,
      },
      paymentMethod,
      status: 'Confirmado - En preparación',
    }

    // Persist in localStorage for profile page
    try {
      const existing = JSON.parse(localStorage.getItem('amv-orders') || '[]')
      localStorage.setItem('amv-orders', JSON.stringify([newOrder, ...existing]))
    } catch (err) {
      console.warn('Error saving order', err)
    }

    setCompletedOrder(newOrder)
    clearCart()
  }

  const handleSendWhatsAppConfirmation = () => {
    if (!completedOrder) return

    let text = `¡Hola ${siteSettings.name}! 🌿 Acabo de realizar el pedido *#${completedOrder.id}* en la web:\n\n`
    text += `👤 *Cliente:* ${completedOrder.customer.fullName}\n`
    text += `📞 *Teléfono:* ${completedOrder.customer.phone}\n`
    text += `📍 *Dirección:* ${completedOrder.customer.address}, ${completedOrder.customer.neighborhood} (${completedOrder.customer.city})\n`
    text += `💳 *Método de pago:* ${completedOrder.paymentMethod === 'contra-entrega' ? 'Contra entrega en Cali' : completedOrder.paymentMethod === 'transferencia' ? 'Transferencia Nequi/Bancolombia' : 'Por WhatsApp'}\n\n`
    text += `📦 *Productos:*\n`
    completedOrder.items.forEach((it: any, i: number) => {
      text += `${i + 1}. ${it.name} x${it.quantity} — $${(it.price * it.quantity).toLocaleString('es-CO')}\n`
    })
    text += `\nSubtotal: $${completedOrder.subtotal.toLocaleString('es-CO')}\n`
    text += `Envío: $${completedOrder.shippingCost.toLocaleString('es-CO')}\n`
    text += `💰 *TOTAL A PAGAR:* $${completedOrder.grandTotal.toLocaleString('es-CO')}\n`

    if (completedOrder.customer.notes) {
      text += `\n📝 *Nota:* ${completedOrder.customer.notes}\n`
    }
    text += `\n¿Me confirman recepción y tiempo de despacho?`

    const url = `https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  // Pantalla de Pedido Exitoso
  if (completedOrder) {
    return (
      <div className="container section-space page-inner">
        <div className="card" style={{ maxWidth: 680, margin: '0 auto', padding: '2.5rem', background: '#FFF9F3', border: '1px solid rgba(215, 183, 106, 0.4)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ width: 68, height: 68, background: 'rgba(37, 211, 102, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <CheckCircle2 size={40} color="#25D366" />
            </div>
            <span style={{ fontSize: '0.85rem', color: '#A65F45', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ¡Pedido confirmado con éxito!
            </span>
            <h2 style={{ fontSize: '2.2rem', margin: '0.4rem 0', color: '#2A1D17' }}>
              Pedido #{completedOrder.id}
            </h2>
            <p style={{ color: '#554', margin: 0, fontSize: '1rem' }}>
              Gracias por tu compra, <strong>{completedOrder.customer.fullName}</strong>. Estamos preparando tus productos botánicos.
            </p>
          </div>

          <div style={{ background: '#F5EEDF', borderRadius: 16, padding: '1.5rem', marginBottom: '1.75rem', display: 'grid', gap: '0.75rem', fontSize: '0.92rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(74, 48, 37, 0.1)', paddingBottom: '0.5rem' }}>
              <strong>Entrega en:</strong>
              <span>{completedOrder.customer.address}, {completedOrder.customer.neighborhood} ({completedOrder.customer.city})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(74, 48, 37, 0.1)', paddingBottom: '0.5rem' }}>
              <strong>Contacto:</strong>
              <span>{completedOrder.customer.phone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(74, 48, 37, 0.1)', paddingBottom: '0.5rem' }}>
              <strong>Forma de pago:</strong>
              <span style={{ textTransform: 'capitalize' }}>{completedOrder.paymentMethod.replace('-', ' ')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: '#A65F45', paddingTop: '0.25rem' }}>
              <span>Total a pagar:</span>
              <span>${completedOrder.grandTotal.toLocaleString('es-CO')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-whatsapp"
              style={{ width: '100%', justifyContent: 'center', padding: '0.95rem', fontSize: '1rem' }}
              onClick={handleSendWhatsAppConfirmation}
            >
              <MessageCircle size={20} /> Notificar y Enviar por WhatsApp
            </button>

            <Link
              to="/products"
              className="btn"
              style={{ width: '100%', justifyContent: 'center', background: 'transparent', border: '1px solid #c7a56a', color: '#4A3025' }}
            >
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Carrito vacío
  if (items.length === 0) {
    return (
      <div className="container section-space page-inner">
        <SectionHeading eyebrow="Checkout" title="Finaliza tu compra" align="center" />
        <div className="card" style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: '3rem 1.5rem', background: '#FFF9F3' }}>
          <ShoppingBag size={48} color="#A65F45" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Tu carrito está vacío</h3>
          <p style={{ color: '#665', marginBottom: '1.5rem' }}>No tienes productos para finalizar compra en este momento.</p>
          <Link to="/products" className="btn btn-primary">
            Explorar Tienda
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container section-space page-inner checkout-page">
      <SectionHeading
        eyebrow="Checkout Seguro"
        title="Finaliza tu pedido"
        description="Ingresa tus datos de entrega en Cali o a nivel nacional y escoge tu forma de pago preferida."
        align="center"
      />

      <form onSubmit={handlePlaceOrder} className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '2rem' }}>
        {/* Columna Izquierda: Datos y Pago */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 1. Datos de Envío */}
          <div className="card" style={{ padding: '1.75rem', background: '#FFF9F3' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#A65F45" /> 1. Datos de Entrega
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Camila Mosquera"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1px solid rgba(74, 48, 37, 0.2)', background: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                  Teléfono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 312 456 7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1px solid rgba(74, 48, 37, 0.2)', background: '#fff' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                  Ciudad *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1px solid rgba(74, 48, 37, 0.2)', background: '#fff' }}
                >
                  <option value="Cali">Cali (Domicilio local express)</option>
                  <option value="Palmira">Palmira / Jamundí / Yumbo</option>
                  <option value="Bogota">Bogotá D.C.</option>
                  <option value="Medellin">Medellín</option>
                  <option value="Otra ciudad">Otra ciudad de Colombia</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                  Barrio o Sector *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. El Peñón, San Fernando..."
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1px solid rgba(74, 48, 37, 0.2)', background: '#fff' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                Dirección exacta (Calle, Carrera, Edificio, Apto) *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Calle 10 # 75-30, Apto 402"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1px solid rgba(74, 48, 37, 0.2)', background: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>
                Notas de entrega (opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Dejar en portería o llamar antes de llegar"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1px solid rgba(74, 48, 37, 0.2)', background: '#fff' }}
              />
            </div>
          </div>

          {/* 2. Método de Pago */}
          <div className="card" style={{ padding: '1.75rem', background: '#FFF9F3' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} color="#A65F45" /> 2. Método de Pago
            </h3>

            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: 12,
                  border: paymentMethod === 'contra-entrega' ? '2px solid #A65F45' : '1px solid rgba(74, 48, 37, 0.15)',
                  background: paymentMethod === 'contra-entrega' ? 'rgba(215, 183, 106, 0.1)' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'contra-entrega'}
                  onChange={() => setPaymentMethod('contra-entrega')}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: '#2A1D17' }}>Pago Contra Entrega en Cali</strong>
                  <span style={{ fontSize: '0.8rem', color: '#665' }}>Paga en efectivo o con datáfono al recibir tu pedido en tu puerta.</span>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: 12,
                  border: paymentMethod === 'transferencia' ? '2px solid #A65F45' : '1px solid rgba(74, 48, 37, 0.15)',
                  background: paymentMethod === 'transferencia' ? 'rgba(215, 183, 106, 0.1)' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'transferencia'}
                  onChange={() => setPaymentMethod('transferencia')}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: '#2A1D17' }}>Transferencia Nequi / Bancolombia / Daviplata</strong>
                  <span style={{ fontSize: '0.8rem', color: '#665' }}>Transfiere desde tu celular y envías el comprobante por WhatsApp.</span>
                </div>
              </label>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem',
                  borderRadius: 12,
                  border: paymentMethod === 'whatsapp' ? '2px solid #A65F45' : '1px solid rgba(74, 48, 37, 0.15)',
                  background: paymentMethod === 'whatsapp' ? 'rgba(215, 183, 106, 0.1)' : '#fff',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'whatsapp'}
                  onChange={() => setPaymentMethod('whatsapp')}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem', color: '#2A1D17' }}>Coordinar pago por WhatsApp</strong>
                  <span style={{ fontSize: '0.8rem', color: '#665' }}>Una asesora te contactará para confirmar detalles y facilitarte el enlace de pago.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen de Pedido */}
        <div>
          <aside className="card cart-summary" style={{ padding: '1.75rem', background: '#FFF9F3', position: 'sticky', top: '100px' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.2rem' }}>Resumen del Pedido</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', maxHeight: 240, overflowY: 'auto' }}>
              {items.map((item) => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={item.image} alt={item.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                    <span>{item.name} <small style={{ color: '#888' }}>x{item.quantity}</small></span>
                  </div>
                  <strong>${(item.price * item.quantity).toLocaleString('es-CO')}</strong>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(74, 48, 37, 0.12)', paddingTop: '1rem', display: 'grid', gap: '0.6rem', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal productos:</span>
                <strong>${subtotal.toLocaleString('es-CO')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Costo de envío ({isCali ? 'Cali' : 'Nacional'}):</span>
                <span>
                  {shippingCost === 0 ? (
                    <strong style={{ color: '#25D366' }}>¡GRATIS!</strong>
                  ) : (
                    <strong>${shippingCost.toLocaleString('es-CO')}</strong>
                  )}
                </span>
              </div>

              {shippingCost > 0 && isCali && (
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#A65F45' }}>
                  💡 Agrega ${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString('es-CO')} más para envío gratis en Cali.
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid rgba(74, 48, 37, 0.15)', paddingTop: '0.75rem', fontSize: '1.15rem', color: '#2A1D17' }}>
                <strong>Total a Pagar:</strong>
                <strong style={{ color: '#A65F45' }}>${grandTotal.toLocaleString('es-CO')}</strong>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem', marginTop: '1.5rem' }}
            >
              Confirmar Pedido (${grandTotal.toLocaleString('es-CO')})
            </button>

            <Link
              to="/cart"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '1rem', width: '100%', fontSize: '0.85rem', color: '#776', textDecoration: 'none' }}
            >
              <ArrowLeft size={14} /> Volver a editar el carrito
            </Link>
          </aside>
        </div>
      </form>
    </div>
  )
}
