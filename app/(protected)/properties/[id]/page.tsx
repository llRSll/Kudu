'use client';

import { notFound } from "next/navigation";
import { PropertyDetailClient } from "@/components/properties/property-detail-client";
import { PropertyPageSkeleton } from "@/components/properties/property-page-skeleton";
import {
  fetchPropertyById,
  fetchTenants,
  fetchMaintenanceSchedule,
  fetchValuations,
  Property,
  FinancialDetails,
  Tenant,
  MaintenanceSchedule,
  Valuation,
} from "@/app/actions/properties";
import { fetchFinancialDetails } from "@/app/actions/financials";
import { Suspense, use, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PropertyPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}

interface PropertyData {
  property: Property;
  financialDetails: FinancialDetails | null;
  tenants: Tenant[];
  maintenanceSchedule: MaintenanceSchedule[];
  valuations: Valuation[];
}

function PropertyPageContent({
  id,
  tab,
}: {
  id: string;
  tab: string;
}) {
  const [data, setData] = useState<PropertyData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch property data
        const property = await fetchPropertyById(id);

        // If property not found, return early
        if (!property) {
          notFound();
          return;
        }

        // Fetch all related data in parallel
        const [financialDetails, tenants, maintenanceSchedule, valuations] = await Promise.all([
          fetchFinancialDetails(id),
          fetchTenants(id),
          fetchMaintenanceSchedule(id),
          fetchValuations(id),
        ]);

        setData({
          property,
          financialDetails,
          tenants,
          maintenanceSchedule,
          valuations,
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load property data'));
      }
    }

    loadData();
  }, [id]);

  if (error) {
    throw error; // This will be caught by the ErrorBoundary
  }

  if (!data) {
    return <PropertyPageSkeleton />;
  }

  return (
    <PropertyDetailClient
      property={data.property}
      financialDetails={data.financialDetails}
      tenants={data.tenants}
      maintenanceSchedule={data.maintenanceSchedule}
      valuations={data.valuations}
      initialTab={tab}
    />
  );
}

export default function PropertyPage({
  params,
  searchParams,
}: PropertyPageProps) {
  // Use React.use() to unwrap the promises
  const { id } = use(params);
  const { tab: tabParam } = use(searchParams);
  const tab = tabParam || "overview";

  return (
    <div className="container py-6">
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <PropertyPageContent id={id} tab={tab} />
      </ErrorBoundary>
    </div>
  );
}
