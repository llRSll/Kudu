"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const monthlyData = [
  { month: "Jan", actual: 120000, forecast: 110000 },
  { month: "Feb", actual: 132000, forecast: 125000 },
  { month: "Mar", actual: 145000, forecast: 150000 },
  { month: "Apr", actual: 155000, forecast: 160000 },
  { month: "May", actual: 165000, forecast: 170000 },
  { month: "Jun", actual: 180000, forecast: 175000 },
  { month: "Jul", actual: 190000, forecast: 185000 },
  { month: "Aug", actual: 205000, forecast: 200000 },
  { month: "Sep", actual: 220000, forecast: 215000 },
  { month: "Oct", actual: 235000, forecast: 230000 },
  { month: "Nov", actual: 245000, forecast: 250000 },
  { month: "Dec", actual: 260000, forecast: 265000 },
]

const quarterlyData = [
  { month: "Q1", actual: 397000, forecast: 385000 },
  { month: "Q2", actual: 500000, forecast: 505000 },
  { month: "Q3", actual: 615000, forecast: 600000 },
  { month: "Q4", actual: 740000, forecast: 745000 },
]

export function ActualVsForecastChart() {
  return (
    <Card className="col-span-1 card-hover-effect">
      <CardHeader>
        <CardTitle className="text-sm">Actual vs Forecast</CardTitle>
        <CardDescription>Monthly performance comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="mb-4 h-8">
            <TabsTrigger value="monthly" className="text-xs">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="quarterly" className="text-xs">
              Quarterly
            </TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "currentColor" }} />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} tick={{ fill: "currentColor" }} />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                    borderColor: "hsl(var(--border))",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend formatter={(value) => <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>} />
                <Bar dataKey="actual" fill="#525252" name="Actual" radius={[2, 2, 0, 0]} />
                <Bar dataKey="forecast" fill="#a3a3a3" name="Forecast" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="quarterly" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quarterlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                  labelFormatter={(label) => `Quarter: ${label}`}
                />
                <Legend />
                <Bar dataKey="actual" fill="#404040" name="Actual" radius={[2, 2, 0, 0]} />
                <Bar dataKey="forecast" fill="#a3a3a3" name="Forecast" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

