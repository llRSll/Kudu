"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyOverview } from "./property-overview";
import { 
  Property, 
  FinancialSummary, 
  Tenant, 
  MaintenanceItem, 
  PropertyImage 
} from "@/app/actions/properties";

interface UpcomingCashFlow {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  status: 'scheduled' | 'pending' | 'completed';
}

interface PropertyDetailClientProps {
  property: Property;
  financialSummary: FinancialSummary | null;
  tenants: Tenant[];
  maintenanceItems: MaintenanceItem[];
  propertyImages: PropertyImage[];
  upcomingCashFlows: UpcomingCashFlow[];
  initialTab?: string;
}

export function PropertyDetailClient({ 
  property, 
  financialSummary,
  tenants,
  maintenanceItems,
  propertyImages,
  upcomingCashFlows,
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
            financialSummary={financialSummary}
            tenants={tenants}
            maintenanceItems={maintenanceItems}
            propertyImages={propertyImages}
            upcomingCashFlows={upcomingCashFlows}
          />
        </TabsContent>
        
        {/* Other tabs will be implemented later */}
        <TabsContent value="financial" className="mt-6">
          <div className="text-center py-12 text-muted-foreground">
            Financial & Tenants tab content will be implemented soon.
          </div>
        </TabsContent>
        
        <TabsContent value="cashflow" className="mt-6">
          <div className="text-center py-12 text-muted-foreground">
            Cash Flow tab content will be implemented soon.
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <div className="text-center py-12 text-muted-foreground">
            Documents tab content will be implemented soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
