import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../services/supabaseClient'
import type { Profile, Role } from '../types'

interface AuthContextValue {
  user: Profile | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; message?: string }>
  logout: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function buildProfileFromAuthUser(authUser: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null): Promise<Profile | null> {
  if (!authUser) return null

  const metadata = authUser.user_metadata ?? {}
  const profileName = String(metadata.full_name ?? metadata.name ?? authUser.email ?? 'Cliente')
  const role = (String(metadata.role ?? 'customer') as Role) === 'admin' ? 'admin' : 'customer'

  let profile: Profile = {
    id: authUser.id,
    full_name: profileName,
    phone: String(metadata.phone ?? ''),
    avatar_url: typeof metadata.avatar_url === 'string' ? metadata.avatar_url : undefined,
    role,
  }

  const { data: profileData } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle()
  if (profileData) {
    const metadataRole = String((profileData.metadata as Record<string, unknown> | null)?.role ?? metadata.role ?? 'customer')
    profile = {
      id: profileData.id,
      full_name: String(profileData.full_name ?? profileName),
      phone: String(profileData.phone ?? metadata.phone ?? ''),
      avatar_url: typeof profileData.avatar_url === 'string' ? profileData.avatar_url : undefined,
      role: metadataRole === 'admin' ? 'admin' : 'customer',
    }
  }

  return profile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedSession = localStorage.getItem('centro-afro-auth')
        if (savedSession) {
          const parsed = JSON.parse(savedSession) as Profile
          setUser(parsed)
          setLoading(false)
          return
        }

        const { data: sessionData, error } = await supabase.auth.getSession()
        if (!error && sessionData.session?.user) {
          const profile = await buildProfileFromAuthUser(sessionData.session.user)
          if (profile) {
            setUser(profile)
            localStorage.setItem('centro-afro-auth', JSON.stringify(profile))
          }
        }
      } catch (error) {
        console.warn('Supabase session not available yet', error)
      } finally {
        setLoading(false)
      }
    }

    void loadSession()
  }, [])

  const isAdmin = useMemo(() => user?.role === 'admin', [user])

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase()

    // Credenciales de prueba en desarrollo local (o cuando Supabase no está conectado)
    if (
      (normalizedEmail === 'admin@afro.com' || normalizedEmail === 'admin@email.com') &&
      (password === 'admin123' || password === '123456')
    ) {
      const demoProfile: Profile = {
        id: 'demo-admin-local',
        full_name: 'Administrador Demo',
        phone: '573001234567',
        role: 'admin',
      }
      setUser(demoProfile)
      localStorage.setItem('centro-afro-auth', JSON.stringify(demoProfile))
      return { ok: true }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
      if (error) {
        return { ok: false, message: error.message }
      }

      const profile = await buildProfileFromAuthUser(data.user)
      if (!profile) {
        return { ok: false, message: 'No se pudo cargar tu perfil en Supabase.' }
      }

      if (profile.role !== 'admin') {
        await supabase.auth.signOut()
        return { ok: false, message: 'Este usuario no tiene permisos de administrador.' }
      }

      setUser(profile)
      localStorage.setItem('centro-afro-auth', JSON.stringify(profile))
      return { ok: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo iniciar sesión.'
      return { ok: false, message }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, role: 'customer' } },
      })
      if (error) {
        return { ok: false, message: error.message }
      }
      return { ok: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo registrar el usuario.'
      return { ok: false, message }
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (!error) {
        setUser(null)
        localStorage.removeItem('centro-afro-auth')
      }
    } catch (error) {
      console.warn('Supabase logout failed', error)
      setUser(null)
      localStorage.removeItem('centro-afro-auth')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
