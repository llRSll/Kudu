"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownRight, ArrowUpRight, Code, LineChart, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Line, LineChart as Chart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

const investments = [
  {
    id: 1,
    name: "Momentum Strategy",
    type: "Algorithm",
    description: "Trend-following strategy based on price momentum",
    allocation: 1500000,
    performance: {
      monthly: 2.8,
      ytd: 12.5,
      annual: 18.2,
    },
    status: "active",
    chartData: [
      { month: "Jan", value: 100 },
      { month: "Feb", value: 102 },
      { month: "Mar", value: 105 },
      { month: "Apr", value: 107 },
      { month: "May", value: 109 },
      { month: "Jun", value: 112 },
      { month: "Jul", value: 115 },
      { month: "Aug", value: 118 },
    ],
  },
  {
    id: 2,
    name: "Mean Reversion",
    type: "Algorithm",
    description: "Statistical arbitrage strategy for market inefficiencies",
    allocation: 1200000,
    performance: {
      monthly: -1.2,
      ytd: 8.5,
      annual: 14.3,
    },
    status: "active",
    chartData: [
      { month: "Jan", value: 100 },
      { month: "Feb", value: 103 },
      { month: "Mar", value: 101 },
      { month: "Apr", value: 104 },
      { month: "May", value: 102 },
      { month: "Jun", value: 105 },
      { month: "Jul", value: 103 },
      { month: "Aug", value: 108 },
    ],
  },
  {
    id: 3,
    name: "Global Macro Fund",
    type: "Fund",
    description: "Diversified fund focusing on macroeconomic trends",
    allocation: 2000000,
    performance: {
      monthly: 1.5,
      ytd: 6.8,
      annual: 9.2,
    },
    status: "active",
    chartData: [
      { month: "Jan", value: 100 },
      { month: "Feb", value: 101 },
      { month: "Mar", value: 102 },
      { month: "Apr", value: 103 },
      { month: "May", value: 104 },
      { month: "Jun", value: 106 },
      { month: "Jul", value: 107 },
      { month: "Aug", value: 109 },
    ],
  },
  {
    id: 4,
    name: "Volatility Arbitrage",
    type: "Algorithm",
    description: "Exploits differences between implied and realized volatility",
    allocation: 800000,
    performance: {
      monthly: 3.2,
      ytd: 15.6,
      annual: 22.1,
    },
    status: "active",
    chartData: [
      { month: "Jan", value: 100 },
      { month: "Feb", value: 104 },
      { month: "Mar", value: 108 },
      { month: "Apr", value: 106 },
      { month: "May", value: 110 },
      { month: "Jun", value: 115 },
      { month: "Jul", value: 118 },
      { month: "Aug", value: 122 },
    ],
  },
  {
    id: 5,
    name: "Quantum Strategy",
    type: "Algorithm",
    description: "Machine learning based predictive model in development",
    allocation: 500000,
    performance: {
      monthly: 0,
      ytd: 0,
      annual: 0,
    },
    status: "development",
    chartData: [
      { month: "Jan", value: 100 },
      { month: "Feb", value: 100 },
      { month: "Mar", value: 100 },
      { month: "Apr", value: 100 },
      { month: "May", value: 100 },
      { month: "Jun", value: 100 },
      { month: "Jul", value: 100 },
      { month: "Aug", value: 100 },
    ],
  },
]

export function InvestmentList() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Investments</TabsTrigger>
            <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
            <TabsTrigger value="funds">Funds</TabsTrigger>
            <TabsTrigger value="development">In Development</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {investments.map((investment) => (
              <InvestmentCard key={investment.id} investment={investment} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="algorithms" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {investments
              .filter((i) => i.type === "Algorithm" && i.status === "active")
              .map((investment) => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="funds" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {investments
              .filter((i) => i.type === "Fund")
              .map((investment) => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="development" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {investments
              .filter((i) => i.status === "development")
              .map((investment) => (
                <InvestmentCard key={investment.id} investment={investment} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InvestmentCard({ investment }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{investment.name}</CardTitle>
            <CardDescription className="mt-1">{investment.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={investment.status === "development" ? "secondary" : "default"}>
              {investment.status === "development" ? "Development" : "Active"}
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
                <DropdownMenuItem>Edit Investment</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Backtesting</DropdownMenuItem>
                <DropdownMenuItem>Performance Analysis</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Allocation</p>
            <p className="font-medium">${investment.allocation.toLocaleString()}</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="font-medium">{investment.type}</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">YTD Return</p>
            <p
              className={`font-medium ${investment.performance.ytd > 0 ? "text-green-500" : investment.performance.ytd < 0 ? "text-red-500" : ""}`}
            >
              {investment.performance.ytd > 0 ? "+" : ""}
              {investment.performance.ytd}%
            </p>
          </div>
        </div>

        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <Chart data={investment.chartData}>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis hide={true} domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip formatter={(value) => [`${value}`, "Value"]} labelFormatter={(label) => `Month: ${label}`} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={investment.performance.monthly >= 0 ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                dot={false}
              />
            </Chart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-sm font-medium">Monthly:</p>
            <div
              className={`ml-2 flex items-center ${investment.performance.monthly > 0 ? "text-green-500" : investment.performance.monthly < 0 ? "text-red-500" : "text-muted-foreground"}`}
            >
              {investment.performance.monthly > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : investment.performance.monthly < 0 ? (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              ) : null}
              <span>
                {investment.performance.monthly > 0 ? "+" : ""}
                {investment.performance.monthly}%
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <p className="text-sm font-medium">Annual:</p>
            <div
              className={`ml-2 flex items-center ${investment.performance.annual > 0 ? "text-green-500" : investment.performance.annual < 0 ? "text-red-500" : "text-muted-foreground"}`}
            >
              {investment.performance.annual > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : investment.performance.annual < 0 ? (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              ) : null}
              <span>
                {investment.performance.annual > 0 ? "+" : ""}
                {investment.performance.annual}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" className="w-full">
          <Code className="mr-2 h-4 w-4" />
          {investment.type === "Algorithm" ? "View Code" : "Details"}
        </Button>
        <Button size="sm" className="w-full">
          <LineChart className="mr-2 h-4 w-4" />
          Performance
        </Button>
      </CardFooter>
    </Card>
  )
}

