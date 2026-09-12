import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Calendar, Clock, User, Phone, MessageCircle, Sparkles, CheckCircle2, MapPin, Check } from 'lucide-react'
import SectionHeading from '../../components/SectionHeading'
import { services, siteSettings } from '../../data/mockData'

const SPECIALISTS = [
  {
    id: 'maira',
    name: 'Maira Vásquez',
    role: 'Directora & Master Rulos',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'camila',
    name: 'Camila Ortiz',
    role: 'Especialista en Rizos 3B-4A',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'sofia',
    name: 'Sofía Caicedo',
    role: 'Experta en Transición & Gran Corte',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'cualquiera',
    name: 'Cualquier especialista',
    role: 'Asignación rápida según disponibilidad',
    avatar: '',
  },
]

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
  '06:15 PM',
]

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const serviceParam = searchParams.get('service')

  const [selectedServiceId, setSelectedServiceId] = useState(() => {
    if (serviceParam && services.some((s) => s.id === serviceParam)) {
      return serviceParam
    }
    return services[0]?.id ?? ''
  })

  useEffect(() => {
    if (serviceParam && services.some((s) => s.id === serviceParam)) {
      setSelectedServiceId(serviceParam)
    }
  }, [serviceParam])

  const [selectedSpecialist, setSelectedSpecialist] = useState(SPECIALISTS[0].id)
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerNotes, setCustomerNotes] = useState('')
  const [isBooked, setIsBooked] = useState(false)

  const selectedService = services.find((service) => service.id === selectedServiceId) ?? services[0]
  const specialistObj = SPECIALISTS.find((s) => s.id === selectedSpecialist) ?? SPECIALISTS[0]

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor ingresa tu nombre y número de teléfono/WhatsApp para coordinar tu cita.')
      return
    }

    // Guardar en localStorage
    try {
      const newBooking = {
        id: `BK-${Date.now()}`,
        serviceName: selectedService.name,
        price: selectedService.price,
        specialist: specialistObj.name,
        date: selectedDate,
        time: selectedSlot,
        customerName,
        customerPhone,
        status: 'Pendiente de confirmación',
        createdAt: new Date().toISOString(),
      }
      const existing = JSON.parse(localStorage.getItem('amv-bookings') || '[]')
      localStorage.setItem('amv-bookings', JSON.stringify([newBooking, ...existing]))
    } catch (err) {
      console.warn('Error saving booking', err)
    }

    setIsBooked(true)

    // Formatear mensaje para WhatsApp
    const message =
      `¡Hola ${siteSettings.name}! 🌿 Quiero agendar una cita:\n\n` +
      `👤 *Cliente:* ${customerName}\n` +
      `📞 *Teléfono:* ${customerPhone}\n` +
      `💇‍♀️ *Servicio:* ${selectedService.name} ($${selectedService.price.toLocaleString('es-CO')})\n` +
      `⏱️ *Duración:* ${selectedService.duration} min\n` +
      `👩‍🎨 *Especialista:* ${specialistObj.name}\n` +
      `📅 *Fecha:* ${selectedDate}\n` +
      `⏰ *Hora:* ${selectedSlot}\n` +
      (customerNotes ? `📝 *Nota o textura:* ${customerNotes}\n\n` : '\n') +
      `📍 *Sede:* Cra 79B #10A-61, Local 3, Cali\n\n` +
      `¿Tienen disponibilidad en este horario para confirmar mi cupo?`

    const whatsappUrl = `https://wa.me/${siteSettings.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="container section-space page-inner booking-page">
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#A65F45', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
          <Sparkles size={14} /> Agenda en Línea · Sede Cali
        </span>
        <h1 style={{ margin: '0 0 0.75rem 0', fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#2A1D17' }}>
          Reserva tu experiencia capilar
        </h1>
        <p style={{ maxWidth: 680, margin: '0 auto', color: '#554', fontSize: '1.05rem', lineHeight: 1.5 }}>
          Cra 79B #10A-61, Local 3 · Atención especializada para cabellos afro, rizados y procesos de transición en Cali.
        </p>
      </div>

      {isBooked ? (
        <div className="card" style={{ maxWidth: 640, margin: '0 auto', padding: '2.5rem', textAlign: 'center', background: '#FFF9F3', border: '1px solid rgba(215, 183, 106, 0.4)' }}>
          <div style={{ width: 68, height: 68, background: 'rgba(37, 211, 102, 0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <CheckCircle2 size={40} color="#25D366" />
          </div>
          <span style={{ fontSize: '0.82rem', color: '#A65F45', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ¡Solicitud de cita preparada!
          </span>
          <h2 style={{ fontSize: '2rem', margin: '0.4rem 0 1rem 0', color: '#2A1D17' }}>
            Te esperamos en Cali
          </h2>
          <p style={{ color: '#554', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Hemos abierto <strong>WhatsApp</strong> con los datos de tu reserva para que nuestra recepcionista te confirme el cupo de inmediato.
          </p>

          <div style={{ background: '#F5EEDF', padding: '1.5rem', borderRadius: 16, textAlign: 'left', marginBottom: '2rem', display: 'grid', gap: '0.6rem', fontSize: '0.92rem', color: '#2A1D17' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(74, 48, 37, 0.1)', paddingBottom: '0.4rem' }}>
              <strong>Servicio:</strong>
              <span>{selectedService.name} (${selectedService.price.toLocaleString('es-CO')})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(74, 48, 37, 0.1)', paddingBottom: '0.4rem' }}>
              <strong>Especialista:</strong>
              <span>{specialistObj.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(74, 48, 37, 0.1)', paddingBottom: '0.4rem' }}>
              <strong>Fecha y hora:</strong>
              <span>{selectedDate} a las {selectedSlot}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(74, 48, 37, 0.1)', paddingBottom: '0.4rem' }}>
              <strong>Cliente:</strong>
              <span>{customerName} ({customerPhone})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.2rem' }}>
              <strong>Dirección:</strong>
              <span>Cra 79B #10A-61, Local 3 · Cali</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-whatsapp"
              style={{ padding: '0.9rem 1.6rem', fontSize: '1rem' }}
              onClick={() => handleConfirmBooking({ preventDefault: () => {} } as any)}
            >
              <MessageCircle size={18} /> Reabrir WhatsApp
            </button>
            <button
              type="button"
              className="btn"
              style={{ background: 'transparent', border: '1px solid #c7a56a', color: '#4A3025' }}
              onClick={() => setIsBooked(false)}
            >
              Agendar otra cita
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleConfirmBooking} className="booking-grid">
          {/* Columna Izquierda: Pasos de Selección */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* 1. Selección de Servicio */}
            <div className="card" style={{ padding: '2rem', background: '#FFF9F3', border: '1px solid rgba(215, 183, 106, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#2A1D17', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-gold)', color: '#171310', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', fontWeight: 800 }}>1</span>
                  Elige tu Servicio
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>{services.length} disponibles</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {services.map((svc) => {
                  const isSelected = selectedServiceId === svc.id
                  return (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedServiceId(svc.id)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '64px 1fr auto',
                        gap: '1.1rem',
                        alignItems: 'center',
                        padding: '1rem',
                        borderRadius: 16,
                        border: isSelected ? '2px solid #C7A56A' : '1px solid rgba(74, 48, 37, 0.12)',
                        background: isSelected ? '#FFFDF9' : '#ffffff',
                        boxShadow: isSelected ? '0 8px 24px rgba(199, 165, 106, 0.18)' : '0 2px 8px rgba(0,0,0,0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
                      }}
                    >
                      {/* Imagen miniatura */}
                      <img
                        src={svc.image_url}
                        alt={svc.name}
                        style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }}
                      />

                      {/* Información central */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '1.02rem', color: '#2A1D17' }}>{svc.name}</strong>
                          <span style={{ fontSize: '0.74rem', background: 'rgba(215, 183, 106, 0.2)', color: '#4A3025', padding: '0.15rem 0.55rem', borderRadius: 999, fontWeight: 700 }}>
                            {svc.duration} min
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#665', lineHeight: 1.4 }}>
                          {svc.short_description}
                        </p>
                      </div>

                      {/* Precio y estado */}
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                        <span style={{ fontSize: '1.08rem', fontWeight: 800, color: '#A65F45' }}>
                          ${svc.price.toLocaleString('es-CO')}
                        </span>
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            border: isSelected ? '2px solid #C7A56A' : '2px solid #ccc',
                            background: isSelected ? 'var(--gradient-gold)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#171310',
                          }}
                        >
                          {isSelected && <Check size={13} strokeWidth={3} />}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 2. Selección de Estilista */}
            <div className="card" style={{ padding: '2rem', background: '#FFF9F3', border: '1px solid rgba(215, 183, 106, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#2A1D17', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-gold)', color: '#171310', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', fontWeight: 800 }}>2</span>
                  Selecciona tu Estilista
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                {SPECIALISTS.map((spec) => {
                  const isSelected = selectedSpecialist === spec.id
                  return (
                    <div
                      key={spec.id}
                      onClick={() => setSelectedSpecialist(spec.id)}
                      style={{
                        padding: '1rem',
                        borderRadius: 16,
                        border: isSelected ? '2px solid #C7A56A' : '1px solid rgba(74, 48, 37, 0.12)',
                        background: isSelected ? '#FFFDF9' : '#ffffff',
                        boxShadow: isSelected ? '0 8px 20px rgba(199, 165, 106, 0.18)' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        transition: 'all 0.2s',
                      }}
                    >
                      {spec.avatar ? (
                        <img
                          src={spec.avatar}
                          alt={spec.name}
                          style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: isSelected ? '2px solid #C7A56A' : '1px solid #ddd' }}
                        />
                      ) : (
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(215, 183, 106, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A65F45' }}>
                          <Sparkles size={20} />
                        </div>
                      )}

                      <div style={{ flex: 1 }}>
                        <strong style={{ display: 'block', fontSize: '0.92rem', color: '#2A1D17' }}>
                          {spec.name}
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: '#665', display: 'block', lineHeight: 1.3 }}>
                          {spec.role}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 3. Fecha y Horario */}
            <div className="card" style={{ padding: '2rem', background: '#FFF9F3', border: '1px solid rgba(215, 183, 106, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#2A1D17', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-gold)', color: '#171310', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', fontWeight: 800 }}>3</span>
                  Fecha y Horario
                </h3>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.88rem', color: '#4A3025' }}>
                  Elige el día de tu cita:
                </label>
                <div style={{ position: 'relative', maxWidth: 320 }}>
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: 12,
                      border: '1px solid rgba(74, 48, 37, 0.2)',
                      background: '#ffffff',
                      fontSize: '0.95rem',
                      color: '#2A1D17',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 700, fontSize: '0.88rem', color: '#4A3025' }}>
                  Franjas horarias disponibles:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.6rem' }}>
                  {TIME_SLOTS.map((slot) => {
                    const isSlotSelected = selectedSlot === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          padding: '0.75rem 0.5rem',
                          borderRadius: 12,
                          border: isSlotSelected ? '2px solid #C7A56A' : '1px solid rgba(74, 48, 37, 0.15)',
                          background: isSlotSelected ? 'var(--gradient-primary)' : '#ffffff',
                          color: isSlotSelected ? '#FFF9F3' : '#2A1D17',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          boxShadow: isSlotSelected ? '0 6px 16px rgba(74, 48, 37, 0.2)' : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Datos y Resumen (Sticky) */}
          <div>
            <div className="card" style={{ padding: '2rem', background: '#FFF9F3', border: '1px solid rgba(215, 183, 106, 0.35)', position: 'sticky', top: '110px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-gold)', color: '#171310', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem', fontWeight: 800 }}>4</span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#2A1D17' }}>Tus Datos de Contacto</h3>
              </div>

              <div style={{ display: 'grid', gap: '0.9rem', marginBottom: '1.5rem' }}>
                <div>
                  <label htmlFor="customer-name" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.84rem', color: '#4A3025' }}>
                    Nombre completo *
                  </label>
                  <input
                    id="customer-name"
                    type="text"
                    required
                    placeholder="Ej. Valeria Pérez"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1px solid rgba(74, 48, 37, 0.2)', background: '#fff' }}
                  />
                </div>

                <div>
                  <label htmlFor="customer-phone" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.84rem', color: '#4A3025' }}>
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    placeholder="Ej. 315 123 4567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1px solid rgba(74, 48, 37, 0.2)', background: '#fff' }}
                  />
                </div>

                <div>
                  <label htmlFor="customer-notes" style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.84rem', color: '#4A3025' }}>
                    Notas o textura (opcional)
                  </label>
                  <input
                    id="customer-notes"
                    type="text"
                    placeholder="Ej. En transición, cabello teñido..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 10, border: '1px solid rgba(74, 48, 37, 0.2)', background: '#fff' }}
                  />
                </div>
              </div>

              {/* Resumen Detallado */}
              <div style={{ background: '#F5EEDF', padding: '1.25rem', borderRadius: 16, marginBottom: '1.5rem', border: '1px solid rgba(215, 183, 106, 0.25)' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, color: '#A65F45', display: 'block', marginBottom: '0.6rem' }}>
                  Resumen de tu Cita
                </span>

                <div style={{ display: 'grid', gap: '0.45rem', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#665' }}>Servicio:</span>
                    <strong style={{ color: '#2A1D17' }}>{selectedService.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#665' }}>Estilista:</span>
                    <span style={{ fontWeight: 600 }}>{specialistObj.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#665' }}>Fecha:</span>
                    <span>{selectedDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#665' }}>Horario:</span>
                    <span>{selectedSlot}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#665' }}>Duración:</span>
                    <span>{selectedService.duration} minutos</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(74, 48, 37, 0.15)', paddingTop: '0.6rem', marginTop: '0.4rem', fontSize: '1.15rem' }}>
                    <strong>Total a pagar:</strong>
                    <strong style={{ color: '#A65F45' }}>${selectedService.price.toLocaleString('es-CO')}</strong>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-whatsapp"
                style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.02rem' }}
              >
                <MessageCircle size={20} /> Confirmar y Enviar por WhatsApp
              </button>

              <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#665', lineHeight: 1.4 }}>
                <MapPin size={13} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
                Cra 79B #10A-61, Local 3 · Cali<br />
                <span style={{ opacity: 0.85 }}>Pago directo en el salón (efectivo, Nequi o datáfono).</span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
