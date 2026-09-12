import React, { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { siteSettings } from '../data/mockData'

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(true)

  const defaultMessage = encodeURIComponent(
    '¡Hola Centro de Experiencia Afro Maira Vásquez! Me gustaría recibir asesoría sobre el cuidado de mi cabello y agendar una cita en Cali.'
  )
  const whatsappUrl = `https://wa.me/${siteSettings.whatsapp}?text=${defaultMessage}`

  return (
    <div className="floating-whatsapp-wrap" aria-label="Contacto por WhatsApp">
      {showTooltip && (
        <div className="whatsapp-tooltip" onClick={() => window.open(whatsappUrl, '_blank')}>
          <span>✨ ¿Dudas con tu rizo o transición? <strong>Escríbenos</strong></span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setShowTooltip(false)
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#888',
              marginLeft: '0.5rem',
              padding: '0 2px',
              fontSize: '12px'
            }}
            aria-label="Cerrar sugerencia"
          >
            ✕
          </button>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn"
        aria-label="Chatear por WhatsApp"
      >
        <span className="whatsapp-pulse" />
        <MessageCircle size={30} />
      </a>
    </div>
  )
}
