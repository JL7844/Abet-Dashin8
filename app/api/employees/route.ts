import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  
  const { data: employees, error } = await supabase
    .from("employees")
    .select(`
      *,
      departments (
        id,
        name
      )
    `)
    .eq("is_active", true)
    .order("first_name")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(employees)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("employees")
    .insert(body)
    .select(`
      *,
      departments (
        id,
        name
      )
    `)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Employee ID is required" }, { status: 400 })
  }

  // Soft delete by setting is_active to false
  const { data, error } = await supabase
    .from("employees")
    .update({ is_active: false })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
