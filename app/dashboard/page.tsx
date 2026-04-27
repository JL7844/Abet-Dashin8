'use client'

import { useState, useMemo, useCallback } from 'react'
import useSWR from 'swr'
import { DashboardHeader } from '@/components/dashboard/header'
import { FaceScanSection } from '@/components/dashboard/face-scan-section'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { AttendanceTable } from '@/components/dashboard/attendance-table'
import { ActivityFeed } from '@/components/dashboard/activity-feed'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Example employees for display when database is loading or not connected
const exampleEmployees = [
  {
    id: '1',
    employee_id: 'EMP001',
    first_name: 'Yoseph',
    last_name: 'Legesse',
    email: 'yoseph@dashenbank.com',
    position: 'Branch Manager',
    departments: { id: '1', name: 'Operations' },
  },
  {
    id: '2',
    employee_id: 'EMP002',
    first_name: 'Tigist',
    last_name: 'Haile',
    email: 'tigist@dashenbank.com',
    position: 'Senior Teller',
    departments: { id: '2', name: 'Customer Service' },
  },
  {
    id: '3',
    employee_id: 'EMP003',
    first_name: 'Dawit',
    last_name: 'Mengistu',
    email: 'dawit@dashenbank.com',
    position: 'Loan Officer',
    departments: { id: '3', name: 'Loans' },
  },
  {
    id: '4',
    employee_id: 'EMP004',
    first_name: 'Sara',
    last_name: 'Tadesse',
    email: 'sara@dashenbank.com',
    position: 'Systems Admin',
    departments: { id: '4', name: 'IT' },
  },
  {
    id: '5',
    employee_id: 'EMP005',
    first_name: 'Yonas',
    last_name: 'Bekele',
    email: 'yonas@dashenbank.com',
    position: 'HR Specialist',
    departments: { id: '5', name: 'HR' },
  },
  {
    id: '6',
    employee_id: 'EMP006',
    first_name: 'Meron',
    last_name: 'Alemu',
    email: 'meron@dashenbank.com',
    position: 'Accountant',
    departments: { id: '6', name: 'Finance' },
  },
  {
    id: '7',
    employee_id: 'EMP007',
    first_name: 'Henok',
    last_name: 'Girma',
    email: 'henok@dashenbank.com',
    position: 'Security Officer',
    departments: { id: '7', name: 'Security' },
  },
  {
    id: '8',
    employee_id: 'EMP008',
    first_name: 'Hana',
    last_name: 'Solomon',
    email: 'hana@dashenbank.com',
    position: 'Marketing Coordinator',
    departments: { id: '8', name: 'Marketing' },
  },
  {
    id: '9',
    employee_id: 'EMP009',
    first_name: 'Kidist',
    last_name: 'Worku',
    email: 'kidist@dashenbank.com',
    position: 'Teller',
    departments: { id: '1', name: 'Operations' },
  },
  {
    id: '10',
    employee_id: 'EMP010',
    first_name: 'Bereket',
    last_name: 'Assefa',
    email: 'bereket@dashenbank.com',
    position: 'Customer Service Rep',
    departments: { id: '2', name: 'Customer Service' },
  },
  {
    id: '11',
    employee_id: 'EMP011',
    first_name: 'Selam',
    last_name: 'Tesfaye',
    email: 'selam@dashenbank.com',
    position: 'Credit Analyst',
    departments: { id: '3', name: 'Loans' },
  },
  {
    id: '12',
    employee_id: 'EMP012',
    first_name: 'Nahom',
    last_name: 'Gebre',
    email: 'nahom@dashenbank.com',
    position: 'Software Developer',
    departments: { id: '4', name: 'IT' },
  },
]

// Example activity logs for display
const exampleActivityLogs = [
  { id: 'a1', employeeName: 'Abebe Kebede', action: 'check_in', status: 'verified' as const, timestamp: '08:32 AM' },
  {
    id: 'a2',
    employeeName: 'Tigist Haile',
    action: 'check_in',
    status: 'verified' as const,
    timestamp: '08:35 AM',
  },
  {
    id: 'a3',
    employeeName: 'Dawit Mengistu',
    action: 'check_in',
    status: 'pending' as const,
    timestamp: '08:41 AM',
  },
  { id: 'a4', employeeName: 'Sara Tadesse', action: 'check_in', status: 'verified' as const, timestamp: '08:45 AM' },
  {
    id: 'a5',
    employeeName: 'Yonas Bekele',
    action: 'check_in',
    status: 'suspicious' as const,
    timestamp: '08:52 AM',
  },
  { id: 'a6', employeeName: 'Meron Alemu', action: 'check_in', status: 'verified' as const, timestamp: '09:01 AM' },
]

// Example attendance records
const exampleAttendance = [
  { id: '1', status: 'verified' as const, checkInTime: '08:32 AM' },
  { id: '2', status: 'verified' as const, checkInTime: '08:35 AM' },
  { id: '3', status: 'pending' as const, checkInTime: '08:41 AM' },
  { id: '4', status: 'verified' as const, checkInTime: '08:45 AM' },
  { id: '5', status: 'suspicious' as const, checkInTime: '08:52 AM' },
  { id: '6', status: 'verified' as const, checkInTime: '09:01 AM' },
]

interface Employee {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  email: string
  position: string
  departments: {
    id: string
    name: string
  } | null
}

interface AttendanceRecord {
  id: string
  employee_id: string
  check_in_time: string
  status: 'verified' | 'pending' | 'suspicious'
  employees: Employee
}

interface ActivityLog {
  id: string
  action: string
  status: string
  created_at: string
  employees: {
    first_name: string
    last_name: string
  } | null
}

interface Session {
  id: string
  is_active: boolean
  started_at: string
}

export default function DashboardPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)

  // Fetch active session
  const { data: session, mutate: mutateSession } = useSWR<Session | null>(
    '/api/sessions',
    fetcher,
    { refreshInterval: 5000 }
  )

  // Fetch employees - use example data as fallback
  const { data: dbEmployees } = useSWR<Employee[]>('/api/employees', fetcher)
  const employees = dbEmployees && dbEmployees.length > 0 ? dbEmployees : exampleEmployees

  // Fetch attendance records for current session
  const { data: attendanceRecords = [], mutate: mutateAttendance } = useSWR<AttendanceRecord[]>(
    session?.id ? `/api/attendance?session_id=${session.id}` : '/api/attendance',
    fetcher,
    { refreshInterval: 3000 }
  )

  // Fetch activity logs
  const { data: activityLogs = [], mutate: mutateActivityLogs } = useSWR<ActivityLog[]>(
    '/api/activity-logs?limit=20',
    fetcher,
    { refreshInterval: 3000 }
  )

  // Local state for demo mode session
  const [demoSessionActive, setDemoSessionActive] = useState(false)
  const [demoSessionStartTime, setDemoSessionStartTime] = useState<string | null>(null)

  const isDemoMode = !dbEmployees || dbEmployees.length === 0
  const isSessionActive = isDemoMode ? demoSessionActive : session?.is_active ?? false
  const currentSessionStartTime = isDemoMode ? demoSessionStartTime : session?.started_at

  const handleToggleSession = useCallback(async () => {
    // If in demo mode (no database connection), handle locally
    if (isDemoMode) {
      if (demoSessionActive) {
        setDemoSessionActive(false)
        setDemoSessionStartTime(null)
        setSessionId(null)
      } else {
        setDemoSessionActive(true)
        setDemoSessionStartTime(new Date().toISOString())
        setSessionId('demo-session-' + Date.now())
      }
      return
    }

    try {
      if (isSessionActive && session) {
        await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'end', session_id: session.id }),
        })
        setSessionId(null)
      } else {
        const res = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'start' }),
        })
        const newSession = await res.json()
        setSessionId(newSession.id)
      }
      mutateSession()
    } catch (error) {
      console.error('Failed to toggle session:', error)
    }
  }, [isSessionActive, isDemoMode, demoSessionActive, session, mutateSession])

  const handleFaceScanComplete = useCallback(
    async (employeeId: string, confidence: number) => {
      if (!session?.id) return

      try {
        await fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employee_id: employeeId,
            session_id: session.id,
            status: confidence >= 0.85 ? 'verified' : confidence >= 0.6 ? 'pending' : 'suspicious',
            verification_method: 'face_scan',
            face_scan_confidence: confidence * 100,
          }),
        })
        mutateAttendance()
        mutateActivityLogs()
      } catch (error) {
        console.error('Failed to record attendance:', error)
      }
    },
    [session, mutateAttendance, mutateActivityLogs]
  )

  const handleMarkVerified = useCallback(
    async (employeeId: string) => {
      try {
        await fetch('/api/attendance', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employee_id: employeeId,
            status: 'verified',
          }),
        })
        mutateAttendance()
        mutateActivityLogs()
      } catch (error) {
        console.error('Failed to update status:', error)
      }
    },
    [mutateAttendance, mutateActivityLogs]
  )

  const handleSendReminder = useCallback(
    async (employeeId: string) => {
      // In a real app, this would send an email/SMS notification
      const employee = employees.find((e) => e.id === employeeId)
      if (employee) {
        await fetch('/api/activity-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employee_id: employeeId,
            action: 'reminder_sent',
            status: 'pending',
          }),
        })
        mutateActivityLogs()
      }
    },
    [employees, mutateActivityLogs]
  )

  // Transform attendance records to match the expected format
  const employeesWithAttendance = useMemo(() => {
    // Use example attendance if no real data
    const useExampleData = !dbEmployees || dbEmployees.length === 0

    if (useExampleData) {
      return employees.map((emp, index) => {
        const attendance = exampleAttendance.find((a) => a.id === emp.id)
        return {
          id: emp.id,
          name: `${emp.first_name} ${emp.last_name}`,
          department: emp.departments?.name || 'Unknown',
          status: attendance?.status || ('absent' as const),
          checkInTime: attendance?.checkInTime,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${emp.first_name}%20${emp.last_name}`,
        }
      })
    }

    const attendanceMap = new Map(attendanceRecords.map((record) => [record.employees?.id, record]))

    return employees.map((emp) => {
      const attendance = attendanceMap.get(emp.id)
      return {
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        department: emp.departments?.name || 'Unknown',
        status: attendance?.status || ('absent' as const),
        checkInTime: attendance?.check_in_time
          ? new Date(attendance.check_in_time).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : undefined,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${emp.first_name}%20${emp.last_name}`,
      }
    })
  }, [employees, attendanceRecords, dbEmployees])

  const stats = useMemo(() => {
    const verified = employeesWithAttendance.filter((e) => e.status === 'verified').length
    const pending = employeesWithAttendance.filter((e) => e.status === 'pending').length
    const suspicious = employeesWithAttendance.filter((e) => e.status === 'suspicious').length

    return {
      totalEmployees: employees.length,
      verified,
      pending,
      suspicious,
    }
  }, [employees, employeesWithAttendance])

  const formattedLogs = useMemo(() => {
    // Use example logs if no real data
    if (!activityLogs || activityLogs.length === 0) {
      return exampleActivityLogs
    }

    return activityLogs.map((log) => ({
      id: log.id,
      employeeName: log.employees ? `${log.employees.first_name} ${log.employees.last_name}` : 'Unknown',
      action: log.action,
      status: log.status as 'verified' | 'pending' | 'suspicious',
      timestamp: new Date(log.created_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }))
  }, [activityLogs])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        isSessionActive={isSessionActive}
        sessionStartTime={currentSessionStartTime || undefined}
        isDemoMode={isDemoMode}
        onToggleSession={handleToggleSession}
      />

      <main className="container mx-auto px-4 py-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Face Scan & Activity Feed */}
          <div className="space-y-6 lg:col-span-4">
            <FaceScanSection
              isSessionActive={isSessionActive}
              sessionId={session?.id}
              employees={employees}
              onScanComplete={handleFaceScanComplete}
            />
            <ActivityFeed logs={formattedLogs} isSessionActive={isSessionActive} />
          </div>

          {/* Right Column - Stats & Table */}
          <div className="space-y-6 lg:col-span-8">
            <StatsCards stats={stats} isSessionActive={isSessionActive} />
            <AttendanceTable
              employees={employeesWithAttendance}
              isSessionActive={isSessionActive}
              onMarkVerified={handleMarkVerified}
              onSendReminder={handleSendReminder}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
