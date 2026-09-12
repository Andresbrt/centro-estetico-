import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Sparkles, MessageCircle, MapPin, Heart, ShieldCheck } from 'lucide-react'
import SectionHeading from '../../components/SectionHeading'
import { siteSettings } from '../../data/mockData'

export default function AboutPage() {
  return (
    <div className="container section-space page-inner">
      <SectionHeading
        eyebrow="Nuestra Historia y Filosofía"
        title="Belleza natural, cuidado profesional y transformación real"
        description="En Centro de Experiencia Afro Maira Vásquez creemos que cada textura merece ser cuidada con respeto, técnica botánica y atención personalizada en Cali, Colombia."
        align="center"
      />

      <div className="card-grid" style={{ marginBottom: '3.5rem' }}>
        <div className="card" style={{ padding: '2rem', background: '#FFF9F3', border: '1px solid rgba(215, 183, 106, 0.3)' }}>
          <div style={{ padding: '0.6rem', background: 'rgba(215, 183, 106, 0.25)', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#A65F45' }}>
            <Heart size={22} />
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2A1D17' }}>Inclusión y Amor Propio</h3>
          <p style={{ margin: 0, color: '#665', lineHeight: 1.5 }}>
            Celebramos la autenticidad de cada tipo de cabello, especialmente cabellos afro (tipo 4), rizados (tipo 3), ondulados (tipo 2) y procesos de transición capilar.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', background: '#FFF9F3', border: '1px solid rgba(215, 183, 106, 0.3)' }}>
          <div style={{ padding: '0.6rem', background: 'rgba(215, 183, 106, 0.25)', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#A65F45' }}>
            <Sparkles size={22} />
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2A1D17' }}>Técnica Especializada en Seco</h3>
          <p style={{ margin: 0, color: '#665', lineHeight: 1.5 }}>
            Diseñamos rutas de corte en seco y definición botánica respetando el encogimiento natural y la salud de la hebra a largo plazo.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', background: '#FFF9F3', border: '1px solid rgba(215, 183, 106, 0.3)' }}>
          <div style={{ padding: '0.6rem', background: 'rgba(215, 183, 106, 0.25)', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#A65F45' }}>
            <ShieldCheck size={22} />
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2A1D17' }}>Confianza y Acompañamiento</h3>
          <p style={{ margin: 0, color: '#665', lineHeight: 1.5 }}>
            Ofrecemos atención cercana, productos libres de sulfatos y parabenos, y una guía paso a paso para que repliques la definición en casa.
          </p>
        </div>
      </div>

      {/* Tarjeta de Acción */}
      <div style={{ background: 'var(--gradient-gold-soft)', border: '1px solid rgba(215, 183, 106, 0.4)', borderRadius: 28, padding: '3rem 2rem', textAlign: 'center', maxWidth: 840, margin: '0 auto' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A65F45' }}>
          Ven y vive la experiencia
        </span>
        <h2 style={{ fontSize: '2.4rem', margin: '0.5rem 0 1rem 0', color: '#2A1D17' }}>
          ¿Lista para transformar y amar tu textura natural?
        </h2>
        <p style={{ color: '#4A3025', maxWidth: 600, margin: '0 auto 2rem auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Estamos ubicados en Cra 79B #10A-61, Local 3, Cali. Agenda tu cita con nuestras especialistas o descubre tu rutina ideal en nuestro diagnóstico online.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/booking" className="btn btn-primary" style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}>
            <Calendar size={18} /> Agendar Cita en Cali
          </Link>
          <Link to="/quiz" className="btn btn-gold" style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}>
            <Sparkles size={18} /> Hacer Test Capilar
          </Link>
          <a
            href={`https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent('Hola! Quiero conocer más sobre el Centro de Experiencia Afro en Cali.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            style={{ padding: '0.9rem 1.5rem', fontSize: '1rem' }}
          >
            <MessageCircle size={18} /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
