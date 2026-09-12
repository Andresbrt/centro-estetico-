import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Sparkles, Truck, ShieldCheck } from 'lucide-react'
import SectionHeading from '../../components/SectionHeading'
import ProductCard from '../../components/ProductCard'
import { products } from '../../data/mockData'

const CATEGORIES = [
  { id: 'todos', label: 'Todos los productos' },
  { id: 'Definición', label: 'Definición & Fijación' },
  { id: 'Limpieza', label: 'Limpieza & Detox' },
  { id: 'Tratamiento', label: 'Mascarillas & Nutrición' },
  { id: 'Protección', label: 'Protección & Serums' },
]

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (selectedCategory === 'todos') return true
      return product.category === selectedCategory
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="container section-space page-inner">
      <SectionHeading
        eyebrow="Tienda Afro-Botánica"
        title="Productos formulados para nutrir y definir tu textura"
        description="Fórmulas limpias, sin sulfatos agresivos, parabenos ni siliconas pesadas. Ideales para el método curly, cabello afro y transición capilar."
        align="center"
      />

      {/* Trust Badges */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#4A3025', fontWeight: 600 }}>
          <Truck size={16} color="#A65F45" /> Envíos gratis en Cali por compras &gt; $120.000
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#4A3025', fontWeight: 600 }}>
          <ShieldCheck size={16} color="#A65F45" /> 100% Libres de sulfatos y parabenos
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#4A3025', fontWeight: 600 }}>
          <Sparkles size={16} color="#A65F45" /> Asesoría por WhatsApp incluida
        </span>
      </div>

      {/* Buscador */}
      <div className="search-filter-wrap">
        <Search size={18} className="search-filter-icon" />
        <input
          type="text"
          className="search-filter-input"
          placeholder="Buscar producto (ej. crema, shampoo, mascarilla)..."
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

      {/* Grid de productos */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#FFF9F3', borderRadius: 20 }}>
          <p style={{ fontSize: '1.1rem', color: '#4A3025', margin: '0 0 1rem 0' }}>No encontramos productos con ese filtro.</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setSelectedCategory('todos')
              setSearchQuery('')
            }}
          >
            Ver todos los productos
          </button>
        </div>
      ) : (
        <div className="card-grid products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Callout hacia el Test Capilar */}
      <div style={{ marginTop: '4rem', background: 'var(--gradient-gold-soft)', border: '1px solid rgba(215, 183, 106, 0.4)', borderRadius: 24, padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.25rem', color: '#2A1D17' }}>¿No sabes qué productos combinar para tu rutina?</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#554' }}>Nuestro diagnóstico capilar te dice exactamente qué paso a paso necesita tu tipo de rizo.</p>
        </div>
        <Link to="/quiz" className="btn btn-gold">
          Armar mi rutina personalizada ✨
        </Link>
      </div>
    </div>
  )
}
