import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("session_id")

  let query = supabase
    .from("attendance_records")
    .select(`
      *,
      employees (
        id,
        employee_id,
        first_name,
        last_name,
        email,
        position,
        departments (
          id,
          name
        )
      )
    `)
    .order("check_in_time", { ascending: false })

  if (sessionId) {
    query = query.eq("session_id", sessionId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { data, error } = await supabase
    .from("attendance_records")
    .insert({
      employee_id: body.employee_id,
      session_id: body.session_id,
      status: body.status || "verified",
      verification_method: body.verification_method || "face_scan",
      face_scan_confidence: body.face_scan_confidence,
      location: body.location,
      device_info: body.device_info,
    })
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
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log the activity
  await supabase.from("activity_logs").insert({
    employee_id: body.employee_id,
    action: "check_in",
    status: body.status || "verified",
    details: {
      verification_method: body.verification_method,
      confidence: body.face_scan_confidence,
    },
  })

  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  // Can update by either record id or employee_id
  let query = supabase
    .from("attendance_records")
    .update({
      status: body.status,
      notes: body.notes,
      updated_at: new Date().toISOString(),
    })

  if (body.id) {
    query = query.eq("id", body.id)
  } else if (body.employee_id) {
    query = query.eq("employee_id", body.employee_id)
  } else {
    return NextResponse.json({ error: "id or employee_id required" }, { status: 400 })
  }

  const { data, error } = await query.select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log the activity if status was updated
  if (body.status) {
    await supabase.from("activity_logs").insert({
      employee_id: body.employee_id || data.employee_id,
      action: "status_updated",
      status: body.status,
      details: { previous_status: "pending", new_status: body.status },
    })
  }

  return NextResponse.json(data)
}
