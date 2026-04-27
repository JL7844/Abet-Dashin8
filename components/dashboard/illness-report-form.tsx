"use client"

import { useState } from "react"
import { FileText, Calendar, Send, CheckCircle2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"

interface Employee {
  id: string
  employee_id: string
  first_name: string
  last_name: string
}

interface IllnessReportFormProps {
  employees?: Employee[]
  onSubmit?: (data: IllnessFormData) => void
}

interface IllnessFormData {
  employeeId: string
  employeeName: string
  illnessType: string
  startDate: string
  endDate: string
  symptoms: string
  hasMedicalCertificate: boolean
  additionalNotes: string
}

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

export function IllnessReportForm({ employees = [], onSubmit }: IllnessReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("")
  const [formData, setFormData] = useState<IllnessFormData>({
    employeeId: "",
    employeeName: "",
    illnessType: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    symptoms: "",
    hasMedicalCertificate: false,
    additionalNotes: "",
  })

  const handleEmployeeSelect = (employeeUuid: string) => {
    setSelectedEmployeeId(employeeUuid)
    const employee = employees.find(e => e.id === employeeUuid)
    if (employee) {
      setFormData(prev => ({
        ...prev,
        employeeId: employee.employee_id,
        employeeName: `${employee.first_name} ${employee.last_name}`
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/illness-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_uuid: selectedEmployeeId,
          illness_type: formData.illnessType,
          start_date: formData.startDate,
          end_date: formData.endDate,
          symptoms: formData.symptoms,
          has_medical_certificate: formData.hasMedicalCertificate,
          additional_notes: formData.additionalNotes,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setReferenceNumber(data.reference_number)
        setIsSubmitted(true)
        onSubmit?.(formData)
      }
    } catch (error) {
      console.error("Failed to submit illness report:", error)
    } finally {
      setIsSubmitting(false)
    }

    // Reset after showing success
    setTimeout(() => {
      setIsSubmitted(false)
      setReferenceNumber(null)
      setSelectedEmployeeId("")
      setFormData({
        employeeId: "",
        employeeName: "",
        illnessType: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        symptoms: "",
        hasMedicalCertificate: false,
        additionalNotes: "",
      })
    }, 3000)
  }

  const updateField = <K extends keyof IllnessFormData>(
    field: K,
    value: IllnessFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Report Submitted</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your illness report has been sent to HR for review.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Reference: {referenceNumber || `IR-${Date.now().toString().slice(-6)}`}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-primary" />
          Illness Report
        </CardTitle>
        <CardDescription>
          Submit a sick leave request for approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="employee">Select Employee</FieldLabel>
            <Select
              value={selectedEmployeeId}
              onValueChange={handleEmployeeSelect}
              required
            >
              <SelectTrigger id="employee">
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.employee_id} - {emp.first_name} {emp.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="employeeId">Employee ID</FieldLabel>
                <Input
                  id="employeeId"
                  placeholder="e.g., EMP001"
                  value={formData.employeeId}
                  readOnly
                  className="bg-muted"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="employeeName">Full Name</FieldLabel>
                <Input
                  id="employeeName"
                  placeholder="Employee name"
                  value={formData.employeeName}
                  readOnly
                  className="bg-muted"
                />
              </Field>
            </div>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor="illnessType">Type of Illness</FieldLabel>
            <Select
              value={formData.illnessType}
              onValueChange={(value) => updateField("illnessType", value)}
              required
            >
              <SelectTrigger id="illnessType">
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
                <FieldLabel htmlFor="startDate">
                  <Calendar className="mr-1.5 inline h-3.5 w-3.5" />
                  Start Date
                </FieldLabel>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="endDate">
                  <Calendar className="mr-1.5 inline h-3.5 w-3.5" />
                  End Date
                </FieldLabel>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  min={formData.startDate}
                  onChange={(e) => updateField("endDate", e.target.value)}
                  required
                />
              </Field>
            </div>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor="symptoms">Symptoms / Description</FieldLabel>
            <Textarea
              id="symptoms"
              placeholder="Describe your symptoms or condition..."
              value={formData.symptoms}
              onChange={(e) => updateField("symptoms", e.target.value)}
              rows={3}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="additionalNotes">Additional Notes (Optional)</FieldLabel>
            <Textarea
              id="additionalNotes"
              placeholder="Any additional information for HR..."
              value={formData.additionalNotes}
              onChange={(e) => updateField("additionalNotes", e.target.value)}
              rows={2}
            />
          </Field>

          <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-3">
            <Checkbox
              id="hasMedicalCertificate"
              checked={formData.hasMedicalCertificate}
              onCheckedChange={(checked) =>
                updateField("hasMedicalCertificate", checked === true)
              }
            />
            <div className="flex-1">
              <label
                htmlFor="hasMedicalCertificate"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                I have a medical certificate
              </label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Required for sick leave exceeding 2 days
              </p>
            </div>
            <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
            disabled={isSubmitting}
          >
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
      </CardContent>
    </Card>
  )
}
