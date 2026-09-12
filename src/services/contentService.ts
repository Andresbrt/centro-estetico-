import { galleryItems, services, siteSettings } from '../data/mockData'
import type { GalleryItem, Service, SiteSettings } from '../types'
import { supabase } from './supabaseClient'

export async function fetchPublishedServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  if (error || !data) {
    return services as Service[]
  }

  return (data ?? []).map((item) => ({
    ...item,
    price: Number(item.price ?? 0),
    duration: Number(item.duration ?? 60),
  })) as Service[]
}

export async function fetchPublishedGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('active', true)
    .order('position', { ascending: true })

  if (error || !data) {
    return galleryItems as GalleryItem[]
  }

  return (data ?? []) as GalleryItem[]
}

export async function fetchBrandSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from('site_settings').select('*')

  if (error || !data || data.length === 0) {
    return siteSettings
  }

  const values = Object.fromEntries(data.map((item) => [item.key, item.value])) as Record<string, unknown>

  return {
    name: String(values.brand_name ?? siteSettings.name),
    tagline: String(values.tagline ?? siteSettings.tagline),
    whatsapp: String(values.whatsapp ?? siteSettings.whatsapp),
    instagram: String(values.instagram ?? siteSettings.instagram),
    instagram_url: String(values.instagram_url ?? siteSettings.instagram_url),
    facebook: String(values.facebook ?? siteSettings.facebook),
    address: String(values.address ?? siteSettings.address),
    hours: String(values.hours ?? siteSettings.hours),
    description: String(values.description ?? siteSettings.description),
    logo: String(values.logo ?? siteSettings.logo),
    location: String(values.location ?? siteSettings.location),
  }
}
