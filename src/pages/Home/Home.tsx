import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, MapPin, MessageCircle, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeading from '../../components/SectionHeading'
import ServiceCard from '../../components/ServiceCard'
import ProductCard from '../../components/ProductCard'
import Button from '../../components/Button'
import BeforeAfterSlider from '../../components/BeforeAfterSlider'
import { fetchBrandSettings, fetchPublishedGallery, fetchPublishedServices } from '../../services/contentService'
import { galleryItems as fallbackGalleryItems, products, services as fallbackServices, siteSettings, testimonials, transformations } from '../../data/mockData'
import type { GalleryItem, Service, SiteSettings } from '../../types'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function Home() {
  const [isReady, setIsReady] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [services, setServices] = useState<Service[]>(fallbackServices)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(fallbackGalleryItems)
  const [settings, setSettings] = useState<SiteSettings>(siteSettings)

  // Formulario de contacto / información
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactMsg, setContactMsg] = useState('')
  const [contactSent, setContactSent] = useState(false)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactName.trim()) {
      alert('Por favor escribe tu nombre.')
      return
    }

    const text = `¡Hola ${siteSettings.name}! 🌿 Mi nombre es *${contactName.trim()}*${contactPhone ? ` (Tel: ${contactPhone})` : ''}.\n\nMe gustaría consultar sobre sus servicios en Cali:\n"${contactMsg.trim() || 'Quisiera recibir asesoría personalizada para mi tipo de cabello.'}"`
    const url = `https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    setContactSent(true)
  }

  const servicesToRender = services.length > 0 ? services : fallbackServices
  const galleryToRender = galleryItems.length > 0 ? galleryItems : fallbackGalleryItems

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 180)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 18
      const y = (event.clientY / window.innerHeight - 0.5) * 18
      setMousePosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      const [serviceData, galleryData, brandSettings] = await Promise.all([
        fetchPublishedServices(),
        fetchPublishedGallery(),
        fetchBrandSettings(),
      ])

      setServices(serviceData)
      setGalleryItems(galleryData)
      setSettings(brandSettings)
    }

    void loadData()
  }, [])

  return (
    <div className="page-shell">
      <section className="hero-section">
        <div className="container hero-grid">
          <motion.div initial="hidden" animate={isReady ? 'visible' : 'hidden'} variants={fadeUp} transition={{ duration: 0.6 }} className="hero-copy">
            <span className="eyebrow">Belleza natural • Inclusión • Confianza</span>
            <h1>Celebramos la belleza natural de tu cabello</h1>
            <p>
              Especialistas en cabello afro, rizado, ondulado y procesos de transición, ubicados en Cali, Colombia. Creamos experiencias que celebran tu identidad y fortalecen tu confianza.
            </p>
            <div className="hero-pills" style={{ marginTop: '1rem' }}>
              <span><CheckCircle size={16} /> Corte de forma</span>
              <span><CheckCircle size={16} /> Hidratación profunda</span>
              <span><CheckCircle size={16} /> Definición</span>
              <span><CheckCircle size={16} /> Transición capilar</span>
            </div>
            <div className="hero-actions">
              <Button to="/booking">Agendar cita</Button>
              <Button to="/services" variant="secondary">Conocer nuestros servicios</Button>
            </div>
            <div className="hero-pills">
              <span><CheckCircle size={16} /> Atensión personalizada</span>
              <span><CheckCircle size={16} /> Productos para tu tipo de cabello</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={isReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }} transition={{ duration: 0.7 }} className="hero-visual">
            <div
              className="hero-image-card"
              style={{
                transform: `perspective(1400px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg) translate3d(0, 0, 0)`,
              }}
            >
              <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80" alt="Cliente con cabello afro" />
            </div>
          </motion.div>
        </div>
      </section>

      <main>
        <section className="section-space identity-section">
          <div className="container">
            <div className="identity-grid">
              <article className="card identity-card">
                <span className="eyebrow">Nuestra esencia</span>
                <h3>Identidad, salud y autoestima</h3>
                <p>Trabajamos cada textura con respeto, técnica y una visión que celebra la belleza natural de cada mujer afro.</p>
              </article>
              <article className="card identity-card">
                <span className="eyebrow">Especialización</span>
                <h3>Cabello afro y transición</h3>
                <p>Diagnóstico real, cuidado consciente y protocolo pensado para fortalecer la fibra sin comprometer la textura.</p>
              </article>
              <article className="card identity-card">
                <span className="eyebrow">Ubicación</span>
                <h3>En Cali, con atención cercana</h3>
                <p>Un espacio pensado para sentirte acompañada, segura y cuidada desde la primera visita hasta la transformación.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="container">
            <SectionHeading eyebrow="Servicios" title="Cuidado pensado para cada textura" description="Cada servicio está diseñado para acompañar el cabello afro, rizado, ondulado y en procesos de transición con una experiencia consciente y personalizada." align="center" />
            <div className="card-grid services-grid">
              {servicesToRender.slice(0, 6).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-space alt-section">
          <div className="container about-grid">
            <div className="about-image-wrap">
              <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80" alt="Cuidado capilar afro" />
            </div>
            <div className="about-copy">
              <SectionHeading eyebrow="Nosotros" title="Una experiencia que celebra tu identidad" description="En Centro de Experiencia Afro Maira Vásquez combinamos técnica, sensibilidad y cuidado para ayudarte a vivir tu cabello con libertad, salud y confianza." />
              <ul className="feature-list">
                <li>Especialistas en cabellos afro, rizado y ondulado.</li>
                <li>Proceso de transición capilar guiado con acompañamiento real.</li>
                <li>Colorimetría, hidratación, nutrición y definición con enfoque premium.</li>
              </ul>
              <Link to="/about" className="btn btn-secondary">Conoce más</Link>
            </div>
          </div>
        </section>

        {/* Banner destacado: Diagnóstico / Quiz Capilar */}
        <section className="section-space" style={{ background: 'var(--gradient-gold-soft)', borderTop: '1px solid rgba(215, 183, 106, 0.3)', borderBottom: '1px solid rgba(215, 183, 106, 0.3)' }}>
          <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <span className="eyebrow" style={{ color: '#A65F45', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={14} /> Diagnóstico Online Gratuito
              </span>
              <h2 style={{ fontSize: '2.4rem', margin: '0.5rem 0 1rem 0' }}>¿No sabes qué necesita tu cabello hoy?</h2>
              <p style={{ fontSize: '1.05rem', color: '#4A3025', lineHeight: 1.6, margin: 0 }}>
                Cada melena tiene su propio lenguaje. Responde nuestro cuestionario de 4 preguntas para descubrir tu textura exacta, nivel de porosidad y recibir tu rutina de productos y servicio recomendado por nuestras especialistas en Cali.
              </p>
            </div>
            <div style={{ textAlign: 'center', background: '#FFF9F3', padding: '2.25rem', borderRadius: 24, boxShadow: '0 20px 40px rgba(74, 48, 37, 0.08)', border: '1px solid rgba(215, 183, 106, 0.4)' }}>
              <div style={{ display: 'inline-flex', padding: '0.8rem', background: 'rgba(215, 183, 106, 0.2)', borderRadius: '50%', marginBottom: '1rem' }}>
                <Sparkles size={32} color="#A65F45" />
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', color: '#2A1D17' }}>Test Capilar Personalizado</h3>
              <p style={{ fontSize: '0.9rem', color: '#665', marginBottom: '1.5rem' }}>Toma menos de 2 minutos y obtendrás tu recomendación inmediata.</p>
              <Link to="/quiz" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
                Comenzar Diagnóstico Gratis ✨
              </Link>
            </div>
          </div>
        </section>

        {/* Transformaciones Interactivas Antes y Después */}
        <section className="section-space">
          <div className="container">
            <SectionHeading eyebrow="Transformaciones" title="Antes y después, cuidado con resultado real" description="Desliza para ver la transformación real: brillo, definición, salud y volumen logrados en nuestro centro en Cali." align="center" />
            <div className="card-grid transformations-grid">
              {transformations.map((item) => (
                <article key={item.id} className="card transformation-card" style={{ padding: '1rem' }}>
                  <BeforeAfterSlider
                    beforeImage={item.before_image}
                    afterImage={item.after_image}
                    title={item.title}
                  />
                  <div className="transformation-body" style={{ marginTop: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.35rem 0' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#665', margin: '0 0 0.75rem 0' }}>{item.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: '#A65F45', fontSize: '0.85rem' }}>{item.service}</span>
                      <Link to="/booking" className="btn" style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', background: '#4A3025', color: '#FFF' }}>
                        Agendar similar
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space alt-section">
          <div className="container">
            <SectionHeading eyebrow="Productos" title="Cuidado que acompaña tu rutina" description="Productos pensados para fortalecer, hidratar y definir tu textura sin compromiso con tu naturalidad." align="center" />
            <div className="card-grid products-grid">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="container">
            <SectionHeading eyebrow="Galería" title="Momentos y resultados" description="Cada imagen cuenta una historia de cuidado, identidad y belleza natural." align="center" />
            <div className="gallery-grid">
              {galleryToRender.slice(0, 6).map((item) => (
                <figure key={item.id} className="gallery-item">
                  <img src={item.url} alt={item.title} />
                  <figcaption>{item.category}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space alt-section">
          <div className="container">
            <SectionHeading eyebrow="Testimonios" title="La confianza de quienes han vivido la experiencia" description="Cada visita refleja un proceso de cuidado, transformación y bienestar capilar." align="center" />
            <div className="card-grid testimonials-grid">
              {testimonials.map((item) => (
                <article key={item.id} className="card testimonial-card">
                  <img src={item.photo} alt={item.name} className="testimonial-photo" />
                  <h3>{item.name}</h3>
                  <div className="stars">{'★'.repeat(item.rating)}</div>
                  <p>“{item.comment}”</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-space">
          <div className="container">
            <SectionHeading eyebrow="Instagram" title="Síguenos en Instagram" description="Inspiración, rutinas y momentos de la comunidad que celebra su textura con amor y cuidado." align="center" />
            <div className="instagram-grid">
              {Array.from({ length: 6 }).map((_, index) => {
                const item = galleryToRender[index % galleryToRender.length] ?? galleryToRender[0]
                return (
                  <div key={index} className="instagram-card">
                    <img src={item?.url} alt="Instagram post" />
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section-space contact-section">
          <div className="container contact-grid">
            <div>
              <SectionHeading eyebrow="Contacto" title="Agenda tu cita o visita el espacio" description="Estamos listas para acompañarte en tu proceso de cuidado capilar y transformación." />
              <div className="contact-list">
                <div><MapPin size={18} /> {settings.address} · Cali, Colombia</div>
                <div>
                  <MessageCircle size={18} />
                  <a href={settings.instagram_url} target="_blank" rel="noreferrer">{settings.instagram}</a>
                </div>
                <div><MessageCircle size={18} /> WhatsApp: {settings.whatsapp}</div>
              </div>
            </div>
            <div className="card form-card">
              <h3>Solicita información</h3>
              {contactSent ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{ color: '#25D366', fontSize: '2rem', marginBottom: '0.5rem' }}>✓</div>
                  <p style={{ fontWeight: 600, color: '#2A1D17', margin: '0 0 0.5rem 0' }}>¡Mensaje listo para WhatsApp!</p>
                  <p style={{ fontSize: '0.85rem', color: '#665', marginBottom: '1rem' }}>Hemos preparado tu consulta para que nuestras asesoras en Cali te respondan de inmediato.</p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setContactSent(false)
                      setContactName('')
                      setContactMsg('')
                    }}
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <div className="field-grid" style={{ marginBottom: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Nombre *"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                    <input
                      type="email"
                      placeholder="Correo (opcional)"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono / WhatsApp"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                    <textarea
                      rows={4}
                      placeholder="¿Qué te gustaría consultar sobre tu cabello o una cita?"
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Enviar consulta por WhatsApp
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="section-space admin-access-shell">
          <div className="container">
            <div className="admin-access-card">
              <div>
                <span className="admin-access-label">Área privada</span>
                <p>Acceso restringido para administración del contenido y métricas del negocio.</p>
              </div>
              <Link to="/admin" className="btn btn-secondary admin-access-link">Panel administrativo</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
