import { galleryItems, instagramPosts, products, services, siteSettings, testimonials, transformations } from '../data/mockData'
import type { GalleryItem, InstagramPost, Product, Service, Testimonial, Transformation } from '../types'

async function resolve<T>(source: T[], fallback: T[]): Promise<T[]> {
  return source && source.length > 0 ? source : fallback
}

export const getServices = async (): Promise<Service[]> => resolve(services as Service[], services)
export const getProducts = async (): Promise<Product[]> => resolve(products as Product[], products)
export const getGallery = async (): Promise<GalleryItem[]> => resolve(galleryItems as GalleryItem[], galleryItems)
export const getTestimonials = async (): Promise<Testimonial[]> => resolve(testimonials as Testimonial[], testimonials)
export const getTransformations = async (): Promise<Transformation[]> => resolve(transformations as Transformation[], transformations)
export const getInstagramPosts = async (): Promise<InstagramPost[]> => resolve(instagramPosts as InstagramPost[], instagramPosts)
export const getSiteSettings = async () => siteSettings
