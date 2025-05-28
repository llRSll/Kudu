"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart"
import { ActualVsForecastChart } from "@/components/dashboard/actual-vs-forecast-chart"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingDisbursements } from "@/components/dashboard/upcoming-disbursements"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <DashboardHeader />
      <DashboardCards />
      <div className="grid gap-6 md:grid-cols-2">
        <CashFlowChart />
        <ActualVsForecastChart />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <RecentActivity />
        <UpcomingDisbursements />
      </div>
    </div>
  )
} 