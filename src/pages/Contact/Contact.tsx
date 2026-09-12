import React, { useState } from 'react'
import { MapPin, MessageCircle, Instagram } from 'lucide-react'
import SectionHeading from '../../components/SectionHeading'
import { siteSettings } from '../../data/mockData'

export default function ContactPage() {
  const [name, setName] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const userName = name.trim() || 'amiga'
    const whatsappText = `Hola, mi nombre es ${userName}. Estoy interesada en realizarme un cambio en mi vida y quiero iniciar con un servicio de belleza y cuidado capilar. Me gustaría recibir información y conocer más sobre cómo puedo empezar.`
    const url = `https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(whatsappText)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="container section-space page-inner">
      <SectionHeading
        eyebrow="Contacto"
        title="Estamos aquí para acompañarte"
        description="Reserva tu cita, consulta por servicios o visita el centro para una experiencia personalizada."
        align="center"
      />

      <div className="contact-grid contact-page-grid">
        <form className="card form-card" onSubmit={handleSubmit}>
          <div className="contact-intro">
            <span className="eyebrow">Consulta rápida</span>
            <h3>¿Cuál es tu nombre?</h3>
          </div>

          <div className="field-grid single-field-grid">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Escribe tu nombre"
              required
            />
          </div>

          <div className="contact-cta-block">
            <button type="submit" className="btn btn-primary contact-whatsapp-btn">
              <MessageCircle size={18} />
              Contactar por WhatsApp
            </button>
            <small>Respuesta rápida y atención personalizada.</small>
          </div>
        </form>

        <div className="contact-panel">
          <div className="contact-info-stack">
            <div className="card info-card">
              <MapPin size={18} />
              <div>
                <strong>Dirección</strong>
                <p>{siteSettings.address}</p>
              </div>
            </div>
            <div className="card info-card">
              <MessageCircle size={18} />
              <div>
                <strong>WhatsApp</strong>
                <p>{siteSettings.whatsapp}</p>
              </div>
            </div>
            <div className="card info-card">
              <Instagram size={18} />
              <div>
                <strong>Instagram</strong>
                <p>
                  <a href={siteSettings.instagram_url} target="_blank" rel="noreferrer">{siteSettings.instagram}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-map-showcase">
        <div className="map-showcase-main">
          <div className="map-showcase-header">Ubicación</div>
          <h3>Estamos ubicados en Cali para cuidarte con estilo y confianza.</h3>
          <p>
            Visítanos en el centro de la ciudad y descubre una experiencia de belleza pensada para tu textura, tu estilo y tu bienestar.
          </p>

          <div className="map-showcase-frame">
            <iframe
              title="Ubicación de Centro de Experiencia Afro Maira Vásquez"
              src="https://www.google.com/maps?q=Cra%2079B%20%2310A-61%2C%20Local%203%2C%20Cali%2C%20Colombia&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a href="https://maps.app.goo.gl/EerYKdgJQrAQ9xz18" target="_blank" rel="noreferrer">
              Ver ubicación
            </a>
          </div>
        </div>

        <div className="map-showcase-side">
          <div className="mini-feature-card">
            <div className="mini-feature-icon">◌</div>
            <div>
              <h4>Ubicación</h4>
              <p>Cra 79B #10A-61, Local 3, Cali, Colombia.</p>
            </div>
          </div>

          <div className="mini-feature-card">
            <div className="mini-feature-icon">↻</div>
            <div>
              <h4>Atención</h4>
              <p>Servicio personalizado para cabello afro, rizado y ondulado.</p>
            </div>
          </div>

          <div className="mini-feature-card">
            <div className="mini-feature-icon">✦</div>
            <div>
              <h4>Experiencia</h4>
              <p>Estilo premium, cuidado real y acompañamiento para cada tipo de textura.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
