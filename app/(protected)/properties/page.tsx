"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PropertyList } from "@/components/properties/property-list";
import { PortfolioSummary } from "@/components/properties/portfolio-summary";
import {
  fetchInvestmentProperties,
  createProperty,
  testSupabaseConnection,
  fetchProperties,
} from "@/lib/api/investments-properties";
import { useEffect, useState } from "react";
// import { Property } from "@/components/properties/property-list";
import { useAuth } from "@/lib/auth-context";
import { AddPropertyForm } from "@/components/properties/add-property-form";
import { Property } from "@/components/properties/types";
import { useAppToast } from "@/hooks/use-app-toast";
// import { fetchProperties } from "@/lib/api/properties"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const toast = useAppToast();

  // Load properties from API
  useEffect(() => {
    let isMounted = true;
    let loadingTimeout: NodeJS.Timeout;

    async function loadData() {
      try {
        setIsLoading(true);
        loadingTimeout = setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
            toast.error("Loading properties timed out. Please try again.");
          }
        }, 5000); // 5 seconds timeout

        // Only fetch from API, do not use local storage
        const apiProperties = await fetchProperties(user?.id || "");
        if (isMounted) {
          setProperties(apiProperties);
          setIsLoading(false);
          clearTimeout(loadingTimeout);
        }
      } catch (error) {
        console.error("Failed to load properties:", error);
        toast.error("Failed to load properties. Please try again.");
        if (isMounted) {
          setProperties([]);
          setIsLoading(false);
          clearTimeout(loadingTimeout);
        }
      }
    }

    if (user) {
      loadData();
    } else {
      // If no user, don't show loading state
      setIsLoading(false);
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [user]);

  // Add a new property and save to Supabase
  const handleAddProperty = async (newProperty: Property) => {
    try {
      // Test Supabase connection first
      const isConnected = await testSupabaseConnection();
      if (!isConnected) {
        console.error(
          "Cannot connect to Supabase. Please check your connection and credentials."
        );
        toast.error(
          "Cannot connect to Supabase. Please check your connection and credentials."
        );
        return;
      }

      const propertyData = {
        investmentId: "",
        name: newProperty.name,
        type: newProperty.type,
        status: newProperty.status,
        landPrice: newProperty.landPrice,
        buildPrice: newProperty.buildPrice,
        purchaseDate: newProperty.purchaseDate || null,
        currentValuation: newProperty.currentValuation,
        lastValuationDate: new Date().toISOString(),
        area: newProperty.area,
        bedrooms: newProperty.bedrooms,
        bathrooms: newProperty.bathrooms,
        parking: newProperty.parking,
        hasPool: newProperty.hasPool,
        hasSecuritySystem: newProperty.hasSecuritySystem,
        petsAllowed: newProperty.petsAllowed,
        furnished: newProperty.furnished,
        hasSolar: newProperty.hasSolar,
        amenities: JSON.stringify({
          hasSecuritySystem: newProperty.hasSecuritySystem,
          petsAllowed: newProperty.petsAllowed,
          furnished: newProperty.furnished,
          hasSolar: newProperty.hasSolar,
        }),
        unit: newProperty.unit ? Number(newProperty.unit) : null,
        streetNumber: !isNaN(parseInt(newProperty.streetAddress as string))
          ? parseInt(newProperty.streetAddress as string)
          : "",
        streetName: newProperty.streetAddress || null,
        streetType: null, // Not collected in form
        suburb: newProperty.city,
        state: newProperty.state,
        postcode: newProperty.postalCode
          ? parseInt(newProperty.postalCode)
          : null,
        country: newProperty.country,
        updatedAt: new Date().toISOString(),
        userId: user?.id || null,
      };

      // Add property with toast feedback
      await toast.handleApiCall(
        async () => {
          const propertyId = await createProperty(propertyData);
          if (propertyId) {
            const propertyWithDbId = {
              ...newProperty,
              id: propertyId.id,
            };
            setProperties([...properties, propertyWithDbId]);
          } else {
            throw new Error("Failed to save property to database");
          }
        },
        {
          loadingMessage: "Adding property...",
          successMessage: "Property added successfully!",
          errorMessage: "Failed to add property. Please try again.",
        }
      );
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("Error adding property. Please try again.");
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = properties.filter((property) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      property?.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
      property?.location?.toLowerCase().includes(lowerCaseSearchTerm) ||
      property?.type?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            Properties
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your property portfolio
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row animate-slide-up">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search properties..."
              className="w-full pl-8 sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <AddPropertyForm onAddProperty={handleAddProperty} />
        </div>
      </div>
      <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <PortfolioSummary properties={filteredProperties} />
      </div>
      {isLoading ? (
        <div
          className="text-center p-8 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Loading properties...
        </div>
      ) : (
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <PropertyList properties={filteredProperties} />
        </div>
      )}
    </div>
  );
}
