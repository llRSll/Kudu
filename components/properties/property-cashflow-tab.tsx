"use client";

import React, { useState } from "react";
import { format, subMonths } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Property } from "@/app/actions/properties";
import { CashFlow } from "@/app/actions/cashflows";
import { FilterControls } from "./portfolio-summary";
import { BarChart } from "./portfolio-summary";
import { AddCashFlowForm } from "./add-cash-flow-form";

interface MonthlyData {
  date: Date;
  month: string;
  income: number;
  expenses: number;
  maintenance: number;
  amount?: number;
  [key: string]: number | string | Date | undefined;
}

interface PropertyCashFlowTabProps {
  property: Property;
  cashFlows: CashFlow[];
}

export function PropertyCashFlowTab({
  property,
  cashFlows,
}: PropertyCashFlowTabProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [period, setPeriod] = useState<string>("month");
  const [selectedPeriod, setSelectedPeriod] = useState("6m");
  const [selectedType, setSelectedType] = useState("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Define timePeriods and cashFlowTypes options
  const timePeriods = [
    { label: "Last 6 months", value: "6m" },
    { label: "Last 12 months", value: "12m" },
    { label: "Year to date", value: "ytd" },
    { label: "All time", value: "all" },
    { label: "Custom", value: "custom" },
  ];

  const cashFlowTypes = [
    { label: "All Types", value: "all" },
    { label: "Income", value: "income" },
    { label: "Expenses", value: "expenses" },
    { label: "Maintenance", value: "maintenance" },
  ];

  // Format a date
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM d, yyyy");
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate income, expenses, and net
  const incomeCashFlows = cashFlows.filter((cf) => cf.type === "income");
  const expenseCashFlows = cashFlows.filter((cf) => cf.type === "expense");

  const totalIncome = incomeCashFlows.reduce((sum, cf) => sum + cf.amount, 0);
  const totalExpenses = expenseCashFlows.reduce(
    (sum, cf) => sum + cf.amount,
    0
  );
  const netCashFlow = totalIncome - totalExpenses;

  // Generate monthly data for the table
  const generateMonthlyData = (): MonthlyData[] => {
    const months: MonthlyData[] = [];

    // Create 6 months of data (most recent 6 months)
    for (let i = 0; i < 6; i++) {
      const currentDate = subMonths(new Date(), i);
      const monthStr = format(currentDate, "yyyy-MM");

      // Filter cash flows for this month
      const monthlyIncome = incomeCashFlows
        .filter((cf) => cf.timestamp.startsWith(monthStr))
        .reduce((sum, cf) => sum + cf.amount, 0);

      const monthlyExpenses = expenseCashFlows
        .filter((cf) => cf.timestamp.startsWith(monthStr))
        .reduce((sum, cf) => sum + cf.amount, 0);

      // Mock maintenance data (in a real app, this would come from maintenance items)
      const maintenanceCost = Math.round(monthlyExpenses * 0.2);

      months.push({
        date: currentDate,
        month: format(currentDate, "MMM yyyy"),
        income: monthlyIncome,
        expenses: monthlyExpenses,
        maintenance: maintenanceCost,
      });
    }

    // Sort by date (most recent first)
    return months.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const monthlyData = generateMonthlyData();

  // Function to get filtered data based on selected period and type
  const getFilteredCashFlowData = (): any[] => {
    // For demonstration, we'll just use the monthly data we already have
    // In a real app, you would filter based on selectedPeriod and dateRange
    return monthlyData.map((item) => ({
      ...item,
      amount: item.income - item.expenses - item.maintenance, // Total net cash flow
      income: item.income,
      expenses: item.expenses,
      maintenance: item.maintenance,
      date: item.date,
      month: item.month,
    }));
  };

  // Function to handle successful cash flow addition
  const handleCashFlowSuccess = () => {
    setIsAddDialogOpen(false);
    // Trigger a refresh of the page to show the updated cash flow data
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Property Cash Flow</CardTitle>
            <CardDescription>
              Monthly income and expenses breakdown
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <FilterControls
              timePeriods={timePeriods}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              propertyTypes={cashFlowTypes}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              dateRange={dateRange}
              onDateRangeChange={(range) => setDateRange(range)}
              onGenerateReport={() => console.log("Generating report")}
            />
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-2">
                  <Plus className="mr-1 h-4 w-4" /> Add Cash Flow
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Cash Flow</DialogTitle>
                  <DialogDescription>
                    Add a new income or expense for this property.
                  </DialogDescription>
                </DialogHeader>
                <AddCashFlowForm
                  property={property}
                  onSuccess={handleCashFlowSuccess}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <BarChart
            data={getFilteredCashFlowData()}
            selectedType={selectedType}
          />

          <div className="mt-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Income</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                  <TableHead className="text-right">Maintenance</TableHead>
                  <TableHead className="text-right">Net Income</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getFilteredCashFlowData().map(
                  (item: MonthlyData, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{format(item.date, "MMM yyyy")}</TableCell>
                      <TableCell className="text-right">
                        ${item.income.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.expenses.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.maintenance.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        $
                        {(
                          item.income -
                          item.expenses -
                          item.maintenance
                        ).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
