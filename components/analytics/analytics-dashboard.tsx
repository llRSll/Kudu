"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for analytics
const assetAllocationData = [
  { name: "Equities", value: 45 },
  { name: "Fixed Income", value: 25 },
  { name: "Real Estate", value: 20 },
  { name: "Alternatives", value: 7 },
  { name: "Cash", value: 3 },
]

const performanceData = [
  { month: "Jan", portfolio: 5.2, benchmark: 4.8 },
  { month: "Feb", portfolio: 3.1, benchmark: 2.7 },
  { month: "Mar", portfolio: -1.5, benchmark: -2.1 },
  { month: "Apr", portfolio: 2.8, benchmark: 2.3 },
  { month: "May", portfolio: 4.2, benchmark: 3.8 },
  { month: "Jun", portfolio: 1.9, benchmark: 1.5 },
  { month: "Jul", portfolio: 3.5, benchmark: 3.2 },
  { month: "Aug", portfolio: 2.7, benchmark: 2.4 },
  { month: "Sep", portfolio: -0.8, benchmark: -1.2 },
  { month: "Oct", portfolio: 3.9, benchmark: 3.5 },
  { month: "Nov", portfolio: 4.5, benchmark: 4.1 },
  { month: "Dec", portfolio: 2.3, benchmark: 2.0 },
]

const cashFlowData = [
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

const netWorthTrendData = [
  { year: "2020", netWorth: 8500000 },
  { year: "2021", netWorth: 9200000 },
  { year: "2022", netWorth: 10100000 },
  { year: "2023", netWorth: 11300000 },
  { year: "2024", netWorth: 12500000 },
  { year: "2025", netWorth: 14200000 },
]

const assetClassPerformanceData = [
  { name: "Equities", ytd: 8.5, oneYear: 12.3, threeYear: 9.8, fiveYear: 11.2 },
  { name: "Fixed Income", ytd: 2.1, oneYear: 3.5, threeYear: 4.2, fiveYear: 3.8 },
  { name: "Real Estate", ytd: 5.8, oneYear: 7.2, threeYear: 6.5, fiveYear: 8.1 },
  { name: "Alternatives", ytd: 6.2, oneYear: 9.5, threeYear: 7.8, fiveYear: 8.9 },
  { name: "Total Portfolio", ytd: 6.5, oneYear: 9.2, threeYear: 7.6, fiveYear: 8.7 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState("ytd")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="networth">Net Worth</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Net Worth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$14.2M</div>
                <p className="text-xs text-green-500">+13.6% from last year</p>
                <div className="mt-4 h-1 w-full rounded-full bg-muted">
                  <div className="h-1 w-[75%] rounded-full bg-primary"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">YTD Return</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+6.5%</div>
                <p className="text-xs text-green-500">+1.7% vs benchmark</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Monthly Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$150K</div>
                <p className="text-xs text-green-500">+12.3% from last year</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Debt-to-Asset Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.5%</div>
                <p className="text-xs text-green-500">-2.3% from last year</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current allocation by asset class</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {assetAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Performance vs benchmark</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, undefined]} />
                    <Legend />
                    <Line type="monotone" dataKey="portfolio" stroke="#3b82f6" name="Portfolio" />
                    <Line type="monotone" dataKey="benchmark" stroke="#9ca3af" name="Benchmark" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Asset Class Performance</CardTitle>
                    <CardDescription>Performance by asset class and time period</CardDescription>
                  </div>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ytd">Year to Date</SelectItem>
                      <SelectItem value="oneYear">1 Year</SelectItem>
                      <SelectItem value="threeYear">3 Year</SelectItem>
                      <SelectItem value="fiveYear">5 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Asset Class</th>
                        <th className="p-3 text-right font-medium">Return</th>
                        <th className="p-3 text-right font-medium">Allocation</th>
                        <th className="p-3 text-right font-medium">Contribution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetClassPerformanceData.map((item, index) => {
                        // Skip the "Total Portfolio" row for allocation calculation
                        const allocation = index < assetAllocationData.length ? assetAllocationData[index].value : null

                        const performance = item[timeframe]
                        const contribution = allocation ? ((performance * allocation) / 100).toFixed(2) : null

                        return (
                          <tr
                            key={item.name}
                            className={`border-b ${item.name === "Total Portfolio" ? "font-medium" : ""}`}
                          >
                            <td className="p-3">{item.name}</td>
                            <td className={`p-3 text-right ${performance > 0 ? "text-green-500" : "text-red-500"}`}>
                              {performance > 0 ? "+" : ""}
                              {performance}%
                            </td>
                            <td className="p-3 text-right">{allocation !== null ? `${allocation}%` : "-"}</td>
                            <td className="p-3 text-right">{contribution !== null ? `${contribution}%` : "-"}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investments" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Current allocation by asset class</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {assetAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Performance vs benchmark</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, undefined]} />
                    <Legend />
                    <Line type="monotone" dataKey="portfolio" stroke="#3b82f6" name="Portfolio" />
                    <Line type="monotone" dataKey="benchmark" stroke="#9ca3af" name="Benchmark" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Asset Class Performance</CardTitle>
                    <CardDescription>Performance by asset class and time period</CardDescription>
                  </div>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ytd">Year to Date</SelectItem>
                      <SelectItem value="oneYear">1 Year</SelectItem>
                      <SelectItem value="threeYear">3 Year</SelectItem>
                      <SelectItem value="fiveYear">5 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Asset Class</th>
                        <th className="p-3 text-right font-medium">Return</th>
                        <th className="p-3 text-right font-medium">Allocation</th>
                        <th className="p-3 text-right font-medium">Contribution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetClassPerformanceData.map((item, index) => {
                        // Skip the "Total Portfolio" row for allocation calculation
                        const allocation = index < assetAllocationData.length ? assetAllocationData[index].value : null

                        const performance = item[timeframe]
                        const contribution = allocation ? ((performance * allocation) / 100).toFixed(2) : null

                        return (
                          <tr
                            key={item.name}
                            className={`border-b ${item.name === "Total Portfolio" ? "font-medium" : ""}`}
                          >
                            <td className="p-3">{item.name}</td>
                            <td className={`p-3 text-right ${performance > 0 ? "text-green-500" : "text-red-500"}`}>
                              {performance > 0 ? "+" : ""}
                              {performance}%
                            </td>
                            <td className="p-3 text-right">{allocation !== null ? `${allocation}%` : "-"}</td>
                            <td className="p-3 text-right">{contribution !== null ? `${contribution}%` : "-"}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cashflow" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
              <CardDescription>Monthly income vs expenses</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Income Breakdown</CardTitle>
                <CardDescription>Income sources by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Investment Income", value: 45 },
                        { name: "Rental Income", value: 30 },
                        { name: "Business Income", value: 15 },
                        { name: "Other Income", value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {assetAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Expenses by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Property Expenses", value: 35 },
                        { name: "Taxes", value: 25 },
                        { name: "Lifestyle", value: 20 },
                        { name: "Debt Service", value: 15 },
                        { name: "Other", value: 5 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {assetAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="networth" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Net Worth Trend</CardTitle>
              <CardDescription>Historical net worth growth</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={netWorthTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `$${value / 1000000}M`} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip
                    formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, "Net Worth"]}
                    labelFormatter={(label) => `Year: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="netWorth"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorNetWorth)"
                    name="Net Worth"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Assets vs Liabilities</CardTitle>
                <CardDescription>Breakdown of assets and liabilities</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { year: "2020", assets: 10500000, liabilities: 2000000 },
                      { year: "2021", assets: 11500000, liabilities: 2300000 },
                      { year: "2022", assets: 12800000, liabilities: 2700000 },
                      { year: "2023", assets: 14200000, liabilities: 2900000 },
                      { year: "2024", assets: 15800000, liabilities: 3300000 },
                      { year: "2025", assets: 17500000, liabilities: 3300000 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(value) => `$${value / 1000000}M`} />
                    <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, undefined]} />
                    <Legend />
                    <Bar dataKey="assets" name="Assets" fill="#10b981" />
                    <Bar dataKey="liabilities" name="Liabilities" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Composition</CardTitle>
                <CardDescription>Breakdown of assets by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { category: "Real Estate", value: 8500000 },
                      { category: "Investments", value: 6300000 },
                      { category: "Business", value: 1800000 },
                      { category: "Cash", value: 700000 },
                      { category: "Other", value: 200000 },
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `$${value / 1000000}M`} />
                    <YAxis type="category" dataKey="category" />
                    <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, "Value"]} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

