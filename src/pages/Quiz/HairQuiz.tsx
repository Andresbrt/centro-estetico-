import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Calendar, ShoppingBag, RotateCcw } from 'lucide-react'
import SectionHeading from '../../components/SectionHeading'
import { useCart } from '../../context/CartContext'
import { products, services } from '../../data/mockData'
import type { Product, Service } from '../../types'

interface QuizAnswers {
  pattern: string
  condition: string
  goal: string
  frequency: string
}

export default function HairQuiz() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<QuizAnswers>({
    pattern: '',
    condition: '',
    goal: '',
    frequency: '',
  })
  const [isFinished, setIsFinished] = useState(false)
  const { addItem, openDrawer } = useCart()
  const navigate = useNavigate()

  const handleSelectOption = (key: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1)
    }
  }

  const handleRestart = () => {
    setStep(1)
    setAnswers({ pattern: '', condition: '', goal: '', frequency: '' })
    setIsFinished(false)
  }

  // Calculate recommendation
  const getRecommendation = () => {
    let recommendedService: Service = services[1] // Definicion
    let recommendedProducts: Product[] = [products[0], products[1]]
    let diagnosisText = 'Rizos y ondas con necesidad de equilibrio y definición natural.'

    if (answers.pattern === 'afro' || answers.goal === 'corte') {
      recommendedService = services[0] // Corte de forma
      recommendedProducts = [products[2], products[3]] // Kit hidratacion + serum
      diagnosisText = 'Melena Afro / Textura 4 con alta densidad. Recomendamos corte de forma en seco para realzar volumen y nutrición concentrada.'
    } else if (answers.pattern === 'transicion' || answers.goal === 'transicion') {
      recommendedService = services[3] // Transicion capilar
      recommendedProducts = [products[0], products[2]]
      diagnosisText = 'Proceso de Transición Capilar. Acompañamiento prioritario para unificar texturas, cortar puntas procesadas y sanar el folículo.'
    } else if (answers.condition === 'seco' || answers.goal === 'hidratacion') {
      recommendedService = services[2] // Hidratacion profunda
      recommendedProducts = [products[1], products[2], products[3]]
      diagnosisText = 'Porosidad alta o sequedad capilar. Necesitas un shot intensivo de agua, lípidos botánicos y sellado de cutícula.'
    }

    return { recommendedService, recommendedProducts, diagnosisText }
  }

  const { recommendedService, recommendedProducts, diagnosisText } = getRecommendation()

  const handleAddRoutineToCart = () => {
    recommendedProducts.forEach((p) => addItem(p))
    openDrawer()
  }

  return (
    <div className="container section-space page-inner">
      <div className="quiz-page-wrap">
        <SectionHeading
          eyebrow="Diagnóstico Capilar Online"
          title="Descubre la rutina y servicio ideal para tu melena"
          description="Responde 4 preguntas sencillas y recibe una recomendación técnica personalizada creada por nuestras especialistas en Cali."
          align="center"
        />

        <div className="quiz-card">
          {!isFinished ? (
            <>
              {/* Indicador de pasos */}
              <div className="quiz-step-indicator">
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#A65F45' }}>
                  Paso {step} de 4
                </span>
                <div className="quiz-step-dots">
                  {[1, 2, 3, 4].map((i) => (
                    <span key={i} className={`quiz-step-dot ${step === i ? 'active' : ''}`} />
                  ))}
                </div>
              </div>

              {/* Paso 1: Patrón */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 style={{ fontSize: '1.4rem', color: '#2A1D17', marginBottom: '0.5rem' }}>
                    1. ¿Cuál es tu textura o patrón predominante?
                  </h3>
                  <p style={{ color: '#665', fontSize: '0.9rem' }}>Selecciona la opción que mejor describe tu cabello al natural:</p>
                  <div className="quiz-options-grid">
                    {[
                      { id: 'ondulado', title: 'Ondulado (Tipo 2A - 2C)', desc: 'Ondas en S con tendencia al frizz y pérdida de forma rápida.' },
                      { id: 'rizado', title: 'Rizado (Tipo 3A - 3C)', desc: 'Bucles definidos y resortes elásticos que requieren hidratación.' },
                      { id: 'afro', title: 'Afro / Crespo (Tipo 4A - 4C)', desc: 'Zic-zac compacto, textura esponjosa y encogimiento del 50% al 80%.' },
                      { id: 'transicion', title: 'En Transición Capilar', desc: 'Raíz natural creciendo con puntas lisas o alisadas químicamente.' },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        className={`quiz-option-card ${answers.pattern === opt.id ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('pattern', opt.id)}
                      >
                        <span className="quiz-option-title">{opt.title}</span>
                        <p className="quiz-option-desc">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Paso 2: Estado */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 style={{ fontSize: '1.4rem', color: '#2A1D17', marginBottom: '0.5rem' }}>
                    2. ¿Cómo sientes tu cabello actualmente?
                  </h3>
                  <p style={{ color: '#665', fontSize: '0.9rem' }}>Esto nos ayuda a determinar el nivel de porosidad y tratamiento:</p>
                  <div className="quiz-options-grid">
                    {[
                      { id: 'seco', title: 'Muy seco y opaco', desc: 'Absorbe crema rápido pero a las pocas horas se siente áspero.' },
                      { id: 'normal', title: 'Saludable con frizz ocasional', desc: 'Buen brillo general pero le falta definición duradera.' },
                      { id: 'quimico', title: 'Dañado por tinte o calor', desc: 'Puntas abiertas, debilidad y pérdida de patrón por plancha.' },
                      { id: 'quebradizo', title: 'Se quiebra con facilidad', desc: 'Mucha caída durante el desenredo y falta de elasticidad.' },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        className={`quiz-option-card ${answers.condition === opt.id ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('condition', opt.id)}
                      >
                        <span className="quiz-option-title">{opt.title}</span>
                        <p className="quiz-option-desc">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Paso 3: Objetivo */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 style={{ fontSize: '1.4rem', color: '#2A1D17', marginBottom: '0.5rem' }}>
                    3. ¿Cuál es tu prioridad número uno hoy?
                  </h3>
                  <p style={{ color: '#665', fontSize: '0.9rem' }}>¿Qué resultado sueñas ver al mirarte al espejo?:</p>
                  <div className="quiz-options-grid">
                    {[
                      { id: 'definicion', title: 'Definición que dure días', desc: 'Rizos marcados, suaves y sin sensación pegajosa o dura.' },
                      { id: 'corte', title: 'Darle forma y volumen con corte', desc: 'Eliminar el triángulo y diseñar un corte especializado en seco.' },
                      { id: 'hidratacion', title: 'Restauración y nutrición profunda', desc: 'Devolverle vitalidad, elasticidad y vida a la fibra capilar.' },
                      { id: 'transicion', title: 'Acompañamiento en mi gran corte', desc: 'Aprender a amar y cuidar mi textura natural sin miedo.' },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        className={`quiz-option-card ${answers.goal === opt.id ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('goal', opt.id)}
                      >
                        <span className="quiz-option-title">{opt.title}</span>
                        <p className="quiz-option-desc">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Paso 4: Frecuencia */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 style={{ fontSize: '1.4rem', color: '#2A1D17', marginBottom: '0.5rem' }}>
                    4. ¿Con qué frecuencia realizas tu rutina de lavado?
                  </h3>
                  <p style={{ color: '#665', fontSize: '0.9rem' }}>Para recomendarte los pasos exactos de mantenimiento en casa:</p>
                  <div className="quiz-options-grid">
                    {[
                      { id: 'semanal', title: '1 vez por semana', desc: 'Lavado completo de fin de semana con mascarilla.' },
                      { id: 'dosveces', title: '2 a 3 veces por semana', desc: 'Hago ejercicio o mi cuero cabelludo se engrasa rápido.' },
                      { id: 'quincenal', title: 'Cada 10 a 15 días', desc: 'Rutinas protectoras con trenzas o estilos protectores.' },
                      { id: 'sinsaber', title: 'No tengo una rutina clara', desc: 'Lavo cuando siento acumulación y necesito una guía paso a paso.' },
                    ].map((opt) => (
                      <div
                        key={opt.id}
                        className={`quiz-option-card ${answers.frequency === opt.id ? 'selected' : ''}`}
                        onClick={() => handleSelectOption('frequency', opt.id)}
                      >
                        <span className="quiz-option-title">{opt.title}</span>
                        <p className="quiz-option-desc">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Botones de navegación */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button
                  type="button"
                  className="btn"
                  style={{ background: 'transparent', border: '1px solid #c7a56a', color: '#4A3025' }}
                  onClick={handlePrev}
                  disabled={step === 1}
                >
                  <ArrowLeft size={16} /> Anterior
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                >
                  {step === 4 ? 'Ver Mi Diagnóstico' : 'Siguiente'} <ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : (
            /* Pantalla de Resultados */
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="quiz-result-header">
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A65F45', fontWeight: 800 }}>
                  Diagnóstico Personalizado
                </span>
                <h3 className="quiz-result-title">Tu Perfil Capilar</h3>
                <p style={{ margin: 0, color: '#3E2A20', fontSize: '1.05rem', lineHeight: 1.5 }}>
                  {diagnosisText}
                </p>
              </div>

              {/* Servicio Recomendado en Salón */}
              <div style={{ background: '#ffffff', borderRadius: 20, padding: '1.5rem', border: '1px solid rgba(215, 183, 106, 0.3)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A65F45', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  <Sparkles size={16} /> SERVICIO PROFESIONAL RECOMENDADO EN SALÓN
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.4rem 0', fontSize: '1.25rem', color: '#2A1D17' }}>{recommendedService.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#665' }}>{recommendedService.description}</p>
                    <span style={{ display: 'inline-block', marginTop: '0.5rem', fontWeight: 700, color: '#4A3025' }}>
                      ${recommendedService.price.toLocaleString('es-CO')} · {recommendedService.duration} min
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate('/booking')}
                  >
                    <Calendar size={16} /> Agendar Cita
                  </button>
                </div>
              </div>

              {/* Rutina de Productos para Casa */}
              <div style={{ background: '#ffffff', borderRadius: 20, padding: '1.5rem', border: '1px solid rgba(215, 183, 106, 0.3)', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A65F45', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <ShoppingBag size={16} /> RUTINA DE CUIDADO EN CASA RECOMENDADA
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {recommendedProducts.map((p) => (
                    <div key={p.id} style={{ border: '1px solid #f0e6d8', borderRadius: 14, padding: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 10, marginBottom: '0.5rem' }} />
                        <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.92rem', color: '#2A1D17' }}>{p.name}</h5>
                        <span style={{ color: '#A65F45', fontWeight: 700, fontSize: '0.88rem' }}>${p.price.toLocaleString('es-CO')}</span>
                      </div>
                      <button
                        type="button"
                        className="btn"
                        style={{ marginTop: '0.75rem', fontSize: '0.8rem', padding: '0.4rem', background: '#f5eedf', color: '#4A3025', border: 'none', borderRadius: 8 }}
                        onClick={() => addItem(p)}
                      >
                        + Agregar al carrito
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-gold"
                    style={{ padding: '0.85rem 1.75rem', fontSize: '0.95rem' }}
                    onClick={handleAddRoutineToCart}
                  >
                    ✨ Agregar Rutina Completa al Carrito
                  </button>
                </div>
              </div>

              {/* Reiniciar */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handleRestart}
                  style={{ background: 'transparent', border: 'none', color: '#887', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <RotateCcw size={14} /> Volver a realizar el diagnóstico
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
