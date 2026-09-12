import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Calendar, ShoppingBag, Clock, CheckCircle, Package, ArrowRight, MessageCircle } from 'lucide-react'
import SectionHeading from '../../components/SectionHeading'
import { useAuth } from '../../context/AuthContext'
import { siteSettings } from '../../data/mockData'

export default function ProfilePage() {
  const { user, logout, isAdmin } = useAuth()

  const [bookings, setBookings] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    try {
      const savedBookings = JSON.parse(localStorage.getItem('amv-bookings') || '[]')
      const savedOrders = JSON.parse(localStorage.getItem('amv-orders') || '[]')
      setBookings(savedBookings)
      setOrders(savedOrders)
    } catch (err) {
      console.warn('Could not load profile records', err)
    }
  }, [])

  return (
    <div className="container section-space page-inner">
      <SectionHeading
        eyebrow="Área de Cliente"
        title="Mi Cuenta y Seguimiento"
        description="Revisa el estado de tus citas agendadas, tus pedidos de productos y tus datos personales."
        align="center"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* 1. Información de Usuario */}
        <div className="card" style={{ padding: '2rem', background: '#FFF9F3', border: '1px solid rgba(215, 183, 106, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gradient-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#171310' }}>
              <User size={28} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', color: '#2A1D17' }}>
                {user ? user.full_name : 'Cliente Registrada'}
              </h3>
              <span style={{ fontSize: '0.82rem', color: '#A65F45', fontWeight: 600 }}>
                {isAdmin ? '★ Administradora' : 'Miembro Comunidad Afro'}
              </span>
            </div>
          </div>

          <div style={{ background: '#F5EEDF', padding: '1rem', borderRadius: 12, marginBottom: '1.5rem', display: 'grid', gap: '0.5rem', fontSize: '0.88rem' }}>
            <div><strong>Sede habitual:</strong> Cra 79B #10A-61, Local 3 · Cali</div>
            <div><strong>Asesoría WhatsApp:</strong> {siteSettings.whatsapp}</div>
            {user?.phone && <div><strong>Teléfono:</strong> {user.phone}</div>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/booking" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              <Calendar size={16} /> Agendar nueva cita
            </Link>
            <Link to="/products" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <ShoppingBag size={16} /> Ir a la tienda de productos
            </Link>
            {user && (
              <button
                type="button"
                onClick={() => logout()}
                style={{ background: 'transparent', border: '1px solid #c7a56a', padding: '0.5rem', borderRadius: 8, color: '#4A3025', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>

        {/* 2. Citas Agendadas */}
        <div className="card" style={{ padding: '2rem', background: '#FFF9F3', border: '1px solid rgba(215, 183, 106, 0.3)' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={20} color="#A65F45" /> Mis Citas ({bookings.length})
          </h3>

          {bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#776' }}>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.92rem' }}>No tienes citas activas registradas en este dispositivo.</p>
              <Link to="/booking" className="btn btn-primary" style={{ fontSize: '0.88rem' }}>
                Reservar tu primera cita
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: 320, overflowY: 'auto' }}>
              {bookings.map((b) => (
                <div key={b.id} style={{ border: '1px solid rgba(74, 48, 37, 0.12)', borderRadius: 12, padding: '1rem', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.98rem', color: '#2A1D17' }}>{b.serviceName}</strong>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(37, 211, 102, 0.15)', color: '#128C7E', padding: '0.2rem 0.6rem', borderRadius: 999, fontWeight: 700 }}>
                      {b.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#665', display: 'grid', gap: '0.2rem' }}>
                    <div><strong>Fecha:</strong> {b.date} a las {b.time}</div>
                    <div><strong>Estilista:</strong> {b.specialist}</div>
                    <div><strong>Total:</strong> ${b.price?.toLocaleString('es-CO')}</div>
                  </div>
                  <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                    <a
                      href={`https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(`Hola! Quiero consultar sobre mi cita de ${b.serviceName} del día ${b.date} a las ${b.time}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.78rem', color: '#A65F45', textDecoration: 'none', fontWeight: 700 }}
                    >
                      💬 Coordinar por WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Pedidos de Productos */}
        <div className="card" style={{ padding: '2rem', background: '#FFF9F3', border: '1px solid rgba(215, 183, 106, 0.3)' }}>
          <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={20} color="#A65F45" /> Mis Pedidos ({orders.length})
          </h3>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#776' }}>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.92rem' }}>Aún no has realizado pedidos de productos.</p>
              <Link to="/products" className="btn btn-secondary" style={{ fontSize: '0.88rem' }}>
                Ver productos botánicos
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: 320, overflowY: 'auto' }}>
              {orders.map((o) => (
                <div key={o.id} style={{ border: '1px solid rgba(74, 48, 37, 0.12)', borderRadius: 12, padding: '1rem', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#2A1D17' }}>Pedido #{o.id}</strong>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(215, 183, 106, 0.25)', color: '#4A3025', padding: '0.2rem 0.6rem', borderRadius: 999, fontWeight: 700 }}>
                      {o.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#665', display: 'grid', gap: '0.2rem' }}>
                    <div><strong>Artículos:</strong> {o.items?.map((it: any) => `${it.name} (x${it.quantity})`).join(', ')}</div>
                    <div><strong>Entrega:</strong> {o.customer?.city} · {o.customer?.address}</div>
                    <div style={{ color: '#A65F45', fontWeight: 700, marginTop: '0.2rem' }}>
                      Total: ${o.grandTotal?.toLocaleString('es-CO')}
                    </div>
                  </div>
                  <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                    <a
                      href={`https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(`Hola! Quiero consultar el estado de despacho de mi pedido #${o.id}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.78rem', color: '#A65F45', textDecoration: 'none', fontWeight: 700 }}
                    >
                      💬 Consultar estado por WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
