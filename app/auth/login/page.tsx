'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('yoseph@dashenbank.com')
  const [password, setPassword] = useState('')

  // Initialize Supabase client safely
  useEffect(() => {
    try {
      const client = createClient()
      setSupabase(client)
    } catch (err) {
      console.error('[v0] Supabase init error:', err)
      // Check if env vars are missing
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!url || !key) {
        setError('Please configure Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) in your project settings.')
      } else {
        setError('Error initializing Supabase client: ' + (err instanceof Error ? err.message : 'Unknown error'))
      }
    }
  }, [])

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)
      setIsLoading(true)

      try {
        if (!supabase) {
          setError('Supabase client not initialized')
          setIsLoading(false)
          return
        }

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (authError) throw authError

        if (authData.user) {
          // Get user metadata to determine user type
          const userType = authData.user.user_metadata?.user_type
          
          // Route based on user type
          if (userType === 'employee') {
            router.push('/user')
          } else if (userType === 'admin') {
            router.push('/admin')
          } else {
            // Default route
            router.push('/')
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to sign in'
        setError(errorMessage)
        console.error('Login error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [supabase, email, password, router]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/3 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/30 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to Dashen Bank Attendance System</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="yoseph@dashenbank.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading || !supabase}
              size="lg"
            >
              {isLoading && <Spinner className="h-4 w-4" />}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don&apos;t have an account? </span>
            <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
              Create Account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
