import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "20")

  const { data, error } = await supabase
    .from("activity_logs")
    .select(`
      *,
      employees (
        id,
        employee_id,
        first_name,
        last_name
      )
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("activity_logs")
    .insert({
      employee_id: body.employee_id,
      action: body.action,
      status: body.status,
      details: body.details,
      ip_address: body.ip_address,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
