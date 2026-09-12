import React from 'react'
import { MapPin, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react'

export default function TopNotificationBar() {
  return (
    <div className="top-notification-bar">
      <div className="top-bar-content">
        <span className="top-bar-item">
          <MapPin size={13} className="top-bar-highlight" />
          <span>Cra 79B #10A-61, Local 3 · Cali, Colombia</span>
        </span>
        <span className="top-bar-item">
          <Sparkles size={13} className="top-bar-highlight" />
          <span>Diagnóstico capilar personalizado para rizos, afro y transición</span>
        </span>
        <span className="top-bar-item">
          <ShieldCheck size={13} className="top-bar-highlight" />
          <span>Productos botánicos libres de sulfatos y parabenos</span>
        </span>
      </div>
    </div>
  )
}
