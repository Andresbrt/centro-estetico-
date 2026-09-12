import React from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Calendar, Sparkles, MapPin } from 'lucide-react'
import type { GalleryItem } from '../types'

interface GalleryModalProps {
  item: GalleryItem | null
  onClose: () => void
}

export default function GalleryModal({ item, onClose }: GalleryModalProps) {
  const navigate = useNavigate()

  if (!item) return null

  // Metadata mock / dynamic based on title & category
  const hairTypeMap: Record<string, string> = {
    'Cabello afro': 'Textura Tipo 4A - 4C',
    'Cabello rizado': 'Patrón Rizado 3A - 3C',
    'Cabello ondulado': 'Ondas Tipo 2B - 2C',
    'Procesos': 'Transición Capilar (Corte de puntas + Nutrición)',
    'Resultados': 'Definición Natural con Control de Frizz',
    'Espacio': 'Sede Principal Cali · Cra 79B #10A-61',
  }

  const hairInfo = hairTypeMap[item.category || ''] || 'Cuidado Capilar Auténtico'

  const handleBookLook = () => {
    onClose()
    navigate('/booking')
  }

  return (
    <div className="gallery-modal-overlay" onClick={onClose}>
      <div className="gallery-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="gallery-modal-close"
          onClick={onClose}
          aria-label="Cerrar vista previa"
        >
          <X size={20} />
        </button>

        <img src={item.url} alt={item.title} className="gallery-modal-img" />

        <div className="gallery-modal-content">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(215, 183, 106, 0.2)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.78rem', color: '#4A3025', fontWeight: 700, marginBottom: '1rem' }}>
              <Sparkles size={14} color="#A65F45" />
              <span>{item.category || 'Transformación'}</span>
            </div>

            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.75rem', color: '#2A1D17' }}>
              {item.title}
            </h3>

            <div style={{ background: '#F5EEDF', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', display: 'grid', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#4A3025' }}>
                <strong style={{ minWidth: 90 }}>Textura:</strong>
                <span>{hairInfo}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#4A3025' }}>
                <strong style={{ minWidth: 90 }}>Técnica:</strong>
                <span>Corte técnico en seco + Tratamiento botánico</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#4A3025' }}>
                <strong style={{ minWidth: 90 }}>Ubicación:</strong>
                <span><MapPin size={13} style={{ display: 'inline', marginRight: 2 }} /> Cali, Colombia</span>
              </div>
            </div>

            <p style={{ color: '#554', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Cada diseño de corte y definición se personaliza según el patrón de encogimiento, la porosidad y la densidad natural de tu melena.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
              onClick={handleBookLook}
            >
              <Calendar size={18} /> Quiero este resultado (Agendar cita)
            </button>
            <button
              type="button"
              className="btn"
              style={{ width: '100%', justifyContent: 'center', background: 'transparent', border: '1px solid #c7a56a', color: '#4A3025' }}
              onClick={onClose}
            >
              Seguir explorando
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
