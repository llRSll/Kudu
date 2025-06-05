"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const monthlyData = [
  { month: "Jan", income: 120000, expenses: 65000 },
  { month: "Feb", income: 132000, expenses: 70000 },
  { month: "Mar", income: 145000, expenses: 68000 },
  { month: "Apr", income: 155000, expenses: 72000 },
  { month: "May", income: 165000, expenses: 75000 },
  { month: "Jun", income: 180000, expenses: 80000 },
  { month: "Jul", income: 190000, expenses: 85000 },
  { month: "Aug", income: 205000, expenses: 90000 },
  { month: "Sep", income: 220000, expenses: 95000 },
  { month: "Oct", income: 235000, expenses: 100000 },
  { month: "Nov", income: 245000, expenses: 105000 },
  { month: "Dec", income: 260000, expenses: 110000 },
]

const quarterlyData = [
  { month: "Q1", income: 397000, expenses: 203000 },
  { month: "Q2", income: 500000, expenses: 227000 },
  { month: "Q3", income: 615000, expenses: 270000 },
  { month: "Q4", income: 740000, expenses: 315000 },
]

const chartConfig = {
  income: {
    label: "Income",
  },
  expenses: {
    label: "Expenses",
  },
} satisfies ChartConfig

export function CashFlowChart() {
  const [timeframe, setTimeframe] = useState("monthly")
  const data = timeframe === "monthly" ? monthlyData : quarterlyData

  return (
    <Card className="col-span-1 card-hover-effect">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm">Cash Flow</CardTitle>
          <CardDescription>Monthly income vs expenses</CardDescription>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[100px] h-8 text-xs">
            <SelectValue placeholder="Monthly" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#525252" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#525252" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a3a3a3" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#a3a3a3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "currentColor" }} />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} tick={{ fill: "currentColor" }} />
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                    labelFormatter={(label) => `${timeframe === "monthly" ? "Month" : "Quarter"}: ${label}`}
                  />
                }
              />
              <Legend formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#525252"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIncome)"
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#a3a3a3"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpenses)"
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

