import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Sparkles, HelpCircle } from 'lucide-react'
import SectionHeading from '../../components/SectionHeading'
import ServiceCard from '../../components/ServiceCard'
import { fetchPublishedServices } from '../../services/contentService'
import { services as fallbackServices } from '../../data/mockData'
import type { Service } from '../../types'

const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'transicion', label: 'Transición Capilar' },
  { id: 'corte', label: 'Cortes en Seco' },
  { id: 'definicion', label: 'Definición de Rizos' },
  { id: 'hidratacion', label: 'Hidratación & Nutrición' },
]

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadServices = async () => {
      const data = await fetchPublishedServices()
      setItems(data.length > 0 ? data : fallbackServices)
    }

    void loadServices()
  }, [])

  const filteredServices = useMemo(() => {
    return items.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (selectedCategory === 'todos') return true
      if (selectedCategory === 'transicion') return service.slug.includes('transicion') || service.category?.includes('transicion')
      if (selectedCategory === 'corte') return service.slug.includes('corte') || service.name.toLowerCase().includes('corte')
      if (selectedCategory === 'definicion') return service.slug.includes('definicion') || service.name.toLowerCase().includes('definicion')
      if (selectedCategory === 'hidratacion') return service.slug.includes('hidratacion') || service.name.toLowerCase().includes('hidratacion')

      return true
    })
  }, [items, selectedCategory, searchQuery])

  return (
    <div className="container section-space page-inner">
      <SectionHeading
        eyebrow="Servicios en Cali"
        title="Especialistas en cuidado capilar auténtico"
        description="Cada servicio está pensado para realzar tu textura con técnica en seco, acompañamiento respetuoso y resultados naturales."
        align="center"
      />

      {/* Buscador */}
      <div className="search-filter-wrap">
        <Search size={18} className="search-filter-icon" />
        <input
          type="text"
          className="search-filter-input"
          placeholder="Buscar por servicio (ej. definición, corte, hidratación)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Píldoras de Filtro */}
      <div className="filter-pill-container">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de servicios */}
      {filteredServices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#FFF9F3', borderRadius: 20 }}>
          <p style={{ fontSize: '1.1rem', color: '#4A3025', margin: '0 0 1rem 0' }}>No encontramos servicios con ese criterio de búsqueda.</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setSelectedCategory('todos')
              setSearchQuery('')
            }}
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <div className="card-grid services-grid">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {/* Callout hacia el Test Capilar */}
      <div style={{ marginTop: '4rem', background: 'var(--gradient-gold-soft)', border: '1px solid rgba(215, 183, 106, 0.4)', borderRadius: 24, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: '#FFF9F3', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Sparkles size={24} color="#A65F45" />
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', color: '#2A1D17' }}>¿No sabes cuál es el servicio indicado para ti?</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#554' }}>Haz nuestro diagnóstico capilar guiado de 2 minutos para recibir una recomendación experta.</p>
          </div>
        </div>
        <Link to="/quiz" className="btn btn-gold">
          Hacer Test Capilar ✨
        </Link>
      </div>
    </div>
  )
}
