import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Booking } from '../types'

interface BookingContextValue {
  bookings: Booking[]
  addBooking: (booking: Booking) => void
  removeBooking: (id: string) => void
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])

  const addBooking = (booking: Booking) => {
    setBookings((current) => [...current, booking])
  }

  const removeBooking = (id: string) => {
    setBookings((current) => current.filter((item) => item.id !== id))
  }

  const value = useMemo(() => ({ bookings, addBooking, removeBooking }), [bookings])

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider')
  }
  return context
}
