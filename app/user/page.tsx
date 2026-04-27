"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Send,
  Activity,
  TrendingUp,
  CalendarDays,
  Edit3,
  Upload,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Example user data for demo mode
const exampleUser = {
  id: "1",
  employee_id: "EMP001",
  first_name: "Yoseph",
  last_name: "Legesse",
  email: "yoseph.legesse@dashenbank.com",
  phone: "+251911234567",
  position: "Branch Manager",
  hire_date: "2020-03-15",
  profile_image: null,
  departments: { id: "1", name: "Operations" },
}

// Example attendance history
const exampleAttendanceHistory = [
  { date: "2026-04-25", checkIn: "08:32 AM", checkOut: "05:45 PM", status: "verified" },
  { date: "2026-04-24", checkIn: "08:15 AM", checkOut: "05:30 PM", status: "verified" },
  { date: "2026-04-23", checkIn: "08:45 AM", checkOut: "06:00 PM", status: "verified" },
  { date: "2026-04-22", checkIn: "09:02 AM", checkOut: "05:15 PM", status: "pending" },
  { date: "2026-04-21", checkIn: "08:20 AM", checkOut: "05:40 PM", status: "verified" },
]

// Example illness reports
const exampleIllnessReports = [
  { id: "1", date: "2026-04-10", type: "Fever / Flu", status: "approved", days: 2 },
  { id: "2", date: "2026-03-15", type: "Stomach Issues", status: "approved", days: 1 },
]

const ILLNESS_TYPES = [
  { value: "fever", label: "Fever / Flu" },
  { value: "cold", label: "Common Cold" },
  { value: "stomach", label: "Stomach Issues" },
  { value: "headache", label: "Severe Headache / Migraine" },
  { value: "injury", label: "Physical Injury" },
  { value: "covid", label: "COVID-19 Related" },
  { value: "mental", label: "Mental Health Day" },
  { value: "other", label: "Other Medical Condition" },
]

export default function UserPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    position: "",
  })
  
  const [formData, setFormData] = useState({
    illnessType: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    symptoms: "",
    hasMedicalCertificate: false,
    additionalNotes: "",
  })

  // Fetch user data - in a real app, this would use auth context
  const { data: employees } = useSWR("/api/employees", fetcher)
  const isDemoMode = !employees || employees.length === 0
  const currentUser = isDemoMode ? exampleUser : employees?.[0]

  // Stats calculations
  const attendanceRate = 96 // Example percentage
  const totalDaysWorked = 215
  const sickDaysTaken = 3
  const remainingSickDays = 12

  const handleOpenEditDialog = () => {
    if (currentUser) {
      setEditFormData({
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        position: currentUser.position || "",
      })
    }
    setIsEditDialogOpen(true)
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    // In a real app, this would save to the database
    // For demo, just close the dialog
    setIsEditDialogOpen(false)
  }

  const handleSubmitIllness = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setReferenceNumber(`ILL-${Date.now().toString(36).toUpperCase()}`)
    setIsSubmitted(true)
    setIsSubmitting(false)

    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false)
      setReferenceNumber(null)
      setFormData({
        illnessType: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        symptoms: "",
        hasMedicalCertificate: false,
        additionalNotes: "",
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
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
                <h1 className="text-lg font-bold text-foreground">Employee Portal</h1>
                <p className="text-xs text-muted-foreground">My Account</p>
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
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Profile */}
          <div className="space-y-6 lg:col-span-4">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-primary/10">
                      {profileImage ? (
                        <Image
                          src={profileImage}
                          alt="Profile"
                          width={96}
                          height={96}
                          className="h-24 w-24 object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                          {currentUser?.first_name?.[0]}{currentUser?.last_name?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <label
                      htmlFor="profile-image-input"
                      className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                    >
                      <Upload className="h-4 w-4" />
                      <input
                        id="profile-image-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileImageUpload}
                      />
                    </label>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-foreground">
                    {currentUser?.first_name} {currentUser?.last_name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{currentUser?.position}</p>
                  <Badge variant="outline" className="mt-2 gap-1.5">
                    <Building2 className="h-3 w-3" />
                    {currentUser?.departments?.name}
                  </Badge>
                  <Button
                    onClick={handleOpenEditDialog}
                    variant="outline"
                    className="mt-4 w-full gap-2"
                    size="sm"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Employee ID</p>
                      <p className="font-medium">{currentUser?.employee_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{currentUser?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{currentUser?.phone || "+251..."}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Hire Date</p>
                      <p className="font-medium">
                        {currentUser?.hire_date 
                          ? new Date(currentUser.hire_date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "N/A"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-primary" />
                  Attendance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Attendance Rate</span>
                    <span className="font-bold text-success">{attendanceRate}%</span>
                  </div>
                  <Progress value={attendanceRate} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{totalDaysWorked}</p>
                    <p className="text-xs text-muted-foreground">Days Worked</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{sickDaysTaken}</p>
                    <p className="text-xs text-muted-foreground">Sick Days Used</p>
                  </div>
                </div>
                <div className="rounded-lg bg-success/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Remaining Sick Days</span>
                    <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                      {remainingSickDays} days
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="illness" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="illness" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Illness Report</span>
                  <span className="sm:hidden">Report</span>
                </TabsTrigger>
                <TabsTrigger value="attendance" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span className="hidden sm:inline">Attendance History</span>
                  <span className="sm:hidden">History</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">My Reports</span>
                  <span className="sm:hidden">Reports</span>
                </TabsTrigger>
              </TabsList>

              {/* Illness Report Tab */}
              <TabsContent value="illness">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Submit Illness Report
                    </CardTitle>
                    <CardDescription>
                      Report sick leave for approval by HR
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                          <CheckCircle2 className="h-8 w-8 text-success" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">Report Submitted</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Your illness report has been sent to HR for review.
                        </p>
                        <p className="mt-3 text-xs text-muted-foreground">
                          Reference: {referenceNumber}
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitIllness} className="space-y-4">
                        <div className="rounded-lg border bg-muted/30 p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
                                {currentUser?.first_name?.[0]}{currentUser?.last_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{currentUser?.first_name} {currentUser?.last_name}</p>
                              <p className="text-sm text-muted-foreground">{currentUser?.employee_id}</p>
                            </div>
                          </div>
                        </div>

                        <Field>
                          <FieldLabel>Type of Illness *</FieldLabel>
                          <Select
                            value={formData.illnessType}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, illnessType: value }))}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select illness type" />
                            </SelectTrigger>
                            <SelectContent>
                              {ILLNESS_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>

                        <FieldGroup>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field>
                              <FieldLabel>
                                <Calendar className="mr-1.5 inline h-3.5 w-3.5" />
                                Start Date *
                              </FieldLabel>
                              <Input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                required
                              />
                            </Field>
                            <Field>
                              <FieldLabel>
                                <Calendar className="mr-1.5 inline h-3.5 w-3.5" />
                                End Date *
                              </FieldLabel>
                              <Input
                                type="date"
                                value={formData.endDate}
                                min={formData.startDate}
                                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                required
                              />
                            </Field>
                          </div>
                        </FieldGroup>

                        <Field>
                          <FieldLabel>Symptoms / Description *</FieldLabel>
                          <Textarea
                            placeholder="Describe your symptoms or condition..."
                            value={formData.symptoms}
                            onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                            rows={3}
                            required
                          />
                        </Field>

                        <Field>
                          <FieldLabel>Additional Notes (Optional)</FieldLabel>
                          <Textarea
                            placeholder="Any additional information for HR..."
                            value={formData.additionalNotes}
                            onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                            rows={2}
                          />
                        </Field>

                        <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
                          <Checkbox
                            id="hasMedicalCertificate"
                            checked={formData.hasMedicalCertificate}
                            onCheckedChange={(checked) =>
                              setFormData(prev => ({ ...prev, hasMedicalCertificate: checked === true }))
                            }
                          />
                          <div className="flex-1">
                            <label htmlFor="hasMedicalCertificate" className="text-sm font-medium cursor-pointer">
                              I have a medical certificate
                            </label>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Required for sick leave exceeding 2 days
                            </p>
                          </div>
                          <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                        </div>

                        <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Spinner className="h-4 w-4" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Submit Report
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Attendance History Tab */}
              <TabsContent value="attendance">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      Recent Attendance
                    </CardTitle>
                    <CardDescription>
                      Your attendance records for the past week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {exampleAttendanceHistory.map((record, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              <Calendar className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {new Date(record.date).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  In: {record.checkIn}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Out: {record.checkOut}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              record.status === "verified"
                                ? "border-success/50 bg-success/10 text-success"
                                : "border-warning/50 bg-warning/10 text-warning-foreground"
                            }
                          >
                            {record.status === "verified" ? (
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                            ) : (
                              <AlertTriangle className="mr-1 h-3 w-3" />
                            )}
                            {record.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* My Reports Tab */}
              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Submitted Reports
                    </CardTitle>
                    <CardDescription>
                      History of your illness reports
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {exampleIllnessReports.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">No illness reports submitted yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {exampleIllnessReports.map((report) => (
                          <div
                            key={report.id}
                            className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{report.type}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(report.date).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                  {" "}&bull;{" "}{report.days} day{report.days > 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                report.status === "approved"
                                  ? "border-success/50 bg-success/10 text-success"
                                  : report.status === "pending"
                                  ? "border-warning/50 bg-warning/10 text-warning-foreground"
                                  : "border-destructive/50 bg-destructive/10 text-destructive"
                              }
                            >
                              {report.status === "approved" ? (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              ) : report.status === "pending" ? (
                                <Clock className="mr-1 h-3 w-3" />
                              ) : (
                                <XCircle className="mr-1 h-3 w-3" />
                              )}
                              {report.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information below
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* First Name */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                <Input
                  id="first_name"
                  placeholder="First name"
                  value={editFormData.first_name}
                  onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                />
              </Field>
            </FieldGroup>

            {/* Last Name */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                <Input
                  id="last_name"
                  placeholder="Last name"
                  value={editFormData.last_name}
                  onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                />
              </Field>
            </FieldGroup>

            {/* Email */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </Field>
            </FieldGroup>

            {/* Phone */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+251..."
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </Field>
            </FieldGroup>

            {/* Position */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="position">Position</FieldLabel>
                <Input
                  id="position"
                  placeholder="Your position"
                  value={editFormData.position}
                  onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                />
              </Field>
            </FieldGroup>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
