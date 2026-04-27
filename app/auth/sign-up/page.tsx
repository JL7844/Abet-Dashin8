'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, CheckCircle2, UserCheck, Shield } from 'lucide-react'
import { BiometricScanner } from '@/components/biometric-scanner'

export default function SignUp() {
  const router = useRouter()
  const [supabase, setSupabase] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userType, setUserType] = useState<'employee' | 'admin' | null>(null)
  const [fullName, setFullName] = useState('Yoseph Legesse')
  const [email, setEmail] = useState('yoseph@dashenbank.com')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [employeeId, setEmployeeId] = useState('EMP001')
  const [biometricScans, setBiometricScans] = useState<{ front: string; left: string; right: string } | null>(null)
  const [showBiometricScanner, setShowBiometricScanner] = useState(false)

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

  const handleSignUp = useCallback(
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

        if (!userType) {
          setError('Please select if you are an employee or admin')
          setIsLoading(false)
          return
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setIsLoading(false)
          return
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          setIsLoading(false)
          return
        }

        // Sign up with Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              user_type: userType,
              employee_id: employeeId,
            },
            emailRedirectTo:
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
              `${window.location.origin}/auth/callback`,
          },
        })

        if (authError) throw authError

        if (authData.user) {
          // For employees, show biometric scanner before proceeding
          if (userType === 'employee') {
            setShowBiometricScanner(true)
          } else {
            // Admins skip biometric and go directly to admin page
            router.push('/admin')
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred during sign up'
        setError(errorMessage)
        console.error('Sign up error:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [supabase, userType, fullName, email, password, confirmPassword, employeeId, router]
  )

  // Show biometric scanner if sign-up succeeded and user is employee
  if (showBiometricScanner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/3 to-accent/5 flex items-center justify-center p-4">
        <BiometricScanner
          onScanComplete={(scans) => {
            setBiometricScans(scans)
            setShowBiometricScanner(false)
            // Redirect to login after scan
            setTimeout(() => {
              router.push('/auth/login')
            }, 1000)
          }}
          onSkip={() => {
            setShowBiometricScanner(false)
            router.push('/auth/login')
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/3 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/30 shadow-2xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join Dashen Bank Attendance System</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">I am a:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUserType('employee')}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  userType === 'employee'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <UserCheck className={`h-6 w-6 ${userType === 'employee' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Employee</span>
                </div>
              </button>

              <button
                onClick={() => setUserType('admin')}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  userType === 'admin'
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Shield className={`h-6 w-6 ${userType === 'admin' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">Admin</span>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="flex gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fullName">Full Name *</FieldLabel>
                <Input
                  id="fullName"
                  placeholder="Yoseph Legesse"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>
            </FieldGroup>

            {userType === 'employee' && (
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="employeeId">Employee ID *</FieldLabel>
                  <Input
                    id="employeeId"
                    placeholder="EMP001"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Field>
              </FieldGroup>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email Address *</FieldLabel>
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
                <FieldLabel htmlFor="password">Password *</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>
            </FieldGroup>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password *</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="w-full gap-2"
              disabled={isLoading || !userType || !supabase}
              size="lg"
            >
              {isLoading && <Spinner className="h-4 w-4" />}
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
