import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { user_id, email, front, left, right } = await request.json()

    // Insert biometric data
    const { data, error } = await supabase
      .from('biometric_scans')
      .insert({
        user_id,
        email,
        front_scan: front,
        left_scan: left,
        right_scan: right,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const email = searchParams.get('email')

    const supabase = await createClient()

    let query = supabase.from('biometric_scans').select('*')

    if (userId) {
      query = query.eq('user_id', userId)
    }
    if (email) {
      query = query.eq('email', email)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error }, { status: 500 })
  }
}
