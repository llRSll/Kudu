import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { DateRangePicker } from "@/components/reports/date-range-picker"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Interactive analytics and data visualization</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <DateRangePicker />
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <AnalyticsDashboard />
    </div>
  )
}

