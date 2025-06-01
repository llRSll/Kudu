import { Suspense } from "react";
import { notFound } from "next/navigation";
import { 
  fetchPropertyById, 
  fetchFinancialSummary, 
  fetchTenants, 
  fetchMaintenanceItems,
  fetchPropertyImages 
} from "@/app/actions/properties";
import { fetchUpcomingCashFlows } from "@/app/actions/cashflows";
import { PropertyDetailClient } from "@/components/properties/property-detail-client";
import { PropertyPageSkeleton } from "@/components/properties/property-page-skeleton";

interface PropertyPageProps {
  params: {
    id: string;
  };
  searchParams: {
    tab?: string;
  };
}

export default async function PropertyPage({ 
  params, 
  searchParams 
}: PropertyPageProps) {
  // Get property data using the server action
  const property = await fetchPropertyById(params.id);
  
  if (!property) {
    notFound();
  }

  // Fetch related data in parallel
  const [
    financialSummary,
    tenants,
    maintenanceItems,
    propertyImages,
    upcomingCashFlows
  ] = await Promise.all([
    fetchFinancialSummary(property.id),
    fetchTenants(property.id),
    fetchMaintenanceItems(property.id),
    fetchPropertyImages(property.id),
    fetchUpcomingCashFlows(property.id)
  ]);

  const initialTab = searchParams.tab || "overview";

  return (
    <div className="container py-6">
      <Suspense fallback={<PropertyPageSkeleton />}>
        <PropertyDetailClient
          property={property}
          financialSummary={financialSummary}
          tenants={tenants}
          maintenanceItems={maintenanceItems}
          propertyImages={propertyImages}
          upcomingCashFlows={upcomingCashFlows}
          initialTab={initialTab}
        />
      </Suspense>
    </div>
  );
}
