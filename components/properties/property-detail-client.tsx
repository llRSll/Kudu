"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyOverview } from "./property-overview";
import { FinancialTenantsTab } from "./property-financial-tenants";
import { PropertyCashFlowTab } from "./property-cashflow-tab";
import { PropertyDocumentsTab } from "./property-documents-tab";
import { 
  Property, 
  FinancialDetails, 
  Tenant, 
  MaintenanceSchedule,
  Valuation,
  PropertyImage 
} from "@/app/actions/properties";
import { CashFlow } from "@/app/actions/cashflows";

interface PropertyDetailClientProps {
  property: Property;
  financialDetails: FinancialDetails | null;
  tenants: Tenant[];
  maintenanceSchedule: MaintenanceSchedule[];
  valuations: Valuation[];
  propertyImages: PropertyImage[];
  upcomingCashFlows: CashFlow[];
  cashFlows: CashFlow[];
  initialTab?: string;
  // Documents will be added later when we have a proper interface
  propertyDocuments?: any[];
}

export function PropertyDetailClient({ 
  property, 
  financialDetails,
  tenants,
  maintenanceSchedule,
  valuations,
  propertyImages,
  upcomingCashFlows,
  cashFlows = [],
  propertyDocuments = [],
  initialTab = "overview" 
}: PropertyDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || initialTab
  );
  
  // Go back to property list
  const handleBack = () => {
    router.back();
  };

  // Handle tab change - update URL
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`/properties/${property.id}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Button>
        <Button variant="outline" className="gap-1">
          <Pencil className="h-4 w-4" />
          Edit Property
        </Button>
      </div>
      
      {/* Main content */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial & Tenants</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <PropertyOverview 
            property={property}
            financialDetails={financialDetails}
            tenants={tenants}
            propertyImages={propertyImages}
            maintenanceSchedule={maintenanceSchedule}
            valuations={valuations}
            upcomingCashFlows={upcomingCashFlows}
          />
        </TabsContent>
        
        {/* Financial & Tenants Tab */}
        <TabsContent value="financial" className="mt-6">
          <FinancialTenantsTab 
            property={property}
            financialDetails={financialDetails}
            tenants={tenants}
            maintenanceSchedule={maintenanceSchedule}
            valuations={valuations}
          />
        </TabsContent>
        
        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="mt-6">
          <PropertyCashFlowTab 
            property={property}
            cashFlows={cashFlows}
          />
        </TabsContent>
        
        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6">
          <PropertyDocumentsTab 
            property={property}
            propertyDocuments={propertyDocuments}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
