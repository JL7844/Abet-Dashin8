"use client"

import { useEffect, useRef } from "react"
import { CheckCircle2, AlertTriangle, Clock, Info, Activity, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface ActivityLog {
  id: string
  employeeName: string
  action: string
  status: "verified" | "pending" | "suspicious"
  timestamp: string
}

interface ActivityFeedProps {
  logs: ActivityLog[]
  isSessionActive?: boolean
}

const statusConfig = {
  verified: {
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  pending: {
    icon: Clock,
    color: "text-warning-foreground",
    bgColor: "bg-warning/10",
  },
  suspicious: {
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
}

export function ActivityFeed({ logs, isSessionActive = false }: ActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevLogsLengthRef = useRef(logs.length)

  // Auto-scroll to top when new logs arrive
  useEffect(() => {
    if (logs.length > prevLogsLengthRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
    prevLogsLengthRef.current = logs.length
  }, [logs.length])

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-primary" />
            Activity Feed
          </CardTitle>
          {isSessionActive && (
            <Badge variant="outline" className="gap-1.5 border-success/30 bg-success/10 text-success">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
              </span>
              Live
            </Badge>
          )}
        </div>
        <CardDescription>
          {isSessionActive 
            ? `${logs.length} events recorded`
            : "Start a session to see activity"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[320px] px-6 pb-6" ref={scrollRef}>
          <div className="space-y-4">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Info className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No activity yet</p>
              </div>
            ) : (
              logs.map((log, index) => {
                const config = statusConfig[log.status] || statusConfig.pending
                const Icon = config.icon
                
                return (
                  <div 
                    key={log.id} 
                    className={`flex items-start gap-3 ${
                      index === 0 ? "animate-in slide-in-from-top-2 fade-in duration-300" : ""
                    }`}
                  >
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm leading-relaxed">
                        <span className="font-medium text-foreground">{log.employeeName}</span>
                        {" "}
                        <span className="text-muted-foreground">{log.action === "check_in" ? "checked in" : log.action}</span>
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">{log.timestamp}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
