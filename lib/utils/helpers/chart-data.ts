import { format, subMonths } from "date-fns";
import { CashFlow as ServerCashFlow } from "@/app/actions/cashflows";

// Define a local CashFlow interface that includes the amount property
interface CashFlow extends ServerCashFlow {
  amount: number | string;
}

export interface MonthlyData {
  date: Date;
  month: string;
  income: number;
  expenses: number;
  maintenance: number;
  netIncome: number;
  [key: string]: number | string | Date;
}

interface GenerateMonthlyDataOptions {
  cashFlows: (ServerCashFlow & { amount?: number | string })[];
  selectedPeriod?: string;
  dateRange?: { from?: Date; to?: Date };
}

/**
 * Generates monthly aggregated data for displaying in charts
 * 
 * @param options - Configuration options including cash flows data and period selection
 * @returns Array of monthly data objects sorted by date (most recent first)
 */
export function generateMonthlyChartData({
  cashFlows,
  selectedPeriod = "all",
  dateRange,
}: GenerateMonthlyDataOptions): MonthlyData[] {
  const months: Record<string, MonthlyData> = {};

  // Determine how many months to show based on selectedPeriod
  const now = new Date();
  const monthsToShow =
    selectedPeriod === "12m"
      ? 12
      : selectedPeriod === "ytd"
      ? now.getMonth() + 1
      : selectedPeriod === "all"
      ? 24 // Default to showing 2 years of data for "all"
      : selectedPeriod === "custom" && dateRange?.from && dateRange?.to
      ? Math.ceil(
          (dateRange.to.getTime() - dateRange.from.getTime()) /
            (30 * 24 * 60 * 60 * 1000)
        )
      : 6; // Default to 6 months

  // Create empty records for each month
  for (let i = 0; i < monthsToShow; i++) {
    const currentDate = subMonths(now, i);
    const monthStr = format(currentDate, "yyyy-MM");

    months[monthStr] = {
      date: currentDate,
      month: format(currentDate, "MMM yyyy"),
      income: 0,
      expenses: 0,
      maintenance: 0,
      netIncome: 0,
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
      // Use direct income, expenses, and maintenance fields
      const income = typeof flow.income === 'string' ? parseFloat(flow.income) : (flow.income || 0);
      const expenses = typeof flow.expenses === 'string' ? parseFloat(flow.expenses) : (flow.expenses || 0);
      const maintenance = typeof flow.maintenance === 'string' ? parseFloat(flow.maintenance) : (flow.maintenance || 0);

      // Add values to monthly totals
      months[monthStr].income += income;
      months[monthStr].expenses += expenses;
      months[monthStr].maintenance += maintenance;

      // Calculate net income (income minus expenses and maintenance)
      months[monthStr].netIncome = 
        months[monthStr].income - (months[monthStr].expenses + months[monthStr].maintenance);
    }
  });

  // Convert to array and sort by date (most recent first)
  return Object.values(months).sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}
