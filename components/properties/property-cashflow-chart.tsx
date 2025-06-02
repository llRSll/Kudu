"use client";

import { cn } from "@/lib/utils";

// Define the shape of data expected by this component
export interface CashFlowChartItem {
  month: string;
  amount: number;
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
}

// Cash Flow Bar Chart Component specifically for property cash flows
export function CashFlowChart({
  data,
  selectedType,
  className
}: CashFlowChartProps) {
  // Calculate the maximum value for scaling
  const getMaxAmount = () => {
    if (data.length === 0) return 1; // Prevent division by zero
    
    if (selectedType === "all") {
      return Math.max(...data.map(d => d.amount || 0), 1);
    } else if (selectedType === "credit") {
      return Math.max(...data.map(d => d.income || 0), 1);
    } else if (selectedType === "debit") {
      return Math.max(...data.map(d => (d.expenses || 0) + (d.maintenance || 0)), 1);
    }
    
    return Math.max(...data.map(d => d[selectedType] as number || 0), 1);
  };

  // Get the amount to display based on selected type
  const getAmount = (item: CashFlowChartItem) => {
    if (selectedType === "all") return item.amount;
    if (selectedType === "credit") return item.income;
    if (selectedType === "debit") return (item.expenses || 0) + (item.maintenance || 0);
    return item[selectedType] as number || 0;
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const maxValue = getMaxAmount();

  return (
    <div className={cn("h-[200px] w-full", className)}>
      {data.length === 0 ? (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          No data available for selected filters
        </div>
      ) : (
        <div className="flex h-full items-end gap-2">
          {data.map((item) => {
            const amount = getAmount(item);
            // Calculate height as percentage of max value, ensure it's at least 1% if there's a value
            const height = maxValue > 0 ? Math.max((amount / maxValue) * 100, amount > 0 ? 1 : 0) : 0;
            
            return (
              <div key={item.month} className="group flex-1 relative">
                <div 
                  className="bg-blue-500 rounded-t transition-all duration-300 group-hover:bg-blue-600"
                  style={{ height: `${height}%` }}
                />
                <div className="text-xs text-center mt-2">{item.month}</div>
                <div className="text-xs text-center text-muted-foreground">
                  {formatCurrency(amount)}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-popover rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  <div className="text-xs">
                    <div>Income: {formatCurrency(item.income)}</div>
                    <div>Expenses: {formatCurrency(item.expenses)}</div>
                    <div>Maintenance: {formatCurrency(item.maintenance)}</div>
                    <div className="font-semibold mt-1 pt-1 border-t">
                      Net: {formatCurrency(item.income - item.expenses - item.maintenance)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
