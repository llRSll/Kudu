"use client";

import React, { useState, useEffect } from "react";
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
import { Plus, Loader2 } from "lucide-react";
import { Property } from "@/app/actions/properties";
import { CashFlow, fetchFilteredCashFlows } from "@/app/actions/cashflows";
import { FilterControls } from "./portfolio-summary";
import { BarChart } from "./portfolio-summary";
import { AddCashFlowForm } from "./add-cash-flow-form";
import { useAuth } from "@/lib/auth-context";

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
  cashFlows: initialCashFlows, // Rename to indicate these are initial values
}: PropertyCashFlowTabProps) {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [period, setPeriod] = useState<string>("month");
  const [selectedPeriod, setSelectedPeriod] = useState("6m");
  const [selectedType, setSelectedType] = useState("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Add state for storing cash flows from backend
  const [cashFlows, setCashFlows] = useState<CashFlow[]>(initialCashFlows);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // Fetch cash flows from backend when period changes or component mounts
  useEffect(() => {
    const loadCashFlows = async () => {
      if (!property || !property.id) return;

      setIsLoading(true);
      try {
        // Get the user ID from the auth context
        const userId = user?.id;

        // Fetch filtered cash flows from the server
        const data = await fetchFilteredCashFlows(
          property.id,
          selectedPeriod,
          userId // Pass the user ID for filtering
        );
        console.log("Fetched cash flows:", data);
        setCashFlows(data);
      } catch (error) {
        console.error("Error fetching cash flows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCashFlows();
  }, [property, selectedPeriod, user]);

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

  // Calculate income, expenses, and net based on debit_credit field
  const incomeCashFlows = cashFlows.filter(
    (cf) => cf.debit_credit === "CREDIT"
  );
  const expenseCashFlows = cashFlows.filter(
    (cf) => cf.debit_credit === "DEBIT"
  );

  const totalIncome = incomeCashFlows.reduce((sum, cf) => sum + cf.amount, 0);
  const totalExpenses = expenseCashFlows.reduce(
    (sum, cf) => sum + cf.amount,
    0
  );
  const netCashFlow = totalIncome - totalExpenses;

  // Generate monthly data for the table based on actual cash flows
  const     generateMonthlyData = (): MonthlyData[] => {
    const months: Record<string, MonthlyData> = {};

    // Determine how many months to show based on selectedPeriod
    const monthsToShow =
      selectedPeriod === "12m"
        ? 12
        : selectedPeriod === "ytd"
        ? new Date().getMonth() + 1
        : selectedPeriod === "all"
        ? 24
        : 6; // Default to 6 months

    // Create empty records for each month
    for (let i = 0; i < monthsToShow; i++) {
      const currentDate = subMonths(new Date(), i);
      const monthStr = format(currentDate, "yyyy-MM");

      months[monthStr] = {
        date: currentDate,
        month: format(currentDate, "MMM yyyy"),
        income: 0,
        expenses: 0,
        maintenance: 0,
      };
    }

    // Populate with real data from cash flows
    cashFlows.forEach((flow) => {
      // Extract the year-month from the timestamp
      const monthStr = flow.timestamp.substring(0, 7); // yyyy-MM

      if (months[monthStr]) {
        if (flow.debit_credit === "CREDIT") {
          months[monthStr].income += flow.amount;
        } else if (flow.debit_credit === "DEBIT") {
          // Check for maintenance type transactions
          if (
            flow.transaction_type === "MAINTENANCE" ||
            flow.transaction_type === "REPAIR" ||
            flow.transaction_type === "REPAIRS"
          ) {
            months[monthStr].maintenance += flow.amount;
          } else {
            months[monthStr].expenses += flow.amount;
          }
        }
      }
    });

    // Convert to array and sort by date
    return Object.values(months).sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  };

  // const monthlyData = generateMonthlyData();

  // Function to get filtered data based on selected period and type
  const getFilteredCashFlowData = (): any[] => {
    // Use our monthly data with real values from the backend
    return generateMonthlyData()
  };

  // Function to handle successful cash flow addition
  const handleCashFlowSuccess = () => {
    setIsAddDialogOpen(false);
    // Refresh cash flows instead of reloading the page
    if (property && property.id) {
      const loadCashFlows = async () => {
        try {
          console.log(
            "Refreshing cash flows for property:",
            property.id,
            selectedPeriod,
            user?.id
          );
          const data = await fetchFilteredCashFlows(
            property.id,
            selectedPeriod,
            user?.id
          );
          setCashFlows(data);
        } catch (error) {
          console.error("Error refreshing cash flows:", error);
        }
      };
      loadCashFlows();
    }
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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Loading cash flow data...
              </span>
            </div>
          ) : (
            <>
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
                          <TableCell>{item.month}</TableCell>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
