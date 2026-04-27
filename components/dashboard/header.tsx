"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { PlayCircle, StopCircle, Clock, Settings, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardHeaderProps {
  isSessionActive: boolean
  sessionStartTime?: string
  isDemoMode?: boolean
  onToggleSession: () => void
}

export function DashboardHeader({ isSessionActive, sessionStartTime, isDemoMode, onToggleSession }: DashboardHeaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [elapsedTime, setElapsedTime] = useState("")

  useEffect(() => {
    if (!isSessionActive || !sessionStartTime) {
      setElapsedTime("")
      return
    }

    const updateElapsed = () => {
      const start = new Date(sessionStartTime).getTime()
      const now = Date.now()
      const diff = now - start
      
      const hours = Math.floor(diff / 3600000)
      const minutes = Math.floor((diff % 3600000) / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      
      if (hours > 0) {
        setElapsedTime(`${hours}h ${minutes}m`)
      } else if (minutes > 0) {
        setElapsedTime(`${minutes}m ${seconds}s`)
      } else {
        setElapsedTime(`${seconds}s`)
      }
    }

    updateElapsed()
    const interval = setInterval(updateElapsed, 1000)
    return () => clearInterval(interval)
  }, [isSessionActive, sessionStartTime])

  const handleToggle = async () => {
    setIsLoading(true)
    await onToggleSession()
    setIsLoading(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:px-6">
      <div className="container mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-white p-1 shadow-sm ring-1 ring-border">
            <Image
              src="/images/dashen-bank-logo.png"
              alt="Dashen Bank Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Dashen Bank</h1>
            <p className="text-sm text-muted-foreground">Employee Attendance System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href="/user">
              <UserCircle className="h-4 w-4" />
              <span className="hidden sm:inline">My Profile</span>
            </Link>
          </Button>
          
          <Button variant="outline" size="sm" asChild className="gap-2">
            <Link href="/admin">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </Button>
          
          {isDemoMode && (
            <Badge variant="outline" className="gap-1.5 border-warning/50 bg-warning/10 text-warning-foreground">
              Demo Mode
            </Badge>
          )}
          
          {isSessionActive && elapsedTime && (
            <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/5 text-primary">
              <Clock className="h-3 w-3" />
              {elapsedTime}
            </Badge>
          )}
          
          <Badge 
            variant={isSessionActive ? "default" : "secondary"}
            className={`px-3 py-1 ${
              isSessionActive 
                ? "bg-success text-success-foreground" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            <span 
              className={`mr-2 h-2 w-2 rounded-full ${
                isSessionActive 
                  ? "animate-pulse bg-success-foreground" 
                  : "bg-muted-foreground"
              }`} 
            />
            {isSessionActive ? "Session Active" : "Session Ended"}
          </Badge>
          
          <Button 
            onClick={handleToggle}
            variant={isSessionActive ? "destructive" : "default"}
            size="lg"
            className={`gap-2 font-semibold transition-all ${
              !isSessionActive 
                ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30" 
                : "hover:bg-destructive/90"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4" />
                <span className="hidden sm:inline">{isSessionActive ? "Ending..." : "Starting..."}</span>
              </>
            ) : isSessionActive ? (
              <>
                <StopCircle className="h-4 w-4" />
                <span className="hidden sm:inline">End Session</span>
                <span className="sm:hidden">End</span>
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4 animate-pulse" />
                <span className="hidden sm:inline">Start Session</span>
                <span className="sm:hidden">Start</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
