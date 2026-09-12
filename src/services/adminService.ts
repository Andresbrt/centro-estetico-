import type { SEOSettings, Service } from '../types'
import { supabase } from './supabaseClient'

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as Service[]
}

export async function upsertService(service: Partial<Service>): Promise<Service> {
  const payload = {
    ...service,
    id: service.id ?? crypto.randomUUID(),
    price: service.price ?? 0,
    duration: service.duration ?? 60,
    active: service.active ?? true,
    slug: service.slug ?? service.name?.toLowerCase().replace(/\s+/g, '-') ?? 'servicio',
  }

  const { data, error } = await supabase
    .from('services')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as Service
}

export async function deleteService(serviceId: string): Promise<void> {
  const { error } = await supabase.from('services').delete().eq('id', serviceId)

  if (error) {
    throw error
  }
}

export async function fetchGallery(): Promise<Array<{ id: string; title: string; url: string; category: string; position: number; active: boolean }>> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('position', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []) as Array<{ id: string; title: string; url: string; category: string; position: number; active: boolean }>
}

export async function upsertGalleryItem(item: {
  id?: string
  title: string
  url: string
  category: string
  position: number
  active?: boolean
}): Promise<{ id: string; title: string; url: string; category: string; position: number; active: boolean }> {
  const payload = {
    ...item,
    id: item.id ?? crypto.randomUUID(),
    active: item.active ?? true,
  }

  const { data, error } = await supabase
    .from('gallery')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as { id: string; title: string; url: string; category: string; position: number; active: boolean }
}

export async function deleteGalleryItem(itemId: string): Promise<void> {
  const { error } = await supabase.from('gallery').delete().eq('id', itemId)

  if (error) {
    throw error
  }
}

export async function fetchSeoSettings(): Promise<SEOSettings> {
  const { data, error } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('slug', 'home')
    .maybeSingle()

  if (error || !data) {
    return {
      title: 'Centro de Experiencia Afro Maira Vásquez | Peluquería Afro en Cali',
      description: 'Peluquería afro en Cali especializada en cabello afro, rizado, ondulado y transición capilar.',
      keywords: 'peluquería afro cali, cabello afro cali, transición capilar cali, estilismo afro cali',
      ogTitle: 'Centro de Experiencia Afro Maira Vásquez',
      ogDescription: 'Cuidado profesional para cabellos afro, rizados, ondulados y procesos de transición.',
      canonical: 'https://centroafro.com',
    }
  }

  return {
    title: data.title ?? 'Centro de Experiencia Afro Maira Vásquez | Peluquería Afro en Cali',
    description: data.description ?? 'Peluquería afro en Cali especializada en cabello afro, rizado, ondulado y transición capilar.',
    keywords: data.keywords ?? 'peluquería afro cali, cabello afro cali, transición capilar cali, estilismo afro cali',
    ogTitle: data.og_title ?? 'Centro de Experiencia Afro Maira Vásquez',
    ogDescription: data.og_description ?? 'Cuidado profesional para cabellos afro, rizados, ondulados y procesos de transición.',
    canonical: data.canonical_url ?? 'https://centroafro.com',
  }
}

export async function upsertSeoSettings(settings: SEOSettings): Promise<SEOSettings> {
  const payload = {
    slug: 'home',
    title: settings.title,
    description: settings.description,
    keywords: settings.keywords,
    og_title: settings.ogTitle,
    og_description: settings.ogDescription,
    canonical_url: settings.canonical,
  }

  const { data, error } = await supabase
    .from('seo_pages')
    .upsert(payload, { onConflict: 'slug' })
    .select()
    .single()

  if (error) {
    throw error
  }

  return {
    title: data.title ?? settings.title,
    description: data.description ?? settings.description,
    keywords: data.keywords ?? settings.keywords,
    ogTitle: data.og_title ?? settings.ogTitle,
    ogDescription: data.og_description ?? settings.ogDescription,
    canonical: data.canonical_url ?? settings.canonical,
  }
}

export async function fetchDashboardStats(): Promise<{
  bookings: number
  leads: number
  revenue: number
  orders: number
}> {
  try {
    const [{ count: bookingsCount }, { count: leadsCount }, { count: ordersCount }, { data: revenueData }] = await Promise.all([
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('price'),
    ])

    const revenue = (revenueData ?? []).reduce((sum, item) => sum + Number(item.price ?? 0), 0)

    return {
      bookings: bookingsCount ?? 0,
      leads: leadsCount ?? 0,
      revenue,
      orders: ordersCount ?? 0,
    }
  } catch {
    return {
      bookings: 0,
      leads: 0,
      revenue: 0,
      orders: 0,
    }
  }
}
