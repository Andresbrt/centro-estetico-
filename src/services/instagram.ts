import { getInstagramPosts } from './serviceData'
import type { InstagramPost } from '../types'

export const fetchInstagramPosts = async (): Promise<InstagramPost[]> => {
  return getInstagramPosts()
}
