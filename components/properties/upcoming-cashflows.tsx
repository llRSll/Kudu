"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CashFlow } from "@/app/actions/cashflows";

interface UpcomingCashFlowsProps {
  cashFlows: CashFlow[];
}

export function UpcomingCashFlows({ cashFlows }: UpcomingCashFlowsProps) {
  // Format currency for display
  const formatCurrency = (value: number | string | undefined): string => {
    const numValue = Number(value || 0);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  // Helper function for transaction type color
  const getTransactionTypeColor = (type: string): string => {
    switch (type?.toUpperCase()) {
      case "RENT":
        return "bg-green-100 text-green-800";
      case "INSURANCE":
        return "bg-purple-100 text-purple-800";
      case "TAX":
        return "bg-yellow-100 text-yellow-800";
      case "MAINTENANCE":
        return "bg-orange-100 text-orange-800";
      case "UTILITIES":
        return "bg-blue-100 text-blue-800";
      case "MORTGAGE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        These are scheduled future cash flows with transaction dates after {format(new Date(), "MMM d, yyyy")}.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Income</TableHead>
            <TableHead>Expenses</TableHead>
            <TableHead>Maintenance</TableHead>
            <TableHead>Net Income</TableHead>
            <TableHead>Transaction Type</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cashFlows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="text-muted-foreground">
                  <p className="text-lg font-medium">No upcoming cash flows</p>
                  <p className="text-sm mt-2">
                    There are no scheduled transactions with dates in the future.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            cashFlows
              // Sort by date in ascending order (earliest future dates first)
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .map(cashFlow => (
                <TableRow key={cashFlow.id}>
                  {/* Month */}
                  <TableCell>
                    <div className="font-medium">
                      {format(new Date(cashFlow.timestamp), "MMM d")}
                    </div>
                  </TableCell>

                  {/* Income */}
                  <TableCell>
                    <div className="font-medium">{formatCurrency(cashFlow.income)}</div>
                  </TableCell>

                  {/* Expenses */}
                  <TableCell>
                    <div className="font-medium">
                      {formatCurrency(cashFlow.expenses)}
                    </div>
                  </TableCell>

                  {/* Maintenance */}
                  <TableCell>
                    <div className="font-medium">
                      {formatCurrency(cashFlow.maintenance)}
                    </div>
                  </TableCell>

                  {/* Net Income */}
                  <TableCell>
                    <div
                      className={`font-medium ${
                        Number(cashFlow.income) -
                          (Number(cashFlow.expenses) + Number(cashFlow.maintenance)) >=
                        0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(
                        Number(cashFlow.income) -
                          (Number(cashFlow.expenses) + Number(cashFlow.maintenance))
                      )}
                    </div>
                  </TableCell>

                  {/* Transaction Type */}
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${getTransactionTypeColor(
                        cashFlow.transaction_type
                      )}`}
                    >
                      {cashFlow.transaction_type}
                    </Badge>
                  </TableCell>

                  {/* Type (Credit/Debit) */}
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        cashFlow.debit_credit === "CREDIT" ? "default" : "destructive"
                      }
                    >
                      {cashFlow.debit_credit === "CREDIT" ? "Credit" : "Debit"}
                    </Badge>
                  </TableCell>

                  {/* Description */}
                  <TableCell>
                    <div className="font-medium">{cashFlow.description}</div>
                  </TableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
