"use client";

import { AreaChartGradient, MultiAreaChartGradient } from "@/components/ui/area-chart-gradient";
import { ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { debug } from "console";

// Define the shape of data expected by this component
export interface CashFlowChartItem {
  month: string;
  netIncome: number; // Calculated as income - (expenses + maintenance)
  income: number;
  expenses: number;
  maintenance: number;
  [key: string]: number | string | Date;
  date: Date;
}

interface CashFlowChartProps {
  data: CashFlowChartItem[];
  selectedType: string;
  className?: string;
  height?: number;
  chartView?: "single" | "multi";
}

// Chart configuration for different data types
const chartConfig: ChartConfig = {
  netIncome: {
    label: "Net Cash Flow",
  },
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))"
  },
  expenses: {
    label: "Expenses", 
    color: "hsl(var(--chart-2))"
  },
  maintenance: {
    label: "Maintenance",
    color: "hsl(var(--chart-3))"
  }
} satisfies ChartConfig;

// Cash Flow Area Chart Component specifically for property cash flows
export function CashFlowChart({
  data,
  selectedType,
  className,
  height = 300,
  chartView = "multi"
}: CashFlowChartProps) {
  // Format currency for display
  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toFixed(0)}`;
  };

  // Transform data based on selected type - each field is kept independent
  const transformedData = data.map(item => {
    let value = 0;
    
    // For displaying single metric chart
    if (selectedType === "all") {
      // Show net income/loss as the single value when "all" is selected
      value = item.netIncome;
    } else if (selectedType === "income") {
      // Show only income
      value = item.income;
    } else if (selectedType === "expenses") {
      // Show only expenses
      value = item.expenses || 0;
    } else if (selectedType === "maintenance") {
      // Show only maintenance
      value = item.maintenance || 0;
    } else {
      // Default to net income
      value = item.netIncome;
    }

    return {
      ...item,
      value,
      displayValue: formatCurrency(value),
    };
  });

  if (data.length === 0) {
    return (
      <div className={cn("h-[300px] w-full flex flex-col items-center justify-center text-muted-foreground", className)}>
        <p className="text-lg font-medium">No cash flow data available</p>
        <p className="text-sm mt-2">Add cash flow entries to see the chart visualization</p>
      </div>
    );
  }

  // Check if all data points are zero - look at each metric independently
  const hasRealData = transformedData.some(item => 
    item.income > 0 || 
    item.expenses > 0 || 
    item.maintenance > 0
  );
  
  if (!hasRealData) {
    return (
      <div className={cn("h-[300px] w-full flex flex-col items-center justify-center text-muted-foreground", className)}>
        <p className="text-lg font-medium">No cash flow activity</p>
        <p className="text-sm mt-2">Add income and expense entries to visualize cash flow trends</p>
      </div>
    );
  }

  // For multi-area view, show income, expenses, and maintenance regardless of selected type
  if (chartView === "multi") {
    // Define which areas to show based on selectedType
    const areas = [];
    
    // Always include income
    if (selectedType === "all" || selectedType === "income") {
      areas.push({
        dataKey: "income",
        color: "hsl(var(--chart-1))",
        gradientId: "incomeGradient",
      });
    }
    
    // Always include expenses and maintenance
    if (selectedType === "all" || selectedType === "expenses") {
      areas.push({
        dataKey: "expenses", 
        color: "hsl(var(--chart-2))",
        gradientId: "expensesGradient",
      });
    }
    
    if (selectedType === "all" || selectedType === "maintenance") {
      areas.push({
        dataKey: "maintenance",
        color: "hsl(var(--chart-3))",
        gradientId: "maintenanceGradient",
      });
    }

    return (
      <MultiAreaChartGradient
        data={transformedData}
        config={chartConfig}
        xAxisKey="month"
        areas={areas}
        className={className}
        height={height}
        showGrid={true}
        showTooltip={true}
        curve="monotone"
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      />
    );
  }

  // Single area chart for specific data type
  return (
    <AreaChartGradient
      data={transformedData}
      config={chartConfig}
      xAxisKey="month"
      yAxisKey="value"
      className={className}
      height={height}
      showGrid={true}
      showTooltip={true}
      curve="monotone"
      gradientId={`${selectedType}Gradient`}
      fillOpacity={0.6}
      strokeWidth={2}
      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
    />
  );
}
