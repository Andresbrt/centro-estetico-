export type Role = 'customer' | 'admin'

export interface Profile {
  id: string
  full_name: string
  phone?: string
  avatar_url?: string
  role: Role
}

export interface Service {
  id: string
  name: string
  slug: string
  description?: string
  short_description?: string
  image_url?: string
  price?: number
  duration?: number
  active?: boolean
  created_at?: string
  updated_at?: string
}

export interface SiteSettings {
  name: string
  tagline: string
  whatsapp: string
  instagram: string
  instagram_url: string
  facebook: string
  address: string
  hours: string
  description: string
  logo: string
  location: string
}

export interface DashboardMetric {
  label: string
  value: string
  trend: string
}

export interface SEOSettings {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  canonical: string
}
