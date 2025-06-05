"use client";

import React from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PropertyImages } from "./property-images";
import { PropertyDetails } from "./property-details";
import { FinancialSummaryComponent } from "./financial-summary";
import { TenantsSummary, MaintenanceSummary } from "./overview-summaries";
import { UpcomingCashFlows } from "./upcoming-cashflows";
import { MapPin } from "lucide-react";
import { 
  Property, 
  FinancialDetails, 
  Tenant, 
  MaintenanceSchedule,
  Valuation 
} from "@/app/actions/properties";

interface UpcomingCashFlow {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  status: 'scheduled' | 'pending' | 'completed';
}

interface PropertyOverviewProps {
  property: Property;
  financialDetails: FinancialDetails | null;
  tenants: Tenant[];
  maintenanceSchedule: MaintenanceSchedule[];
  valuations: Valuation[];
}

export function PropertyOverview({
  property,
  financialDetails,
  tenants,
  maintenanceSchedule,
  valuations,
}: PropertyOverviewProps) {
  // Format full address
  const getFormattedAddress = () => {
    const parts = [];
    if (property.street_address) parts.push(property.street_address);
    else if (property.street_number && property.street_name) {
      parts.push(`${property.street_number} ${property.street_name}`);
    }
    
    if (property.suburb) parts.push(property.suburb);
    if (property.state) parts.push(property.state);
    if (property.postcode) parts.push(property.postcode);
    
    return parts.join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-7">
        {/* Property image and main details */}
        <Card className="md:col-span-4">
          <PropertyImages 
            propertyId={property.id}
            images={propertyImages}
          />
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-2xl">{property.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="mr-1 h-4 w-4" />
                  {getFormattedAddress() || property.location}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Property Type</div>
                <div className="font-medium">{property.type || "N/A"}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <div>
                <div className="text-sm text-muted-foreground">Value</div>
                <div className="font-medium text-lg">${(property.value || 0).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Monthly Income</div>
                <div className="font-medium text-lg">${(property.income || 0).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Monthly Expenses</div>
                <div className="font-medium text-lg">${(property.expenses || 0).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Purchase Date</div>
                <div className="font-medium text-lg">
                  {property.purchase_date ? format(new Date(property.purchase_date), "MMM d, yyyy") : "N/A"}
                </div>
              </div>
            </div>
            
            {property.status !== "development" && (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Occupancy</div>
                  <div className="text-sm font-medium">{property.occupancy || 0}%</div>
                </div>
                <Progress value={property.occupancy || 0} className="mt-2" />
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Summary cards */}
        <div className="space-y-6 md:col-span-3">
          <Card>
            <CardContent className="pt-6">
              <FinancialSummaryComponent
                propertyId={property.id}
                financialSummary={financialSummary}
                propertyIncome={property.income}
                propertyExpenses={property.expenses}
              />
            </CardContent>
          </Card>
          
          {/* Quick info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tenants</CardTitle>
              </CardHeader>
              <CardContent>
                <TenantsSummary tenants={tenants} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <MaintenanceSummary maintenanceItems={maintenanceItems} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Property Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyDetails property={property} />
        </CardContent>
      </Card>
      
      {/* Upcoming Cash Flows Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Cash Flows</CardTitle>
          <CardDescription>Next 5 scheduled transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <UpcomingCashFlows cashFlows={upcomingCashFlows} />
        </CardContent>
      </Card>
    </div>
  );
}
