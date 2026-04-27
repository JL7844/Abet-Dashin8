import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("illness_reports")
    .select(`
      *,
      employees (
        id,
        employee_id,
        first_name,
        last_name,
        departments (
          name
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  // Generate reference number
  const referenceNumber = `ILL-${Date.now().toString(36).toUpperCase()}`

  // Use employee UUID directly
  const employeeId = body.employee_uuid

  if (!employeeId) {
    return NextResponse.json({ error: "Employee ID is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("illness_reports")
    .insert({
      employee_id: employeeId,
      illness_type: body.illness_type,
      start_date: body.start_date,
      end_date: body.end_date,
      symptoms: body.symptoms,
      has_medical_certificate: body.has_medical_certificate,
      additional_notes: body.additional_notes,
      reference_number: referenceNumber,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log the activity
  await supabase.from("activity_logs").insert({
    employee_id: employeeId,
    action: "illness_report",
    status: "pending",
    details: {
      illness_type: body.illness_type,
      reference_number: referenceNumber,
    },
  })

  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("illness_reports")
    .update({
      status: body.status,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
