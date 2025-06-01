"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowDown, 
  ArrowUp, 
  Calendar as CalendarIcon, 
  Download, 
  Filter, 
  MoreHorizontal, 
  PlusCircle,
  Search
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Property } from "@/app/actions/properties";

interface CashFlow {
  id: string;
  property_id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  status: 'scheduled' | 'pending' | 'completed';
  created_at?: string;
  updated_at?: string;
}

interface CashFlowSummary {
  period: string;
  totalIncome: number;
  totalExpenses: number;
  netCashFlow: number;
  yearToDate?: {
    income: number;
    expenses: number;
    net: number;
  };
}

interface PropertyCashFlowTabProps {
  property: Property;
  cashFlows: CashFlow[];
}

export function PropertyCashFlowTab({ property, cashFlows }: PropertyCashFlowTabProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [summaryPeriod, setSummaryPeriod] = useState("month");
  
  // Calculate summary based on the selected period
  const calculateSummary = (): CashFlowSummary => {
    // This would normally be based on the selected period and date
    // For now, we'll use mock data
    const total = {
      income: cashFlows
        .filter(cf => cf.type === 'income')
        .reduce((sum, cf) => sum + cf.amount, 0),
      expenses: cashFlows
        .filter(cf => cf.type === 'expense')
        .reduce((sum, cf) => sum + cf.amount, 0)
    };
    
    return {
      period: summaryPeriod === "month" ? 
        format(date || new Date(), "MMMM yyyy") : 
        format(date || new Date(), "yyyy"),
      totalIncome: total.income,
      totalExpenses: total.expenses,
      netCashFlow: total.income - total.expenses,
      yearToDate: {
        income: total.income * (summaryPeriod === "month" ? 3 : 1), // Mock data
        expenses: total.expenses * (summaryPeriod === "month" ? 3 : 1), // Mock data
        net: (total.income - total.expenses) * (summaryPeriod === "month" ? 3 : 1)  // Mock data
      }
    };
  };
  
  const summary = calculateSummary();
  
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM d, yyyy");
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Cash Flow Summary */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Cash Flow Summary</CardTitle>
              <CardDescription>
                {summary.period} overview of income and expenses
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={summaryPeriod} onValueChange={setSummaryPeriod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="year">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[170px] pl-3 pr-0 justify-between">
                    {date ? format(date, summaryPeriod === "month" ? "MMMM yyyy" : "yyyy") : "Pick a date"}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Income</div>
                <div className="text-2xl font-bold text-emerald-500">{formatCurrency(summary.totalIncome)}</div>
                {summary.yearToDate && (
                  <div className="text-xs text-muted-foreground mt-1">
                    YTD: {formatCurrency(summary.yearToDate.income)}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Expenses</div>
                <div className="text-2xl font-bold text-red-500">{formatCurrency(summary.totalExpenses)}</div>
                {summary.yearToDate && (
                  <div className="text-xs text-muted-foreground mt-1">
                    YTD: {formatCurrency(summary.yearToDate.expenses)}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Net Cash Flow</div>
                <div className={`text-2xl font-bold ${summary.netCashFlow >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {formatCurrency(summary.netCashFlow)}
                </div>
                {summary.yearToDate && (
                  <div className="text-xs text-muted-foreground mt-1">
                    YTD: {formatCurrency(summary.yearToDate.net)}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Cash on Cash Return</div>
                <div className="text-2xl font-bold">
                  {property.value && property.value > 0 
                    ? `${((summary.netCashFlow * (summaryPeriod === "month" ? 12 : 1) / property.value) * 100).toFixed(1)}%` 
                    : 'N/A'}
                </div>
                {property.value && property.value > 0 && summary.yearToDate && (
                  <div className="text-xs text-muted-foreground mt-1">
                    YTD: {((summary.yearToDate.net / property.value) * 100).toFixed(1)}%
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* Cash Flow Transactions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Cash Flow Transactions</CardTitle>
              <CardDescription>
                View and manage all income and expenses
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                Add Transaction
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expenses</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>
              <div className="relative max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-8 h-9" />
              </div>
            </div>
            
            <TabsContent value="all" className="mt-0 p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashFlows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No cash flow transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    cashFlows.map(cashFlow => (
                      <TableRow key={cashFlow.id}>
                        <TableCell>{formatDate(cashFlow.date)}</TableCell>
                        <TableCell className="font-medium">{cashFlow.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {cashFlow.type === 'income' ? (
                              <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                            ) : (
                              <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                            )}
                            <span className="capitalize">{cashFlow.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className={`text-right ${cashFlow.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {formatCurrency(cashFlow.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              cashFlow.status === "completed" ? "default" : 
                              cashFlow.status === "pending" ? "secondary" : 
                              "outline"
                            }
                          >
                            {cashFlow.status.charAt(0).toUpperCase() + cashFlow.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Transaction</DropdownMenuItem>
                              <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            {/* Similar content for other tabs, simplified for brevity */}
            <TabsContent value="income" className="mt-0 p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cashFlows.filter(cf => cf.type === 'income').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        No income transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    cashFlows
                      .filter(cf => cf.type === 'income')
                      .map(cashFlow => (
                        <TableRow key={cashFlow.id}>
                          <TableCell>{formatDate(cashFlow.date)}</TableCell>
                          <TableCell className="font-medium">{cashFlow.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                              <span>Income</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-emerald-500">
                            {formatCurrency(cashFlow.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                cashFlow.status === "completed" ? "default" : 
                                cashFlow.status === "pending" ? "secondary" : 
                                "outline"
                              }
                            >
                              {cashFlow.status.charAt(0).toUpperCase() + cashFlow.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="text-xs text-muted-foreground">
            Showing {cashFlows.length} transactions
          </div>
          {/* Pagination would go here in a real implementation */}
        </CardFooter>
      </Card>
      
      {/* Recurring Transactions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recurring Transactions</CardTitle>
              <CardDescription>Manage your scheduled recurring income and expenses</CardDescription>
            </div>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              Add Recurring
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Next Date</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Rental Income</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                    <span>Income</span>
                  </div>
                </TableCell>
                <TableCell>Monthly</TableCell>
                <TableCell className="text-right text-emerald-500">{formatCurrency(2500)}</TableCell>
                <TableCell>{format(new Date(), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Mortgage Payment</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                    <span>Expense</span>
                  </div>
                </TableCell>
                <TableCell>Monthly</TableCell>
                <TableCell className="text-right text-red-500">{formatCurrency(1800)}</TableCell>
                <TableCell>{format(new Date(), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
