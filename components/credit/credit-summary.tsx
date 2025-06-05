"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, DollarSign, Percent } from "lucide-react"

export function CreditSummary() {
  // Sample data for credit utilization
  const utilizationData = [
    { name: "Bank of America", limit: 5000000, used: 3200000 },
    { name: "JP Morgan", limit: 3000000, used: 1800000 },
    { name: "Wells Fargo", limit: 2500000, used: 1200000 },
    { name: "Citibank", limit: 4000000, used: 2500000 },
  ]

  // Calculate total credit metrics
  const totalLimit = utilizationData.reduce((sum, item) => sum + item.limit, 0)
  const totalUsed = utilizationData.reduce((sum, item) => sum + item.used, 0)
  const utilizationRate = (totalUsed / totalLimit) * 100
  const availableCredit = totalLimit - totalUsed
  const weightedInterestRate = 4.25 // Sample weighted average interest rate

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Credit Limit</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(totalLimit / 1000000).toFixed(1)}M</div>
          <p className="text-xs text-muted-foreground">Across {utilizationData.length} facilities</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Credit Utilized</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(totalUsed / 1000000).toFixed(1)}M</div>
          <div className="mt-2 h-2 w-full rounded-full bg-muted">
            <div className="h-2 rounded-full bg-primary" style={{ width: `${utilizationRate}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{utilizationRate.toFixed(1)}% utilization rate</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Credit</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(availableCredit / 1000000).toFixed(1)}M</div>
          <p className="text-xs text-muted-foreground">{(100 - utilizationRate).toFixed(1)}% available</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weighted Interest Rate</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{weightedInterestRate}%</div>
          <p className="text-xs text-muted-foreground">Blended rate across all facilities</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Credit Utilization</CardTitle>
          <CardDescription>Credit limit vs. utilized amount by facility</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={utilizationData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }} barGap={10}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => `$${value / 1000000}M`} />
                  <Tooltip
                    formatter={(value) => [`$${(value / 1000000).toFixed(2)}M`, undefined]}
                    labelFormatter={(label) => `Facility: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="limit" name="Credit Limit" fill="#9ca3af" />
                  <Bar dataKey="used" name="Amount Used" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="table">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Facility</th>
                      <th className="p-3 text-left font-medium">Credit Limit</th>
                      <th className="p-3 text-left font-medium">Amount Used</th>
                      <th className="p-3 text-left font-medium">Available</th>
                      <th className="p-3 text-left font-medium">Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utilizationData.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3">${(item.limit / 1000000).toFixed(2)}M</td>
                        <td className="p-3">${(item.used / 1000000).toFixed(2)}M</td>
                        <td className="p-3">${((item.limit - item.used) / 1000000).toFixed(2)}M</td>
                        <td className="p-3">{((item.used / item.limit) * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

