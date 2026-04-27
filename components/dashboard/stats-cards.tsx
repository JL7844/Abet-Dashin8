"use client"

import { Users, CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SessionStats {
  totalEmployees: number
  verified: number
  pending: number
  suspicious: number
}

interface StatsCardsProps {
  stats: SessionStats
  isSessionActive?: boolean
}

export function StatsCards({ stats, isSessionActive = false }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Verified",
      value: stats.verified,
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-warning-foreground",
      bgColor: "bg-warning/10",
    },
    {
      title: "Suspicious",
      value: stats.suspicious,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card 
          key={card.title} 
          className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
            isSessionActive ? "animate-in fade-in slide-in-from-bottom-2" : ""
          }`}
          style={{ animationDelay: isSessionActive ? `${index * 100}ms` : "0ms" }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bgColor} transition-transform ${isSessionActive ? "scale-100" : "scale-95"}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold tracking-tight text-foreground transition-all ${isSessionActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground">{card.title}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
