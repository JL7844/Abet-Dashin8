"use client"

import { useState } from "react"
import { CheckCircle2, Clock, AlertTriangle, MoreHorizontal, UserCheck, Bell, Eye, Flag, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type AttendanceStatus = "verified" | "pending" | "suspicious" | "absent"

interface Employee {
  id: string
  name: string
  department: string
  status: AttendanceStatus
  checkInTime?: string
  avatar?: string
}

interface AttendanceTableProps {
  employees: Employee[]
  isSessionActive?: boolean
  onMarkVerified?: (employeeId: string) => void
  onSendReminder?: (employeeId: string) => void
}

const statusConfig: Record<AttendanceStatus, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/20",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning/10 text-warning-foreground border-warning/20",
  },
  suspicious: {
    label: "Suspicious",
    icon: AlertTriangle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  absent: {
    label: "Absent",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-muted",
  },
}

export function AttendanceTable({ employees, isSessionActive = false, onMarkVerified, onSendReminder }: AttendanceTableProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)

  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDetailsOpen(true)
  }

  const handleMarkVerified = async (employee: Employee) => {
    onMarkVerified?.(employee.id)
    setActionFeedback(`${employee.name} marked as verified`)
    setTimeout(() => setActionFeedback(null), 2000)
  }

  const handleSendReminder = async (employee: Employee) => {
    onSendReminder?.(employee.id)
    setActionFeedback(`Reminder sent to ${employee.name}`)
    setTimeout(() => setActionFeedback(null), 2000)
  }

  const verifiedCount = employees.filter(e => e.status === "verified").length
  const totalCount = employees.length

  return (
    <>
      {actionFeedback && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 fade-in rounded-lg bg-success px-4 py-2 text-sm font-medium text-success-foreground shadow-lg">
          <CheckCircle2 className="mr-2 inline-block h-4 w-4" />
          {actionFeedback}
        </div>
      )}
    <Card className={`relative overflow-hidden transition-all duration-300 ${isSessionActive ? "ring-2 ring-success/20" : ""}`}>
        <div className={`absolute inset-x-0 top-0 h-1 transition-all duration-500 ${isSessionActive ? "bg-gradient-to-r from-success/50 via-success to-success/50" : "bg-muted"}`} />
        <CardHeader className="pt-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Live Attendance
                {isSessionActive && (
                  <Badge variant="outline" className="ml-2 gap-1.5 border-success/50 bg-success/10 text-success animate-in fade-in duration-300">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                    </span>
                    Live
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                {isSessionActive 
                  ? `${verifiedCount} of ${totalCount} employees checked in`
                  : "Start a session to track attendance"
                }
              </CardDescription>
            </div>
            {isSessionActive && (
              <div className="text-right">
                <p className="text-2xl font-bold text-success">{Math.round((verifiedCount / totalCount) * 100) || 0}%</p>
                <p className="text-xs text-muted-foreground">Attendance Rate</p>
              </div>
            )}
          </div>
        </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="hidden sm:table-cell">Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Check-in Time</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <p className="text-muted-foreground">No employees found</p>
                  </TableCell>
                </TableRow>
              ) : (employees.map((employee) => {
                const status = statusConfig[employee.status]
                const StatusIcon = status.icon
                
                return (
                  <TableRow key={employee.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                            {employee.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{employee.name}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">{employee.department}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {employee.department}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1 ${status.className}`}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden font-mono text-sm text-muted-foreground md:table-cell">
                      {employee.checkInTime || "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => handleViewDetails(employee)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleSendReminder(employee)}
                            disabled={employee.status === "verified"}
                          >
                            <Bell className="mr-2 h-4 w-4" />
                            Send Reminder
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleMarkVerified(employee)}
                            disabled={employee.status === "verified"}
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Mark as Verified
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Flag className="mr-2 h-4 w-4" />
                            Report Issue
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
</TableRow>
                )
              }))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

      {/* Employee Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              Attendance information for {selectedEmployee?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
                    {selectedEmployee.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedEmployee.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedEmployee.department}</p>
                </div>
              </div>
              <div className="grid gap-3 rounded-lg border border-border p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className={statusConfig[selectedEmployee.status].className}>
                    {statusConfig[selectedEmployee.status].label}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Check-in Time</span>
                  <span className="text-sm font-medium">{selectedEmployee.checkInTime || "Not checked in"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Department</span>
                  <span className="text-sm font-medium">{selectedEmployee.department}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleSendReminder(selectedEmployee)}
                  disabled={selectedEmployee.status === "verified"}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Send Reminder
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => handleMarkVerified(selectedEmployee)}
                  disabled={selectedEmployee.status === "verified"}
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Mark Verified
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
