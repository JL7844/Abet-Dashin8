import { createBrowserClient } from '@supabase/ssr'

// Mock client for demo mode when Supabase is not configured
const mockClient = {
  auth: {
    getSession: async () => {
      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('demo_session')
        if (session) {
          try {
            return { data: { session: JSON.parse(session) }, error: null }
          } catch (e) {
            return { data: { session: null }, error: null }
          }
        }
      }
      return { data: { session: null }, error: null }
    },
    signUp: async (options: any) => {
      try {
        const user = {
          id: 'demo_' + Math.random().toString(36).substr(2, 9),
          email: options.email,
          user_metadata: options.options?.data || {},
          created_at: new Date().toISOString(),
        }
        const session = {
          user,
          access_token: 'demo_' + Math.random().toString(36).substr(2, 9),
          token_type: 'bearer',
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('demo_user_' + options.email, JSON.stringify(user))
          localStorage.setItem('demo_session', JSON.stringify(session))
        }
        return {
          data: { user, session },
          error: null,
        }
      } catch (err) {
        return { data: null, error: err }
      }
    },
    signInWithPassword: async (options: any) => {
      try {
        if (typeof window !== 'undefined') {
          const user = localStorage.getItem('demo_user_' + options.email)
          if (user) {
            const userData = JSON.parse(user)
            const session = {
              user: userData,
              access_token: 'demo_' + Math.random().toString(36).substr(2, 9),
              token_type: 'bearer',
            }
            localStorage.setItem('demo_session', JSON.stringify(session))
            return { data: { user: userData, session }, error: null }
          }
        }
        return {
          data: null,
          error: { message: 'Invalid email or password' },
        }
      } catch (err) {
        return { data: null, error: err }
      }
    },
    signOut: async () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('demo_session')
      }
      return { error: null }
    },
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
  }),
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Return mock client if environment variables are not configured
  if (!url || !key) {
    console.warn('[v0] Supabase environment variables not configured. Using demo mode.')
    return mockClient as any
  }

  return createBrowserClient(url, key)
}
