"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CashFlow {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  status: 'scheduled' | 'pending' | 'completed';
}

interface UpcomingCashFlowsProps {
  cashFlows: CashFlow[];
}

export function UpcomingCashFlows({ cashFlows }: UpcomingCashFlowsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Upcoming Cash Flows</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cashFlows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No upcoming cash flows
              </TableCell>
            </TableRow>
          ) : (
            cashFlows.map(cashFlow => (
              <TableRow key={cashFlow.id}>
                <TableCell>{format(new Date(cashFlow.date), "MMM d, yyyy")}</TableCell>
                <TableCell>{cashFlow.description}</TableCell>
                <TableCell>
                  <Badge variant={cashFlow.type === "income" ? "default" : "destructive"}>
                    {cashFlow.type === "income" ? "Income" : "Expense"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${cashFlow.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      cashFlow.status === "scheduled" ? "outline" : 
                      cashFlow.status === "pending" ? "secondary" : "default"
                    }
                  >
                    {cashFlow.status === "scheduled" ? "Scheduled" : 
                     cashFlow.status === "pending" ? "Pending" : "Completed"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
