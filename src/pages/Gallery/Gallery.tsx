import React, { useEffect, useState, useMemo } from 'react'
import { Eye, Sparkles } from 'lucide-react'
import SectionHeading from '../../components/SectionHeading'
import BeforeAfterSlider from '../../components/BeforeAfterSlider'
import GalleryModal from '../../components/GalleryModal'
import { fetchPublishedGallery } from '../../services/contentService'
import { galleryItems as fallbackGallery, transformations } from '../../data/mockData'
import type { GalleryItem } from '../../types'

const CATEGORIES = [
  { id: 'todos', label: 'Todos los looks' },
  { id: 'Cabello afro', label: 'Afro & Crespo (Tipo 4)' },
  { id: 'Cabello rizado', label: 'Rizos Definidos (Tipo 3)' },
  { id: 'Cabello ondulado', label: 'Ondas Naturales (Tipo 2)' },
  { id: 'Procesos', label: 'Transición & Procesos' },
  { id: 'Espacio', label: 'Sede Cali' },
]

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [selectedModalItem, setSelectedModalItem] = useState<GalleryItem | null>(null)

  useEffect(() => {
    const loadGallery = async () => {
      const data = await fetchPublishedGallery()
      setGalleryItems(data.length > 0 ? data : fallbackGallery)
    }

    void loadGallery()
  }, [])

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'todos') return galleryItems
    return galleryItems.filter((item) => item.category === selectedCategory)
  }, [galleryItems, selectedCategory])

  return (
    <div className="container section-space page-inner">
      <SectionHeading
        eyebrow="Lookbook & Resultados"
        title="Inspiración visual de nuestras transformaciones"
        description="Explora resultados reales de corte en seco, definición botánica y procesos de transición en Cali. Toca cualquier look para ver los detalles y agendar."
        align="center"
      />

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

      {/* Grid de Galería Interactivo */}
      <div className="gallery-grid gallery-page-grid">
        {filteredItems.map((item) => (
          <figure
            key={item.id}
            className="gallery-item large-gallery-item"
            style={{ cursor: 'pointer', position: 'relative' }}
            onClick={() => setSelectedModalItem(item)}
            title="Haz clic para ver detalles de este look"
          >
            <img src={item.url} alt={item.title} />
            <figcaption style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{item.title}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', opacity: 0.85 }}>
                <Eye size={14} /> Ver detalles
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Sección interactiva Antes y Después en la Galería */}
      <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid rgba(166, 95, 69, 0.2)' }}>
        <SectionHeading
          eyebrow="Casos Reales"
          title="Antes y Después Interactivo"
          description="Desliza el divisor central para observar el cambio en hidratación, encogimiento y definición."
          align="center"
        />

        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {transformations.map((item) => (
            <div key={item.id} className="card" style={{ padding: '1.25rem' }}>
              <BeforeAfterSlider
                beforeImage={item.before_image}
                afterImage={item.after_image}
                title={item.title}
              />
              <div style={{ marginTop: '1rem' }}>
                <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '1.2rem', color: '#2A1D17' }}>{item.title}</h4>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: '#665' }}>{item.description}</p>
                <span style={{ fontWeight: 700, color: '#A65F45', fontSize: '0.84rem' }}>{item.service}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Lightbox */}
      <GalleryModal item={selectedModalItem} onClose={() => setSelectedModalItem(null)} />
    </div>
  )
}
