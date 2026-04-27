'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if Supabase env vars are configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          // No Supabase config, go to landing page
          router.push('/landing')
          return
        }

        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          // Not logged in, show landing page
          router.push('/landing')
        } else {
          // Logged in, route based on user type
          const userType = session.user.user_metadata?.user_type
          if (userType === 'employee') {
            router.push('/user')
          } else if (userType === 'admin') {
            router.push('/admin')
          } else {
            router.push('/landing')
          }
        }
      } catch (error) {
        console.error('[v0] Auth check error:', error)
        // Fall back to landing page on error
        router.push('/landing')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (!isLoading) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  )
}

