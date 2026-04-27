import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const { data: session, error } = await supabase
    .from("attendance_sessions")
    .select("*")
    .eq("is_active", true)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(session)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  if (body.action === "start") {
    // End any existing active sessions first
    await supabase
      .from("attendance_sessions")
      .update({ 
        is_active: false, 
        ended_at: new Date().toISOString() 
      })
      .eq("is_active", true)

    // Create new session
    const { data, error } = await supabase
      .from("attendance_sessions")
      .insert({
        is_active: true,
        notes: body.notes,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Add some sample attendance records for demo
    const { data: employees } = await supabase
      .from("employees")
      .select("id, first_name, last_name")
      .limit(6)

    if (employees && employees.length > 0) {
      const statuses: ("verified" | "pending" | "suspicious")[] = ["verified", "verified", "verified", "pending", "pending", "suspicious"]
      const sampleRecords = employees.slice(0, 6).map((emp, index) => ({
        employee_id: emp.id,
        session_id: data.id,
        status: statuses[index % statuses.length],
        verification_method: "face_scan",
        face_scan_confidence: 85 + Math.random() * 15,
        check_in_time: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      }))

      await supabase.from("attendance_records").insert(sampleRecords)

      // Add activity logs for sample check-ins
      const activityLogs = employees.slice(0, 6).map((emp, index) => ({
        employee_id: emp.id,
        action: "check_in",
        status: statuses[index % statuses.length],
        details: { verification_method: "face_scan" },
      }))

      await supabase.from("activity_logs").insert(activityLogs)
    }

    return NextResponse.json(data)
  } else if (body.action === "end") {
    const { data, error } = await supabase
      .from("attendance_sessions")
      .update({
        is_active: false,
        ended_at: new Date().toISOString(),
      })
      .eq("id", body.session_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
