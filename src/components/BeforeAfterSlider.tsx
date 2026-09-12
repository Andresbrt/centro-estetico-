import React, { useRef, useState, useCallback, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
  title?: string
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Antes',
  afterLabel = 'Después',
  title,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }, [])

  const onMouseDown = () => setIsDragging(true)
  const onMouseUp = () => setIsDragging(false)
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const onTouchStart = () => setIsDragging(true)
  const onTouchEnd = () => setIsDragging(false)
  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    handleMove(e.touches[0].clientX)
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchend', handleGlobalMouseUp)
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalMouseUp)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="before-after-slider"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      role="slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-label={title || 'Comparador antes y después'}
    >
      {/* Imagen Después (Fondo) */}
      <img src={afterImage} alt={`${beforeLabel} - resultado`} className="ba-image-after" />

      {/* Imagen Antes (Recorte dinámico) */}
      <div
        className="ba-image-before-wrap"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="ba-image-before"
          style={{
            width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100%',
            maxWidth: 'none',
          }}
        />
      </div>

      {/* Badges */}
      <span className="ba-badge ba-badge-before">{beforeLabel}</span>
      <span className="ba-badge ba-badge-after">
        <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
        {afterLabel}
      </span>

      {/* Divisor y Handle de arrastre */}
      <div className="ba-divider" style={{ left: `${sliderPosition}%` }}>
        <div className="ba-handle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
            <polyline points="9 18 3 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  )
}
