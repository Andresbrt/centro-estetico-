import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, MapPin, MessageCircle, Clock3 } from 'lucide-react'
import { siteSettings } from '../data/mockData'

export default function Footer() {
  return (
    <footer className="footer-shell">
      <div className="container footer-grid">
        <div>
          <div className="brand-block">
            <img src={siteSettings.logo} alt={siteSettings.name} className="brand-logo" />
            <div>
              <strong>{siteSettings.name}</strong>
              <span>{siteSettings.tagline}</span>
            </div>
          </div>
          <p>{siteSettings.description}</p>
        </div>

        <div>
          <h4>Explorar</h4>
          <ul className="footer-list">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/services">Servicios</Link></li>
            <li><Link to="/products">Productos</Link></li>
            <li><Link to="/gallery">Galería</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contacto</h4>
          <ul className="footer-list">
            <li><MapPin size={16} /> {siteSettings.address}</li>
            <li><Clock3 size={16} /> {siteSettings.hours}</li>
            <li><MessageCircle size={16} /> WhatsApp</li>
            <li>
              <Instagram size={16} />
              <a href={siteSettings.instagram_url} target="_blank" rel="noreferrer">{siteSettings.instagram}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 {siteSettings.name}</span>
        <span>Diseñado para belleza natural, inclusión y confianza.</span>
      </div>
    </footer>
  )
}
