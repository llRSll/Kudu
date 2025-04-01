import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ReportTemplates } from "@/components/reports/report-templates"
import { RecentReports } from "@/components/reports/recent-reports"
import { DateRangePicker } from "@/components/reports/date-range-picker"

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate insights and analyze your wealth portfolio</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <DateRangePicker />
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Custom Report
          </Button>
        </div>
      </div>

      <RecentReports />
      <ReportTemplates />
    </div>
  )
}

