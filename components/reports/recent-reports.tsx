import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Download, FileBarChart, FileSpreadsheet, FileText, MoreHorizontal, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data for recent reports
const recentReports = [
  {
    id: 1,
    name: "Quarterly Portfolio Performance",
    type: "Performance",
    format: "PDF",
    dateRange: "Jan 1, 2025 - Mar 31, 2025",
    generatedAt: "2025-04-02T10:15:00",
    generatedBy: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    status: "completed",
  },
  {
    id: 2,
    name: "Asset Allocation Analysis",
    type: "Allocation",
    format: "Excel",
    dateRange: "YTD 2025",
    generatedAt: "2025-03-28T14:30:00",
    generatedBy: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MC",
    },
    status: "completed",
  },
  {
    id: 3,
    name: "Cash Flow Projection",
    type: "Cash Flow",
    format: "PDF",
    dateRange: "Apr 1, 2025 - Dec 31, 2025",
    generatedAt: "2025-03-25T09:45:00",
    generatedBy: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SJ",
    },
    status: "completed",
  },
  {
    id: 4,
    name: "Tax Liability Estimate",
    type: "Tax",
    format: "PDF",
    dateRange: "Jan 1, 2025 - Dec 31, 2025",
    generatedAt: "2025-03-20T11:20:00",
    generatedBy: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AR",
    },
    status: "completed",
  },
  {
    id: 5,
    name: "Real Estate Portfolio Analysis",
    type: "Real Estate",
    format: "Excel",
    dateRange: "Last 12 Months",
    generatedAt: null,
    generatedBy: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    status: "processing",
  },
]

export function RecentReports() {
  const formatDate = (dateString) => {
    if (!dateString) return "Processing..."

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getReportIcon = (format) => {
    switch (format) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-500" />
      case "Excel":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />
      default:
        return <FileBarChart className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "processing":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Processing
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Recently generated reports and analyses</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium">Report</th>
                <th className="p-3 text-left font-medium">Date Range</th>
                <th className="p-3 text-left font-medium">Generated</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id} className="border-b">
                  <td className="p-3">
                    <div className="flex items-center">
                      {getReportIcon(report.format)}
                      <div className="ml-3">
                        <p className="font-medium">{report.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {report.type} • {report.format}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="text-sm">{report.dateRange}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={report.generatedBy.avatar} alt={report.generatedBy.name} />
                        <AvatarFallback>{report.generatedBy.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{report.generatedBy.name}</span>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {formatDate(report.generatedAt)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{getStatusBadge(report.status)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {report.status === "completed" && (
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {report.status === "completed" && (
                            <>
                              <DropdownMenuItem>View Report</DropdownMenuItem>
                              <DropdownMenuItem>Download</DropdownMenuItem>
                              <DropdownMenuItem>Share</DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem>Regenerate</DropdownMenuItem>
                          <DropdownMenuItem>Schedule</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

