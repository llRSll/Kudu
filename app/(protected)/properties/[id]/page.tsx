import { notFound } from "next/navigation";
import { PropertyDetailClient } from "@/components/properties/property-detail-client";
import { PropertyPageSkeleton } from "@/components/properties/property-page-skeleton";
import {
  fetchPropertyById,
  fetchFinancialSummary,
  fetchTenants,
  fetchMaintenanceItems,
  fetchPropertyImages,
} from "@/app/actions/properties";
import {
  fetchUpcomingCashFlows,
  fetchCashFlows,
} from "@/app/actions/cashflows";
import { Suspense } from "react";

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
  searchParams,
}: PropertyPageProps) {
  // Await both params and searchParams to resolve dynamic API values
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);

  const propertyId = resolvedParams.id;
  const tab = resolvedSearchParams?.tab
    ? String(resolvedSearchParams.tab)
    : "overview";

  // Fetch property data
  const property = await fetchPropertyById(propertyId);

  // If property not found, return 404
  if (!property) {
    notFound();
  }

  // Fetch all related data in parallel for efficiency
  const [
    financialSummary, // Now using our mocked implementation
    tenants,
    maintenanceItems,
    propertyImages,
    upcomingCashFlows,
    allCashFlows,
  ] = await Promise.all([
    fetchFinancialSummary(propertyId), // This will now return hardcoded data
    fetchTenants(propertyId),
    fetchMaintenanceItems(propertyId),
    fetchPropertyImages(propertyId),
    fetchUpcomingCashFlows(propertyId),
    fetchCashFlows(propertyId),
  ]);

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
          cashFlows={allCashFlows}
          propertyDocuments={[]} // Will be populated from documents API later
          initialTab={tab}
        />
      </Suspense>
    </div>
  );
}
