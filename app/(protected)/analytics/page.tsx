"use client"

import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { DateRangePicker } from "@/components/reports/date-range-picker"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Interactive analytics and data visualization</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row animate-slide-up">
          <DateRangePicker />
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <AnalyticsDashboard />
      </div>
    </div>
  )
}

