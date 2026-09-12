import React from 'react'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div style={{ textAlign: align === 'center' ? 'center' : 'left', marginBottom: '2rem' }}>
      {eyebrow && (
        <span style={{ display: 'inline-block', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.72rem', color: 'var(--color-secondary)', fontWeight: 700, marginBottom: '0.75rem' }}>
          {eyebrow}
        </span>
      )}
      <h2 style={{ margin: 0, fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: 'var(--color-dark)' }}>{title}</h2>
      {description && (
        <p style={{ marginTop: '1rem', maxWidth: '720px', marginInline: align === 'center' ? 'auto' : 0, color: 'var(--color-text)', opacity: 0.8, fontSize: '1.05rem' }}>
          {description}
        </p>
      )}
    </div>
  )
}
