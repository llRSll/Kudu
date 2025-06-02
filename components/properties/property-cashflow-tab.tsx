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
import { Plus, Loader2, BarChart3, TrendingUp } from "lucide-react";
import { Property } from "@/app/actions/properties";
import {
  CashFlow,
  fetchCashFlows,
  fetchFilteredCashFlows,
} from "@/app/actions/cashflows";
import { FilterControls } from "./portfolio-summary";
import { CashFlowChart } from "./property-cashflow-chart";
import { AddCashFlowForm } from "./add-cash-flow-form";
import { CashFlowTableRow } from "./cash-flow-table-row";
import { useAuth } from "@/lib/auth-context";

interface MonthlyData {
  date: Date;
  month: string;
  income: number;
  expenses: number;
  maintenance: number;
  amount: number; // Make this required to match ChartDataItem
  [key: string]: number | string | Date;
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
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [chartView, setChartView] = useState<"single" | "multi">("multi");

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
    { label: "Credit", value: "credit" },
    { label: "Debit", value: "debit" },
  ];

  // Fetch cash flows from backend when period changes or component mounts
  useEffect(() => {
    const loadCashFlows = async () => {
      if (!property || !property.id) return;

      setIsLoading(true);
      try {
        // Get the user ID from the auth context
        const userId = user?.id;

        let startDateStr: string | undefined;
        let endDateStr: string | undefined;

        // If custom date range is selected, use those dates
        if (selectedPeriod === "custom" && dateRange) {
          if (dateRange.from) {
            startDateStr = dateRange.from.toISOString().split("T")[0];
          }
          if (dateRange.to) {
            endDateStr = dateRange.to.toISOString().split("T")[0];
          }
        }

        // Fetch cash flows from the server
        const data = await fetchCashFlows(property.id);
        console.log("Fetched cash flows:", data);

        // Apply client-side filtering based on period and date range
        let filteredData = data || [];

        if (filteredData.length > 0) {
          // Apply period filtering
          const now = new Date();
          let filterStartDate: Date | null = null;

          switch (selectedPeriod) {
            case "6m":
              filterStartDate = subMonths(now, 6);
              break;
            case "12m":
              filterStartDate = subMonths(now, 12);
              break;
            case "ytd":
              filterStartDate = new Date(now.getFullYear(), 0, 1);
              break;
            case "custom":
              if (dateRange?.from) {
                filterStartDate = dateRange.from;
              }
              break;
            // "all" case doesn't need filtering
          }

          // Apply date filtering
          if (filterStartDate) {
            filteredData = filteredData.filter((cashFlow) => {
              const cashFlowDate = new Date(cashFlow.timestamp);
              const isAfterStart = cashFlowDate >= filterStartDate!;
              const isBeforeEnd =
                selectedPeriod === "custom" && dateRange?.to
                  ? cashFlowDate <= dateRange.to
                  : true;
              return isAfterStart && isBeforeEnd;
            });
          }
        }

        setCashFlows(filteredData);
      } catch (error) {
        console.error("Error fetching cash flows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCashFlows();
  }, [property, selectedPeriod, dateRange, user]);

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

  // Generate monthly data for chart display
  const generateMonthlyData = (): MonthlyData[] => {
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
        amount: 0,
      };
    }

    // Populate with real data from cash flows
    cashFlows.forEach((flow) => {
      if (!flow.timestamp) {
        console.warn("Cash flow missing timestamp:", flow);
        return;
      }

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

        // Update net amount
        months[monthStr].amount =
          months[monthStr].income -
          months[monthStr].expenses -
          months[monthStr].maintenance;
      }
    });

    // Convert to array and sort by date (most recent first)
    return Object.values(months).sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  };

  const monthlyData = generateMonthlyData();
  
  // Debug: Log the data being passed to the chart
  console.log("Monthly data for chart:", monthlyData);
  console.log("Cash flows count:", cashFlows.length);

  // Filter cash flows based on selected type
  const getFilteredCashFlows = (): CashFlow[] => {
    if (selectedType === "all") {
      return cashFlows;
    }

    return cashFlows.filter((flow) => {
      if (selectedType === "credit") {
        return flow.debit_credit === "CREDIT";
      } else if (selectedType === "debit") {
        return flow.debit_credit === "DEBIT";
      }
      return false;
    });
  };

  const filteredCashFlows = getFilteredCashFlows();

  console.log("Filtered cash flows:", filteredCashFlows);

  // Function to handle successful cash flow addition/update/deletion
  const handleCashFlowSuccess = () => {
    setIsAddDialogOpen(false);
    // Refresh cash flows
    if (property && property.id) {
      const loadCashFlows = async () => {
        try {
          setIsLoading(true);
          const data = await fetchCashFlows(property.id);
          if (data) {
            setCashFlows(data);
          } else {
            setCashFlows([]);
          }
        } catch (error) {
          console.error("Error refreshing cash flows:", error);
        } finally {
          setIsLoading(false);
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
            {/* Chart View Toggle */}
            <div className="flex items-center gap-1 mr-4">
              <Button
                variant={chartView === "single" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartView("single")}
                className="px-3"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Net
              </Button>
              <Button
                variant={chartView === "multi" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartView("multi")}
                className="px-3"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Detailed
              </Button>
            </div>
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
        <CardContent className="w-full">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">
                Loading cash flow data...
              </span>
            </div>
          ) : (
            <>
              <CashFlowChart 
                data={monthlyData} 
                selectedType={selectedType}
                chartView={chartView}
                className="w-full"
                height={400}
              />

              <div className="mt-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-center">Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCashFlows.length > 0 ? (
                      filteredCashFlows
                        .sort(
                          (a, b) =>
                            new Date(b.timestamp).getTime() -
                            new Date(a.timestamp).getTime()
                        )
                        .map((cashFlow) => (
                          <CashFlowTableRow
                            key={cashFlow.id}
                            cashFlow={cashFlow}
                            property={property}
                            onUpdate={handleCashFlowSuccess}
                            selectedType={selectedType}
                          />
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <div className="text-muted-foreground">
                            {isLoading
                              ? "Loading cash flows..."
                              : "No cash flow entries found."}
                            {!isLoading && (
                              <p className="text-sm mt-2">
                                Add your first cash flow entry to get started.
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
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
