"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  MoreHorizontal,
  Percent,
  TrendingUp,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample data for credit facilities
const creditFacilities = [
  {
    id: 1,
    name: "Bank of America Commercial Line",
    type: "Line of Credit",
    bank: "Bank of America",
    limit: 5000000,
    used: 3200000,
    interestRate: 4.25,
    interestType: "Variable",
    baseRate: "SOFR",
    spread: 2.5,
    maturityDate: "2027-06-15",
    paymentSchedule: "Monthly",
    collateral: [
      { type: "Property", name: "123 Main Street", value: 4500000 },
      { type: "Property", name: "Downtown Office Building", value: 2000000 },
    ],
    status: "active",
    covenants: [
      { name: "Debt Service Coverage Ratio", requirement: "> 1.25x", current: "1.4x", status: "compliant" },
      { name: "Loan-to-Value Ratio", requirement: "< 75%", current: "65%", status: "compliant" },
    ],
  },
  {
    id: 2,
    name: "JP Morgan Real Estate Loan",
    type: "Term Loan",
    bank: "JP Morgan Chase",
    limit: 3000000,
    used: 1800000,
    interestRate: 3.85,
    interestType: "Fixed",
    baseRate: "N/A",
    spread: 0,
    maturityDate: "2030-03-22",
    paymentSchedule: "Monthly",
    collateral: [
      { type: "Property", name: "Oceanview Condo", value: 1800000 },
      { type: "Property", name: "Sunset Heights Apartment Complex", value: 1500000 },
    ],
    status: "active",
    covenants: [
      { name: "Debt Service Coverage Ratio", requirement: "> 1.35x", current: "1.5x", status: "compliant" },
      { name: "Loan-to-Value Ratio", requirement: "< 70%", current: "55%", status: "compliant" },
    ],
  },
  {
    id: 3,
    name: "Wells Fargo Investment Facility",
    type: "Margin Loan",
    bank: "Wells Fargo",
    limit: 2500000,
    used: 1200000,
    interestRate: 5.15,
    interestType: "Variable",
    baseRate: "Prime",
    spread: 1.25,
    maturityDate: "2026-09-30",
    paymentSchedule: "Quarterly",
    collateral: [
      { type: "Investment", name: "Global Macro Fund", value: 2000000 },
      { type: "Investment", name: "Momentum Strategy", value: 1500000 },
    ],
    status: "active",
    covenants: [{ name: "Margin Requirement", requirement: "> 40%", current: "55%", status: "compliant" }],
  },
  {
    id: 4,
    name: "Citibank Development Loan",
    type: "Construction Loan",
    bank: "Citibank",
    limit: 4000000,
    used: 2500000,
    interestRate: 4.75,
    interestType: "Variable",
    baseRate: "SOFR",
    spread: 3.0,
    maturityDate: "2025-12-01",
    paymentSchedule: "Interest Only",
    collateral: [{ type: "Property", name: "Mountain View Development", value: 3500000 }],
    status: "active",
    covenants: [
      { name: "Completion Deadline", requirement: "Dec 2025", current: "On Schedule", status: "compliant" },
      { name: "Budget Variance", requirement: "< 10%", current: "8%", status: "compliant" },
      { name: "Loan-to-Cost Ratio", requirement: "< 80%", current: "75%", status: "compliant" },
    ],
  },
  {
    id: 5,
    name: "First Republic Private Banking Line",
    type: "Line of Credit",
    bank: "First Republic",
    limit: 1500000,
    used: 0,
    interestRate: 4.5,
    interestType: "Variable",
    baseRate: "Prime",
    spread: 0.5,
    maturityDate: "2028-05-15",
    paymentSchedule: "Monthly",
    collateral: [{ type: "Investment", name: "Diversified Portfolio", value: 3000000 }],
    status: "inactive",
    covenants: [{ name: "Minimum Liquidity", requirement: "> $1M", current: "$2.5M", status: "compliant" }],
  },
]

export function CreditFacilitiesList() {
  const [view, setView] = useState("grid")

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Facilities</TabsTrigger>
            <TabsTrigger value="lines">Lines of Credit</TabsTrigger>
            <TabsTrigger value="term">Term Loans</TabsTrigger>
            <TabsTrigger value="other">Other Facilities</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant={view === "grid" ? "default" : "outline"} size="sm" onClick={() => setView("grid")}>
              Grid
            </Button>
            <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
              List
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-4">
          {view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {creditFacilities.map((facility) => (
                <CreditFacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {creditFacilities.map((facility) => (
                <CreditFacilityListItem key={facility.id} facility={facility} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="lines" className="mt-4">
          {view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {creditFacilities
                .filter((f) => f.type === "Line of Credit")
                .map((facility) => (
                  <CreditFacilityCard key={facility.id} facility={facility} />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {creditFacilities
                .filter((f) => f.type === "Line of Credit")
                .map((facility) => (
                  <CreditFacilityListItem key={facility.id} facility={facility} />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="term" className="mt-4">
          {view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {creditFacilities
                .filter((f) => f.type === "Term Loan")
                .map((facility) => (
                  <CreditFacilityCard key={facility.id} facility={facility} />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {creditFacilities
                .filter((f) => f.type === "Term Loan")
                .map((facility) => (
                  <CreditFacilityListItem key={facility.id} facility={facility} />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="other" className="mt-4">
          {view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {creditFacilities
                .filter((f) => f.type !== "Line of Credit" && f.type !== "Term Loan")
                .map((facility) => (
                  <CreditFacilityCard key={facility.id} facility={facility} />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {creditFacilities
                .filter((f) => f.type !== "Line of Credit" && f.type !== "Term Loan")
                .map((facility) => (
                  <CreditFacilityListItem key={facility.id} facility={facility} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CreditFacilityCard({ facility }) {
  const utilizationRate = (facility.used / facility.limit) * 100
  const maturityDate = new Date(facility.maturityDate)
  const formattedMaturityDate = maturityDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Check if any covenants are non-compliant
  const hasCovenantIssues = facility.covenants.some((c) => c.status !== "compliant")

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center">
              {facility.name}
              {hasCovenantIssues && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle className="ml-2 h-4 w-4 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Covenant compliance issues</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
            <CardDescription className="mt-1 flex items-center">
              <CreditCard className="mr-1 h-3 w-3" />
              {facility.bank} • {facility.type}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={facility.status === "inactive" ? "secondary" : "default"}>
              {facility.status === "inactive" ? "Inactive" : "Active"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Facility</DropdownMenuItem>
                <DropdownMenuItem>Upload Documents</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Draw Funds</DropdownMenuItem>
                <DropdownMenuItem>Make Payment</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Credit Limit</p>
            <p className="font-medium">${facility.limit.toLocaleString()}</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Amount Used</p>
            <p className="font-medium">${facility.used.toLocaleString()}</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Interest Rate</p>
            <p className="font-medium">
              {facility.interestRate}%
              <span className="text-xs text-muted-foreground ml-1">({facility.interestType})</span>
            </p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Maturity Date</p>
            <p className="font-medium">{formattedMaturityDate}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm">Utilization</p>
            <p className="text-sm font-medium">{utilizationRate.toFixed(1)}%</p>
          </div>
          <Progress value={utilizationRate} className="mt-2" />
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Collateral</p>
          <div className="space-y-2">
            {facility.collateral.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  {item.type === "Property" ? (
                    <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                  ) : (
                    <TrendingUp className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <span>{item.name}</span>
                </div>
                <span>${item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {facility.covenants.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Covenants</p>
            <div className="space-y-2">
              {facility.covenants.map((covenant, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{covenant.name}</span>
                  <div className="flex items-center">
                    <span className="mr-2">{covenant.current}</span>
                    <Badge variant={covenant.status === "compliant" ? "outline" : "destructive"} className="text-xs">
                      {covenant.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Documents
        </Button>
        <Button size="sm" className="w-full">
          <TrendingUp className="mr-2 h-4 w-4" />
          Payment History
        </Button>
      </CardFooter>
    </Card>
  )
}

function CreditFacilityListItem({ facility }) {
  const utilizationRate = (facility.used / facility.limit) * 100
  const maturityDate = new Date(facility.maturityDate)
  const formattedMaturityDate = maturityDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Check if any covenants are non-compliant
  const hasCovenantIssues = facility.covenants.some((c) => c.status !== "compliant")

  return (
    <Card>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold flex items-center">
                {facility.name}
                {hasCovenantIssues && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="ml-2 h-4 w-4 text-amber-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Covenant compliance issues</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {facility.bank} • {facility.type}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Badge variant={facility.status === "inactive" ? "secondary" : "default"}>
              {facility.status === "inactive" ? "Inactive" : "Active"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Edit Facility</DropdownMenuItem>
                <DropdownMenuItem>Upload Documents</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Draw Funds</DropdownMenuItem>
                <DropdownMenuItem>Make Payment</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-sm text-muted-foreground">Credit Limit</p>
            <p className="font-medium">${facility.limit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount Used</p>
            <p className="font-medium">${facility.used.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Interest Rate</p>
            <p className="font-medium">
              {facility.interestRate}%
              <span className="text-xs text-muted-foreground ml-1">({facility.interestType})</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Maturity Date</p>
            <p className="font-medium">{formattedMaturityDate}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm">Utilization</p>
            <p className="text-sm font-medium">{utilizationRate.toFixed(1)}%</p>
          </div>
          <Progress value={utilizationRate} className="mt-2" />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Payment Schedule
          </Button>
          <Button variant="outline" size="sm">
            <Percent className="mr-2 h-4 w-4" />
            Covenants
          </Button>
          <Button size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Payment History
          </Button>
        </div>
      </div>
    </Card>
  )
}

