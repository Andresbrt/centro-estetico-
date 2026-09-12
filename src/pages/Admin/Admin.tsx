import React, { useEffect, useMemo, useState } from 'react'
import SectionHeading from '../../components/SectionHeading'
import { useAuth } from '../../context/AuthContext'
import { fetchDashboardStats, fetchGallery, fetchServices, upsertGalleryItem, upsertService, deleteGalleryItem, deleteService } from '../../services/adminService'
import { siteSettings } from '../../data/mockData'
import type { Service, SEOSettings } from '../../types'

const defaultSeo: SEOSettings = {
  title: 'Centro de Experiencia Afro Maira Vásquez | Peluquería Afro en Cali',
  description: 'Peluquería especializada en cabello afro, rizado, ondulado y transición capilar en Cali, Colombia.',
  keywords: 'peluquería afro cali, cabello afro cali, peluquero afro cali, transición capilar cali, estilismo afro',
  ogTitle: 'Centro de Experiencia Afro Maira Vásquez',
  ogDescription: 'Cuidado profesional para cabellos afro, rizados, ondulados y procesos de transición.',
  canonical: 'https://centroafro.com',
}

const defaultService: Omit<Service, 'id'> = {
  name: 'Nuevo servicio',
  slug: 'nuevo-servicio',
  short_description: 'Descripción breve del servicio.',
  description: 'Descripción detallada del servicio.',
  image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  price: 50000,
  duration: 60,
  active: true,
}

export default function AdminPage() {
  const { login, isAdmin, logout, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [serviceList, setServiceList] = useState<Service[]>([])
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [seo, setSeo] = useState<SEOSettings>(defaultSeo)
  const [gallery, setGallery] = useState<Array<{ id: string; title: string; url: string; category: string; position: number; active: boolean }>>([])
  const [stats, setStats] = useState({ bookings: 0, leads: 0, revenue: 0, orders: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAdmin) return
    const loadData = async () => {
      setLoading(true)
      try {
        const [servicesData, galleryData, dashboardData] = await Promise.all([
          fetchServices(),
          fetchGallery(),
          fetchDashboardStats(),
        ])
        setServiceList(servicesData)
        setGallery(galleryData)
        setStats(dashboardData)
      } catch (err) {
        console.error('Admin load failed', err)
      } finally {
        setLoading(false)
      }
    }

    void loadData()
  }, [isAdmin])

  const metrics = useMemo(
    () => [
      { label: 'Servicios activos', value: String(serviceList.length), trend: `${serviceList.length > 0 ? '+100%' : '0%'}` },
      { label: 'Ingresos del catálogo', value: `$${serviceList.reduce((sum, item) => sum + Number(item.price ?? 0), 0).toLocaleString('es-CO')}`, trend: '+12%' },
      { label: 'Fotos en galería', value: String(gallery.length), trend: '+8%' },
      { label: 'Reservas', value: String(stats.bookings || 0), trend: '+15%' },
    ],
    [gallery.length, serviceList, stats.bookings],
  )

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    const result = await login(email, password)
    if (!result.ok) {
      setError(result.message ?? 'No se pudo iniciar sesión.')
      return
    }
    setError('')
  }

  const handleSaveService = async () => {
    if (!editingService) return
    try {
      const saved = await upsertService(editingService)
      setServiceList((prev) => {
        const exists = prev.some((item) => item.id === saved.id)
        if (exists) {
          return prev.map((item) => (item.id === saved.id ? saved : item))
        }
        return [saved, ...prev]
      })
      setEditingService(saved)
    } catch (err) {
      console.error('Save service failed', err)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(serviceId)
      setServiceList((prev) => prev.filter((item) => item.id !== serviceId))
    } catch (err) {
      console.error('Delete service failed', err)
    }
  }

  const handleAddGalleryImage = async () => {
    const nextItem = {
      title: 'Nueva imagen',
      category: 'Galería',
      url: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
      position: gallery.length + 1,
      active: true,
    }

    try {
      const saved = await upsertGalleryItem(nextItem)
      setGallery((prev) => [...prev, saved])
    } catch (err) {
      console.error('Add gallery item failed', err)
    }
  }

  const handleDeleteGalleryImage = async (imageId: string) => {
    try {
      await deleteGalleryItem(imageId)
      setGallery((prev) => prev.filter((item) => item.id !== imageId))
    } catch (err) {
      console.error('Delete gallery item failed', err)
    }
  }

  if (!isAdmin) {
    return (
      <div className="container section-space page-inner">
        <div className="card" style={{ maxWidth: 560, margin: '0 auto', padding: '2rem' }}>
          <SectionHeading eyebrow="Admin" title="Iniciar sesión" description="Accede al panel para gestionar servicios, fotos, SEO y rendimiento del negocio." align="center" />
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label htmlFor="admin-email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Correo</label>
              <input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" style={{ width: '100%' }} />
            </div>
            <div>
              <label htmlFor="admin-password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Contraseña</label>
              <input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%' }} />
            </div>
            {error && <p style={{ color: '#d14b4b', margin: 0 }}>{error}</p>}
            <button className="btn btn-primary" type="submit">Ingresar</button>

            <div style={{ padding: '0.75rem 1rem', background: '#f8f5f0', borderRadius: '8px', border: '1px solid #e2d9ce', fontSize: '0.88rem', color: '#4a3b32', marginTop: '0.5rem' }}>
              <p style={{ margin: '0 0 0.4rem 0', fontWeight: 600, color: '#2c221e' }}>💡 Credenciales de prueba (modo local):</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <span>
                  <strong>Correo:</strong> <code>admin@afro.com</code><br />
                  <strong>Contraseña:</strong> <code>admin123</code>
                </span>
                <button
                  type="button"
                  className="btn"
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', background: '#6f4e37', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                  onClick={() => {
                    setEmail('admin@afro.com')
                    setPassword('admin123')
                  }}
                >
                  Autocompletar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container section-space page-inner">
      <SectionHeading eyebrow="Dashboard" title="Panel administrativo" description="Control de servicios, contenido visual, SEO y métricas del negocio." align="center" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div>
          <strong>Hola, {user?.full_name ?? 'Admin'}</strong>
        </div>
        <button className="btn btn-secondary" onClick={() => void logout()}>Cerrar sesión</button>
      </div>

      <div className="card-grid">
        {metrics.map((metric) => (
          <div key={metric.label} className="card" style={{ padding: '1.5rem' }}>
            <h3>{metric.label}</h3>
            <p style={{ fontSize: '2rem', margin: '0.5rem 0', fontWeight: 700 }}>{metric.value}</p>
            <span style={{ color: '#2bb673', fontWeight: 600 }}>{metric.trend}</span>
          </div>
        ))}
      </div>

      <div className="card-grid" style={{ marginTop: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3>Servicios</h3>
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            {serviceList.length === 0 && !loading ? <p>No hay servicios todavía.</p> : null}
            {serviceList.map((service) => (
              <div key={service.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '0.5rem' }}>
                <div>
                  <strong>{service.name}</strong>
                  <div style={{ fontSize: '0.85rem', opacity: 0.75 }}>{service.short_description}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary" onClick={() => setEditingService(service)}>Editar</button>
                  <button className="btn btn-primary" onClick={() => void handleDeleteService(service.id)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3>Editar servicio</h3>
          {editingService ? (
            <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
              <input value={editingService.name ?? ''} onChange={(e) => setEditingService({ ...editingService, name: e.target.value })} placeholder="Nombre del servicio" />
              <input value={editingService.slug ?? ''} onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })} placeholder="slug" />
              <textarea rows={3} value={editingService.short_description ?? ''} onChange={(e) => setEditingService({ ...editingService, short_description: e.target.value })} placeholder="Descripción corta" />
              <textarea rows={4} value={editingService.description ?? ''} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} placeholder="Descripción detallada" />
              <input value={editingService.image_url ?? ''} onChange={(e) => setEditingService({ ...editingService, image_url: e.target.value })} placeholder="URL de imagen" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <input type="number" value={editingService.price ?? 0} onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })} placeholder="Precio" />
                <input type="number" value={editingService.duration ?? 60} onChange={(e) => setEditingService({ ...editingService, duration: Number(e.target.value) })} placeholder="Duración" />
              </div>
              <button className="btn btn-primary" onClick={() => void handleSaveService()}>Guardar cambios</button>
            </div>
          ) : (
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={() => setEditingService({ ...defaultService, id: `svc-${Date.now()}` } as Service)}>Crear servicio</button>
            </div>
          )}
        </div>
      </div>

      <div className="card-grid" style={{ marginTop: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3>Fotos / Galería</h3>
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            {gallery.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <img src={item.url} alt={item.title} style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 12 }} />
                <div style={{ flex: 1 }}>
                  <strong>{item.title}</strong>
                  <div style={{ opacity: 0.7 }}>{item.category}</div>
                </div>
                <button className="btn btn-secondary" onClick={() => void handleDeleteGalleryImage(item.id)}>Quitar</button>
              </div>
            ))}
            <button className="btn btn-primary" onClick={() => void handleAddGalleryImage()}>Agregar foto</button>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3>SEO y meta datos</h3>
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            <input value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} placeholder="Título SEO" />
            <textarea rows={3} value={seo.description} onChange={(e) => setSeo({ ...seo, description: e.target.value })} placeholder="Meta description" />
            <input value={seo.keywords} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} placeholder="Keywords" />
            <input value={seo.ogTitle} onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })} placeholder="OG Title" />
            <textarea rows={3} value={seo.ogDescription} onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })} placeholder="OG Description" />
            <input value={seo.canonical} onChange={(e) => setSeo({ ...seo, canonical: e.target.value })} placeholder="Canonical URL" />
            <button className="btn btn-primary" onClick={() => { document.title = seo.title; }}>Guardar SEO</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <h3>Datos del negocio</h3>
        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
          <input value={siteSettings.name} readOnly />
          <input value={siteSettings.address} readOnly />
          <input value={siteSettings.instagram} readOnly />
          <input value={siteSettings.whatsapp} readOnly />
        </div>
      </div>
    </div>
  )
}
