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
import { MoreHorizontal, Plus, ArrowLeft, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { TenantModal } from "@/components/modals/TenantModal";
import { ValuationModal } from "@/components/modals/ValuationModal";
import { MaintenanceModal } from "@/components/modals/MaintenanceModal";
import { 
  Property, 
  Tenant, 
  MaintenanceItem, 
  FinancialSummary,
  FinancialDetails,
  MaintenanceSchedule,
  Valuation
} from "@/app/actions/properties";
import { addMaintenanceItem, updateMaintenanceItem } from "@/app/actions/maintenance";
import { addTenant, updateTenant } from "@/app/actions/tenants";
import { FinancialDetailsModal } from '@/components/modals/FinancialDetailsModal';
import { formatCurrency } from '@/lib/utils';
import { addValuation, updateValuation } from "@/app/actions/valuations";

interface FinancialTenantsTabProps {
  property: Property;
  financialDetails: FinancialDetails | null;
  tenants: Tenant[];
  maintenanceSchedule: MaintenanceSchedule[];
  valuations: Valuation[];
}

export function FinancialTenantsTab({
  property,
  financialDetails,
  tenants,
  maintenanceSchedule,
  valuations,
}: FinancialTenantsTabProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  // Modal states
  const [isTenantModalOpen, setIsTenantModalOpen] = useState(false);
  const [isValuationModalOpen, setIsValuationModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState<'view' | 'edit' | 'create'>('create');
  
  // Selected item states
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedValuation, setSelectedValuation] = useState<Valuation | null>(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState<MaintenanceSchedule | null>(null);
  
  // Local state management
  const [localTenants, setLocalTenants] = useState<Tenant[]>(tenants);
  const [localMaintenanceItems, setLocalMaintenanceItems] = useState<MaintenanceSchedule[]>(maintenanceSchedule);
  const [localValuations, setLocalValuations] = useState<Valuation[]>(valuations);
  
  // Calculate financial metrics
  const income = financialDetails?.annual_income || 0;
  const expenses = financialDetails?.annual_expenses || 0;
  const netIncome = income - expenses;
  const capRate = financialDetails?.property_value ? (netIncome / financialDetails.property_value) * 100 : 0;
  
  // Format a date safely
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMM d, yyyy");
  };

  // Update local states when props change
  useEffect(() => {
    setLocalTenants(tenants);
    setLocalMaintenanceItems(maintenanceSchedule);
    setLocalValuations(valuations);
  }, [tenants, maintenanceSchedule, valuations]);

  // Update tenant and maintenance statuses based on dates
  useEffect(() => {
    const today = new Date();
    
    // Update tenant statuses
    const updatedTenants = tenants.map(tenant => {
      const leaseEnd = new Date(tenant.lease_end);
      const daysUntilEnd = Math.floor((leaseEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let status = tenant.status;
      if (daysUntilEnd <= 30 && daysUntilEnd > 0) status = "ending_soon";
      if (daysUntilEnd <= 0) status = "expired";
      if (daysUntilEnd > 30) status = "active";
      
      return {...tenant, status};
    });

    // Update maintenance statuses
    const updatedMaintenance = maintenanceSchedule.map(item => {
      const scheduledDate = new Date(item.scheduled_date);
      const isOverdue = scheduledDate.getTime() < today.getTime() && item.status !== "completed";
      
      return {
        ...item,
        status: isOverdue ? "overdue" : item.status
      };
    });

    setLocalTenants(updatedTenants);
    setLocalMaintenanceItems(updatedMaintenance);
  }, [tenants, maintenanceSchedule]);

  // Handle tenant actions
  const handleAddTenant = async (tenantData: Tenant) => {
    try {
      let updatedTenant: Tenant | null;
      
      if (selectedTenant?.id) {
        // Update existing tenant
        updatedTenant = await updateTenant(
          selectedTenant.id,
          {
            name: tenantData.name,
            email: tenantData.email,
            lease_start: tenantData.lease_start,
            lease_end: tenantData.lease_end,
            rent_amount: tenantData.rent_amount,
            status: tenantData.status
          }
        );

        if (!updatedTenant) {
          throw new Error('Failed to update tenant');
        }

        // Update local state by replacing the edited item
        setLocalTenants(prev => 
          prev.map(item => item.id === updatedTenant?.id ? updatedTenant : item)
        );
      } else {
        // Add new tenant
        const newTenant = await addTenant({
          property_id: property.id,
          name: tenantData.name,
          email: tenantData.email || '',
          lease_start: tenantData.lease_start,
          lease_end: tenantData.lease_end,
          rent_amount: tenantData.rent_amount,
          status: tenantData.status || 'active'
        });

        if (!newTenant) {
          throw new Error('Failed to create tenant');
        }

        // Update local state by adding the new item
        setLocalTenants(prev => [...prev, newTenant]);
      }
      
      toast({
        title: "Success",
        description: selectedTenant ? "Tenant updated successfully" : "Tenant added successfully"
      });

      // Close modal and reset state
      setIsTenantModalOpen(false);
      setSelectedTenant(null);
      
      // Refresh the page to get updated data
      router.refresh();
    } catch (err) {
      console.error('Error managing tenant:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to manage tenant",
        variant: "destructive"
      });
    }
  };

  // Handle valuation actions
  const handleAddValuation = async (valuationData: Valuation) => {
    try {
      let updatedValuation: Valuation | null;
      
      if (selectedValuation?.id) {
        // Update existing valuation
        updatedValuation = await updateValuation(
          selectedValuation.id,
          {
            appraised_value: valuationData.appraised_value,
            appraised_date: valuationData.appraised_date,
            appraised_by: valuationData.appraised_by,
            notes: valuationData.notes
          }
        );

        if (!updatedValuation) {
          throw new Error('Failed to update valuation');
        }

        // Update local state by replacing the edited item
        setLocalValuations(prev => 
          prev.map(item => item.id === updatedValuation?.id ? updatedValuation : item)
        );
      } else {
        // Add new valuation
        const newValuation = await addValuation({
          property_id: property.id,
          appraised_value: valuationData.appraised_value,
          appraised_date: valuationData.appraised_date,
          appraised_by: valuationData.appraised_by,
          notes: valuationData.notes
        });

        if (!newValuation) {
          throw new Error('Failed to create valuation');
        }

        // Update local state with the new valuation
        const updatedValuations = [...localValuations, newValuation].sort((a, b) => {
          return new Date(b.appraised_date).getTime() - new Date(a.appraised_date).getTime();
        });
        setLocalValuations(updatedValuations);
      }
      
      toast({
        title: "Success",
        description: selectedValuation ? "Valuation updated successfully" : "Valuation added successfully"
      });
      setIsValuationModalOpen(false);
      setSelectedValuation(null);
      
      // Refresh the page to get updated data
      router.refresh();
    } catch (err) {
      console.error('Error managing valuation:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to manage valuation",
        variant: "destructive"
      });
    }
  };

  // Update local states when props change
  useEffect(() => {
    // Sort valuations by date in descending order
    const sortedValuations = [...valuations].sort((a, b) => {
      return new Date(b.appraised_date).getTime() - new Date(a.appraised_date).getTime();
    });
    setLocalValuations(sortedValuations);
  }, [valuations]);

  // Handle maintenance actions
  const handleAddMaintenance = async (maintenanceData: MaintenanceSchedule) => {
    try {
      let updatedMaintenance: MaintenanceSchedule | null;
      
      if (maintenanceMode === 'edit' && selectedMaintenance?.id) {
        // Update existing maintenance item
        updatedMaintenance = await updateMaintenanceItem(
          selectedMaintenance.id,
          {
            title: maintenanceData.title,
            description: maintenanceData.description,
            cost: maintenanceData.cost,
            scheduled_date: maintenanceData.scheduled_date,
            status: maintenanceData.status,
            assigned_to: maintenanceData.assigned_to,
            notes: maintenanceData.notes
          }
        );

        if (!updatedMaintenance) {
          throw new Error('Failed to update maintenance item');
        }

        // Update local state by replacing the edited item
        setLocalMaintenanceItems(prev => 
          prev.map(item => item.id === updatedMaintenance?.id ? updatedMaintenance : item)
        );
      } else {
        // Add new maintenance item
        const newMaintenance = await addMaintenanceItem({
          property_id: property.id,
          title: maintenanceData.title,
          description: maintenanceData.description,
          cost: maintenanceData.cost,
          scheduled_date: maintenanceData.scheduled_date,
          status: maintenanceData.status || "scheduled",
          assigned_to: maintenanceData.assigned_to,
          notes: maintenanceData.notes
        });

        if (!newMaintenance) {
          throw new Error('Failed to create maintenance item');
        }

        // Update local state by adding the new item
        setLocalMaintenanceItems(prev => [...prev, newMaintenance]);
      }
      
      toast({
        title: "Success",
        description: maintenanceMode === 'edit' ? 
          "Maintenance item updated successfully" : 
          "Maintenance item added successfully"
      });
      setIsMaintenanceModalOpen(false);
      setSelectedMaintenance(null);
      setMaintenanceMode('create');
      
      // Refresh the page to get updated data
      router.refresh();
    } catch (err) {
      console.error("Error managing maintenance item:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to manage maintenance item",
        variant: "destructive"
      });
    }
  };

  const handleEditProperty = () => {
    // Navigate to property edit page
    router.push(`/properties/${property.id}/edit`);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button variant="link" onClick={() => router.back()} className="px-0">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>
        <Button onClick={handleEditProperty}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Property
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Tenants Section */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tenants</CardTitle>
              <CardDescription>Current and upcoming tenant information</CardDescription>
            </div>
            <Button onClick={() => {
              setSelectedTenant(null);
              setIsTenantModalOpen(true);
            }} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
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
                {localTenants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No tenants currently registered
                    </TableCell>
                  </TableRow>
                ) : (
                  localTenants.map(tenant => (
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
                            tenant.status === "late" ? "destructive" : 
                            tenant.status === "ending_soon" ? "secondary" :
                            "outline"
                          }
                        >
                          {tenant.status === "active" ? "Active" : 
                           tenant.status === "late" ? "Late Payment" : 
                           tenant.status === "ending_soon" ? "Ending Soon" :
                           "Expired"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Financial Details</CardTitle>
                <CardDescription>Property financial information</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsFinancialModalOpen(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Property Value</div>
              <div className="text-xl font-bold">${(financialDetails?.property_value || 0).toLocaleString()}</div>
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
                {capRate.toFixed(2)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Valuation History Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Valuation History</CardTitle>
            <CardDescription>Property value over time</CardDescription>
          </div>
          <Button onClick={() => {
            setSelectedValuation(null);
            setIsValuationModalOpen(true);
          }} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Valuation
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Appraised Value</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Appraised By</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localValuations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No valuation history available
                  </TableCell>
                </TableRow>
              ) : (
                localValuations.map((valuation, index) => {
                  // Calculate change from previous valuation
                  const previousValuation = localValuations[index + 1];
                  const change = previousValuation
                    ? ((valuation.appraised_value - previousValuation.appraised_value) / previousValuation.appraised_value) * 100
                    : null;

                  return (
                    <TableRow key={valuation.id}>
                      <TableCell>{formatDate(valuation.appraised_date)}</TableCell>
                      <TableCell className="font-medium">
                        ${valuation.appraised_value.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {change !== null ? (
                          <span className={change >= 0 ? "text-green-600" : "text-red-600"}>
                            {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                          </span>
                        ) : "Initial Value"}
                      </TableCell>
                      <TableCell>{valuation.appraised_by || "N/A"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedValuation(valuation);
                              setIsValuationModalOpen(true);
                            }}>
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Maintenance Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Maintenance Schedule</CardTitle>
            <CardDescription>Upcoming and completed maintenance items</CardDescription>
          </div>
          <Button onClick={() => {
            setSelectedMaintenance(null);
            setIsMaintenanceModalOpen(true);
            setMaintenanceMode('create');
          }} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Maintenance
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Maintenance Item</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localMaintenanceItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No maintenance items scheduled
                  </TableCell>
                </TableRow>
              ) : (
                localMaintenanceItems.map(item => {
                  // Calculate status based on date and completion
                  const today = new Date();
                  const scheduledDate = new Date(item.scheduled_date);
                  let displayStatus = item.status;
                  
                  if (item.status !== "completed" && scheduledDate < today) {
                    displayStatus = "overdue";
                  }

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{formatDate(item.scheduled_date)}</TableCell>
                      <TableCell>${item.cost.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            displayStatus === "completed" ? "default" :
                            displayStatus === "in_progress" ? "secondary" :
                            displayStatus === "overdue" ? "destructive" :
                            "outline"
                          }
                        >
                          {displayStatus.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
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
                            <DropdownMenuItem onClick={() => {
                              setSelectedMaintenance(item);
                              setMaintenanceMode('view');
                              setIsMaintenanceModalOpen(true);
                            }}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedMaintenance(item);
                              setMaintenanceMode('edit');
                              setIsMaintenanceModalOpen(true);
                            }}>
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <TenantModal
        isOpen={isTenantModalOpen}
        onClose={() => {
          setIsTenantModalOpen(false);
          setSelectedTenant(null);
        }}
        propertyId={property.id}
        tenant={selectedTenant}
        onSubmit={handleAddTenant}
      />

      <ValuationModal
        isOpen={isValuationModalOpen}
        onClose={() => {
          setIsValuationModalOpen(false);
          setSelectedValuation(null);
        }}
        propertyId={property.id}
        onSubmit={handleAddValuation}
        valuation={selectedValuation}
      />

      <MaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={() => {
          setIsMaintenanceModalOpen(false);
          setSelectedMaintenance(null);
          setMaintenanceMode('create');
        }}
        propertyId={property.id}
        onSubmit={handleAddMaintenance}
        maintenance={selectedMaintenance}
        mode={maintenanceMode}
      />

      <FinancialDetailsModal
        isOpen={isFinancialModalOpen}
        onClose={() => setIsFinancialModalOpen(false)}
        propertyId={property.id}
        currentDetails={financialDetails}
      />
    </div>
  );
}