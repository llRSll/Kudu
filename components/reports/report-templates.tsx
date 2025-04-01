"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Building2,
  Calendar,
  CreditCard,
  DollarSign,
  FileBarChart,
  FileSpreadsheet,
  FileText,
  LineChart,
  PieChart,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DateRangePicker } from "@/components/reports/date-range-picker"

// Sample data for report templates
const reportTemplates = [
  {
    id: 1,
    name: "Portfolio Performance",
    description: "Comprehensive analysis of investment performance across all assets",
    category: "investments",
    icon: TrendingUp,
    formats: ["PDF", "Excel"],
    frequency: "Monthly, Quarterly, Annual",
    popular: true,
  },
  {
    id: 2,
    name: "Asset Allocation",
    description: "Breakdown of asset allocation with recommendations",
    category: "investments",
    icon: PieChart,
    formats: ["PDF", "Excel"],
    frequency: "Monthly, Quarterly",
    popular: true,
  },
  {
    id: 3,
    name: "Cash Flow Analysis",
    description: "Detailed cash flow analysis and projections",
    category: "financial",
    icon: LineChart,
    formats: ["PDF", "Excel"],
    frequency: "Monthly, Quarterly, Annual",
    popular: true,
  },
  {
    id: 4,
    name: "Net Worth Statement",
    description: "Comprehensive net worth statement with trends",
    category: "financial",
    icon: DollarSign,
    formats: ["PDF"],
    frequency: "Monthly, Quarterly, Annual",
    popular: true,
  },
  {
    id: 5,
    name: "Real Estate Performance",
    description: "Analysis of real estate portfolio performance",
    category: "properties",
    icon: Building2,
    formats: ["PDF", "Excel"],
    frequency: "Quarterly, Annual",
    popular: false,
  },
  {
    id: 6,
    name: "Credit Facility Overview",
    description: "Summary of all credit facilities and debt obligations",
    category: "credit",
    icon: CreditCard,
    formats: ["PDF"],
    frequency: "Quarterly",
    popular: false,
  },
  {
    id: 7,
    name: "Entity Structure Analysis",
    description: "Analysis of corporate structure and entity relationships",
    category: "entities",
    icon: Users,
    formats: ["PDF"],
    frequency: "Annual",
    popular: false,
  },
  {
    id: 8,
    name: "Tax Planning Report",
    description: "Tax planning strategies and liability projections",
    category: "tax",
    icon: Calendar,
    formats: ["PDF", "Excel"],
    frequency: "Quarterly, Annual",
    popular: true,
  },
  {
    id: 9,
    name: "Investment Performance Attribution",
    description: "Detailed attribution analysis of investment performance",
    category: "investments",
    icon: BarChart3,
    formats: ["PDF", "Excel"],
    frequency: "Quarterly, Annual",
    popular: false,
  },
]

export function ReportTemplates() {
  const [selectedReport, setSelectedReport] = useState(null)

  const getFormatIcon = (format) => {
    switch (format) {
      case "PDF":
        return <FileText className="h-4 w-4 text-red-500" />
      case "Excel":
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />
      default:
        return <FileBarChart className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates.map((template) => (
              <ReportTemplateCard key={template.id} template={template} onSelect={() => setSelectedReport(template)} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="investments" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates
              .filter((t) => t.category === "investments")
              .map((template) => (
                <ReportTemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => setSelectedReport(template)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="financial" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates
              .filter((t) => t.category === "financial")
              .map((template) => (
                <ReportTemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => setSelectedReport(template)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="properties" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates
              .filter((t) => t.category === "properties")
              .map((template) => (
                <ReportTemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => setSelectedReport(template)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="other" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reportTemplates
              .filter((t) => !["investments", "financial", "properties"].includes(t.category))
              .map((template) => (
                <ReportTemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => setSelectedReport(template)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog>
        <DialogTrigger className="hidden" id="report-dialog-trigger">
          Open
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>Generate {selectedReport.name} Report</DialogTitle>
                <DialogDescription>Configure your report parameters and generate the report.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input
                    id="report-name"
                    defaultValue={selectedReport.name}
                    placeholder="Enter a name for this report"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Date Range</Label>
                  <DateRangePicker />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="format">Format</Label>
                  <Select defaultValue={selectedReport.formats[0]}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedReport.formats.map((format) => (
                        <SelectItem key={format} value={format}>
                          <div className="flex items-center">
                            {getFormatIcon(format)}
                            <span className="ml-2">{format}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Report Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-charts" defaultChecked />
                      <label
                        htmlFor="include-charts"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include charts and visualizations
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-summary" defaultChecked />
                      <label
                        htmlFor="include-summary"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include executive summary
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-recommendations" defaultChecked />
                      <label
                        htmlFor="include-recommendations"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include recommendations
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="schedule">Schedule (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Generate once" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">Generate once</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Generate Report</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )

  function ReportTemplateCard({ template, onSelect }) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mr-3">
                <template.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription className="mt-1">{template.description}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available formats:</span>
              <div className="flex items-center gap-2">
                {template.formats.map((format) => (
                  <div key={format} className="flex items-center">
                    {getFormatIcon(format)}
                    <span className="ml-1">{format}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Frequency:</span>
              <span>{template.frequency}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Category:</span>
              <span className="capitalize">{template.category}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-3">
          <Button
            className="w-full"
            onClick={() => {
              onSelect()
              document.getElementById("report-dialog-trigger")?.click()
            }}
          >
            Generate Report
          </Button>
        </CardFooter>
      </Card>
    )
  }
}

