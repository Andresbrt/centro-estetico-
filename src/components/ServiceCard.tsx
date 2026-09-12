import React from 'react'
import { ArrowRight, Clock3, Sparkles } from 'lucide-react'
import type { Service } from '../types'
import Button from './Button'

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="card service-card">
      <div className="service-card-image-wrap">
        <img src={service.image_url} alt={service.name} className="service-card-image" />
      </div>
      <div className="service-card-body">
        <div className="service-meta">
          <span className="chip">
            <Sparkles size={12} />
            {service.name}
          </span>
        </div>
        <h3>{service.name}</h3>
        <p>{service.short_description}</p>
        <div className="service-card-row">
          <span><Clock3 size={14} /> {service.duration} min</span>
          <strong>${service.price.toLocaleString('es-CO')}</strong>
        </div>
        <Button to={`/booking?service=${service.id}`} variant="primary" className="full-width" style={{ justifyContent: 'center' }}>
          Agendar cita <ArrowRight size={16} />
        </Button>
        <div style={{ textAlign: 'center', marginTop: '0.6rem' }}>
          <a
            href={`https://wa.me/573001234567?text=${encodeURIComponent(`¡Hola Centro Afro! Quisiera consultar detalles del servicio de ${service.name} en Cali.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.8rem', color: '#8c4e36', fontWeight: 600, textDecoration: 'none' }}
          >
            💬 Consultar por WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}
