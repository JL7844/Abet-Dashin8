"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import {
  Users,
  Plus,
  Trash2,
  ArrowLeft,
  Search,
  Building2,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Example data for demo mode
const exampleEmployees = [
  { id: "1", employee_id: "EMP001", first_name: "Yoseph", last_name: "Legesse", email: "yoseph@dashenbank.com", phone: "+251911234567", position: "Branch Manager", hire_date: "2020-03-15", departments: { id: "1", name: "Operations" } },
  { id: "2", employee_id: "EMP002", first_name: "Tigist", last_name: "Haile", email: "tigist@dashenbank.com", phone: "+251922345678", position: "Senior Teller", hire_date: "2019-07-22", departments: { id: "2", name: "Customer Service" } },
  { id: "3", employee_id: "EMP003", first_name: "Dawit", last_name: "Mengistu", email: "dawit@dashenbank.com", phone: "+251933456789", position: "Loan Officer", hire_date: "2021-01-10", departments: { id: "3", name: "Loans" } },
  { id: "4", employee_id: "EMP004", first_name: "Sara", last_name: "Tadesse", email: "sara@dashenbank.com", phone: "+251944567890", position: "Systems Admin", hire_date: "2018-11-05", departments: { id: "4", name: "IT" } },
  { id: "5", employee_id: "EMP005", first_name: "Yonas", last_name: "Bekele", email: "yonas@dashenbank.com", phone: "+251955678901", position: "HR Specialist", hire_date: "2022-04-18", departments: { id: "5", name: "HR" } },
  { id: "6", employee_id: "EMP006", first_name: "Meron", last_name: "Alemu", email: "meron@dashenbank.com", phone: "+251966789012", position: "Accountant", hire_date: "2020-08-30", departments: { id: "6", name: "Finance" } },
  { id: "7", employee_id: "EMP007", first_name: "Henok", last_name: "Girma", email: "henok@dashenbank.com", phone: "+251977890123", position: "Security Officer", hire_date: "2019-02-14", departments: { id: "7", name: "Security" } },
  { id: "8", employee_id: "EMP008", first_name: "Hana", last_name: "Solomon", email: "hana@dashenbank.com", phone: "+251988901234", position: "Marketing Coordinator", hire_date: "2021-06-25", departments: { id: "8", name: "Marketing" } },
  { id: "9", employee_id: "EMP009", first_name: "Kidist", last_name: "Worku", email: "kidist@dashenbank.com", phone: "+251912345678", position: "Teller", hire_date: "2023-01-15", departments: { id: "1", name: "Operations" } },
  { id: "10", employee_id: "EMP010", first_name: "Bereket", last_name: "Assefa", email: "bereket@dashenbank.com", phone: "+251923456789", position: "Customer Service Rep", hire_date: "2022-06-20", departments: { id: "2", name: "Customer Service" } },
]

const exampleDepartments = [
  { id: "1", name: "Operations" },
  { id: "2", name: "Customer Service" },
  { id: "3", name: "Loans" },
  { id: "4", name: "IT" },
  { id: "5", name: "HR" },
  { id: "6", name: "Finance" },
  { id: "7", name: "Security" },
  { id: "8", name: "Marketing" },
]

interface Employee {
  id: string
  employee_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  position?: string
  hire_date?: string
  departments?: {
    id: string
    name: string
  }
}

interface Department {
  id: string
  name: string
}

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  
  // Demo mode state for local employee management
  const [demoEmployees, setDemoEmployees] = useState(exampleEmployees)

  // Form state
  const [formData, setFormData] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department_id: "",
    position: "",
    hire_date: new Date().toISOString().split("T")[0],
  })

  // Fetch data
  const { data: dbEmployees, mutate: mutateEmployees } = useSWR<Employee[]>("/api/employees", fetcher)
  const { data: dbDepartments } = useSWR<Department[]>("/api/departments", fetcher)

  const isDemoMode = !dbEmployees || dbEmployees.length === 0
  const employees = isDemoMode ? demoEmployees : dbEmployees
  const departments = dbDepartments && dbDepartments.length > 0 ? dbDepartments : exampleDepartments

  // Filter employees based on search
  const filteredEmployees = employees.filter((emp) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      emp.first_name.toLowerCase().includes(searchLower) ||
      emp.last_name.toLowerCase().includes(searchLower) ||
      emp.employee_id.toLowerCase().includes(searchLower) ||
      emp.email.toLowerCase().includes(searchLower) ||
      emp.departments?.name.toLowerCase().includes(searchLower)
    )
  })

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const resetForm = () => {
    setFormData({
      employee_id: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      department_id: "",
      position: "",
      hire_date: new Date().toISOString().split("T")[0],
    })
  }

  const handleAddEmployee = useCallback(async () => {
    setIsSubmitting(true)

    // Validate required fields
    if (!formData.employee_id || !formData.first_name || !formData.last_name || !formData.email) {
      showNotification("error", "Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    if (isDemoMode) {
      // Demo mode: add locally
      const newEmployee: Employee = {
        id: `demo-${Date.now()}`,
        employee_id: formData.employee_id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        hire_date: formData.hire_date,
        departments: departments.find(d => d.id === formData.department_id) || { id: "1", name: "Operations" },
      }
      setDemoEmployees(prev => [...prev, newEmployee])
      showNotification("success", `${formData.first_name} ${formData.last_name} added successfully`)
      setIsAddDialogOpen(false)
      resetForm()
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        mutateEmployees()
        showNotification("success", `${formData.first_name} ${formData.last_name} added successfully`)
        setIsAddDialogOpen(false)
        resetForm()
      } else {
        const error = await response.json()
        showNotification("error", error.message || "Failed to add employee")
      }
    } catch (error) {
      showNotification("error", "Failed to add employee")
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, isDemoMode, departments, mutateEmployees])

  const handleDeleteEmployee = useCallback(async () => {
    if (!deleteEmployee) return
    setIsSubmitting(true)

    if (isDemoMode) {
      // Demo mode: remove locally
      setDemoEmployees(prev => prev.filter(emp => emp.id !== deleteEmployee.id))
      showNotification("success", `${deleteEmployee.first_name} ${deleteEmployee.last_name} removed successfully`)
      setDeleteEmployee(null)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(`/api/employees?id=${deleteEmployee.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        mutateEmployees()
        showNotification("success", `${deleteEmployee.first_name} ${deleteEmployee.last_name} removed successfully`)
      } else {
        const error = await response.json()
        showNotification("error", error.message || "Failed to remove employee")
      }
    } catch (error) {
      showNotification("error", "Failed to remove employee")
    } finally {
      setDeleteEmployee(null)
      setIsSubmitting(false)
    }
  }, [deleteEmployee, isDemoMode, mutateEmployees])

  // Generate next employee ID
  const generateEmployeeId = () => {
    const maxId = employees.reduce((max, emp) => {
      const num = parseInt(emp.employee_id.replace("EMP", ""))
      return num > max ? num : max
    }, 0)
    return `EMP${String(maxId + 1).padStart(3, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Notification Toast */}
      {notification && (
        <div 
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg animate-in slide-in-from-bottom-2 fade-in ${
            notification.type === "success" 
              ? "bg-success text-success-foreground" 
              : "bg-destructive text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <span className="font-medium">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white p-0.5 shadow-sm ring-1 ring-border">
                <Image
                  src="/images/dashen-bank-logo.png"
                  alt="Dashen Bank Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Employee Management</p>
              </div>
            </div>
          </div>
          {isDemoMode && (
            <Badge variant="outline" className="border-warning/50 bg-warning/10 text-warning-foreground">
              Demo Mode
            </Badge>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Employees</h2>
            <p className="text-muted-foreground">
              Manage employee records for Dashen Bank
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 shadow-lg" onClick={() => {
                setFormData(prev => ({ ...prev, employee_id: generateEmployeeId() }))
              }}>
                <UserPlus className="h-5 w-5" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter the employee details below. Required fields are marked with *.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Employee ID *</FieldLabel>
                      <Input
                        value={formData.employee_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, employee_id: e.target.value }))}
                        placeholder="EMP001"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Department</FieldLabel>
                      <Select 
                        value={formData.department_id} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, department_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                </FieldGroup>

                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>First Name *</FieldLabel>
                      <Input
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        placeholder="Enter first name"
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Last Name *</FieldLabel>
                      <Input
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        placeholder="Enter last name"
                      />
                    </Field>
                  </div>
                </FieldGroup>

                <Field>
                  <FieldLabel>Email Address *</FieldLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="employee@dashenbank.com"
                  />
                </Field>

                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Phone Number</FieldLabel>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+251..."
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Position</FieldLabel>
                      <Input
                        value={formData.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        placeholder="Job title"
                      />
                    </Field>
                  </div>
                </FieldGroup>

                <Field>
                  <FieldLabel>Hire Date</FieldLabel>
                  <Input
                    type="date"
                    value={formData.hire_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, hire_date: e.target.value }))}
                  />
                </Field>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEmployee} disabled={isSubmitting} className="gap-2">
                  {isSubmitting ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Employee
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{employees.length}</p>
                  <p className="text-xs text-muted-foreground">Total Employees</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10">
                  <Building2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{departments.length}</p>
                  <p className="text-xs text-muted-foreground">Departments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>
                  {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? "s" : ""} found
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Employee</TableHead>
                    <TableHead className="hidden md:table-cell">Department</TableHead>
                    <TableHead className="hidden lg:table-cell">Contact</TableHead>
                    <TableHead className="hidden lg:table-cell">Hire Date</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No employees found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id} className="group">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-border">
                              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                {employee.first_name[0]}{employee.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">
                                {employee.first_name} {employee.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {employee.employee_id} {employee.position && `• ${employee.position}`}
                              </p>
                              <p className="text-xs text-muted-foreground md:hidden">
                                {employee.departments?.name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="font-normal">
                            {employee.departments?.name || "Unassigned"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-sm">
                              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground">{employee.email}</span>
                            </div>
                            {employee.phone && (
                              <div className="flex items-center gap-1.5 text-sm">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground">{employee.phone}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {employee.hire_date 
                              ? new Date(employee.hire_date).toLocaleDateString("en-US", { 
                                  year: "numeric", 
                                  month: "short", 
                                  day: "numeric" 
                                })
                              : "Not set"
                            }
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteEmployee(employee)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteEmployee} onOpenChange={() => setDeleteEmployee(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {deleteEmployee?.first_name} {deleteEmployee?.last_name}
              </span>{" "}
              from the system? This action will deactivate their account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Removing...
                </>
              ) : (
                "Remove Employee"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
