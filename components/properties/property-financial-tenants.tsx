"use client";

import { format } from "date-fns";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { MoreHorizontal } from "lucide-react";
import { 
  Property, 
  Tenant, 
  MaintenanceItem, 
  FinancialSummary 
} from "@/app/actions/properties";

interface ValuationItem {
  id: string | number;
  date: Date | string;
  value: number;
  changePercent: number;
  appraisedBy?: string;
}

interface DevelopmentStage {
  id: string | number;
  name: string;
  description: string;
  plannedDate: Date | string;
  actualDate?: Date | string;
  budget: number;
  actualCost?: number;
  status: 'completed' | 'in_progress' | 'delayed' | 'planned';
  completionPercentage: number;
}

interface FinancialTenantsProps {
  property: Property;
  tenants: Tenant[];
  maintenanceItems: MaintenanceItem[];
  financialSummary: FinancialSummary | null;
  // These would come from your API but we'll mock them for now
  valuationHistory?: ValuationItem[];
  developmentStages?: DevelopmentStage[];
}

export function FinancialTenantsTab({
  property,
  tenants,
  maintenanceItems,
  financialSummary,
  valuationHistory = [],
  developmentStages = []
}: FinancialTenantsProps) {
  // Calculate financial metrics
  const income = property.income || 0;
  const expenses = property.expenses || 0; 
  const netIncome = income - expenses;
  
  // Format a date safely
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Tenants Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tenants</CardTitle>
            <CardDescription>Current and upcoming tenant information</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Lease Period</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No tenants currently registered
                    </TableCell>
                  </TableRow>
                ) : (
                  tenants.map(tenant => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">{tenant.name}</TableCell>
                      <TableCell>
                        {formatDate(tenant.lease_start)} - {formatDate(tenant.lease_end)}
                      </TableCell>
                      <TableCell>${tenant.rent_amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tenant.status === "active" ? "default" : 
                            tenant.status === "late" ? "destructive" : "outline"
                          }
                        >
                          {tenant.status === "active" ? "Active" : 
                           tenant.status === "late" ? "Late Payment" : "Ending Soon"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Add Tenant</Button>
          </CardFooter>
        </Card>
        
        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
            <CardDescription>Property financial information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Property Value</div>
              <div className="text-xl font-bold">${(property.value || 0).toLocaleString()}</div>
            </div>
            <Separator />
            <div>
              <div className="text-sm text-muted-foreground">Annual Income</div>
              <div className="text-lg font-medium text-green-600">
                ${(income * 12).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Annual Expenses</div>
              <div className="text-lg font-medium text-red-600">
                ${(expenses * 12).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Annual Net Income</div>
              <div className="text-lg font-medium">
                ${(netIncome * 12).toLocaleString()}
              </div>
            </div>
            <Separator />
            <div>
              <div className="text-sm text-muted-foreground">Cap Rate</div>
              <div className="text-xl font-bold">
                {property.value ? ((netIncome * 12 / property.value) * 100).toFixed(2) : "N/A"}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Valuation History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation History</CardTitle>
          <CardDescription>Property value over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Appraised Value</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Appraised By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {valuationHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No valuation history available
                  </TableCell>
                </TableRow>
              ) : (
                valuationHistory.map(valuation => (
                  <TableRow key={valuation.id}>
                    <TableCell>{formatDate(valuation.date)}</TableCell>
                    <TableCell className="font-medium">
                      ${valuation.value.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={
                        valuation.changePercent > 0 
                          ? "text-green-600" 
                          : valuation.changePercent < 0 
                            ? "text-red-600" 
                            : ""
                      }>
                        {valuation.changePercent > 0 ? "+" : ""}
                        {valuation.changePercent}%
                      </span>
                    </TableCell>
                    <TableCell>{valuation.appraisedBy || "N/A"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm">
              Add New Valuation
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Maintenance Section */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedule</CardTitle>
          <CardDescription>Upcoming and completed maintenance items</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Maintenance Item</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No maintenance items scheduled
                  </TableCell>
                </TableRow>
              ) : (
                maintenanceItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>${item.cost.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "completed" ? "default" : 
                          item.status === "pending" ? "secondary" : "outline"
                        }
                      >
                        {item.status === "completed" ? "Completed" : 
                         item.status === "pending" ? "Pending" : "Scheduled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
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
        </CardContent>
        <CardFooter>
          <Button variant="outline">Add Maintenance Item</Button>
        </CardFooter>
      </Card>
      
      {/* Development Stages Section (only show if property is in development) */}
      {property.status === "development" && developmentStages.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Development Stages</CardTitle>
              <CardDescription>Construction and development progress</CardDescription>
            </div>
            <Button>Add Stage</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Progress Overview */}
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Overall Progress</div>
                  <div className="text-sm font-medium">
                    {developmentStages.filter(s => s.status === "completed").length} / {developmentStages.length} Stages Completed
                  </div>
                </div>
                <Progress 
                  value={
                    developmentStages.length > 0
                      ? (developmentStages.filter(s => s.status === "completed").length / developmentStages.length) * 100
                      : 0
                  } 
                  className="h-2"
                />
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Budget</div>
                    <div className="font-medium">
                      ${developmentStages.reduce((sum, stage) => sum + stage.budget, 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Actual Costs</div>
                    <div className="font-medium">
                      ${developmentStages.reduce((sum, stage) => sum + (stage.actualCost || 0), 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Development Stages List */}
              <div className="space-y-4">
                {developmentStages.map(stage => (
                  <div key={stage.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-muted p-3 flex items-center justify-between">
                      <div className="font-medium flex items-center">
                        <Badge 
                          variant={
                            stage.status === "completed" ? "default" : 
                            stage.status === "in_progress" ? "secondary" : 
                            stage.status === "delayed" ? "destructive" : "outline"
                          }
                          className="mr-2"
                        >
                          {stage.status === "completed" ? "Completed" : 
                           stage.status === "in_progress" ? "In Progress" : 
                           stage.status === "delayed" ? "Delayed" : "Planned"}
                        </Badge>
                        {stage.name}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Stage</DropdownMenuItem>
                          <DropdownMenuItem>Update Progress</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-muted-foreground mb-2">{stage.description}</div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <div className="text-xs text-muted-foreground">Planned Date</div>
                          <div className="text-sm">{formatDate(stage.plannedDate)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Actual Date</div>
                          <div className="text-sm">
                            {stage.actualDate ? formatDate(stage.actualDate) : "Pending"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Budget</div>
                          <div className="text-sm">${stage.budget.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Actual Cost</div>
                          <div className="text-sm">
                            {stage.actualCost ? `$${stage.actualCost.toLocaleString()}` : "Pending"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div>Completion</div>
                          <div>{stage.completionPercentage}%</div>
                        </div>
                        <Progress value={stage.completionPercentage} className="h-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
