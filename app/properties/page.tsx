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
// import { fetchProperties } from "@/lib/api/properties"

// Local storage key for properties
const PROPERTIES_STORAGE_KEY = "kudu_user_properties";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load properties from local storage and API
  useEffect(() => {
    let isMounted = true;
    let loadingTimeout: NodeJS.Timeout;

    async function loadData() {
      try {
        setIsLoading(true);

        // Set a timeout to prevent infinite loading state
        loadingTimeout = setTimeout(() => {
          if (isMounted) {
            console.log("Loading timeout reached, showing empty state");
            setIsLoading(false);
          }
        }, 5000); // 5 seconds timeout

        // First, try to load from local storage for immediate display
        const savedProperties = loadPropertiesFromStorage();
        if (savedProperties.length > 0 && isMounted) {
          setProperties(savedProperties);
        }

        // Then try to load from API for up-to-date data
        const apiProperties = await fetchProperties();

        // If component still mounted, update state with API data or use saved data
        if (isMounted) {
          if (apiProperties.length > 0) {
            setProperties(apiProperties);
            // Save to localStorage if we got data from API
            localStorage.setItem(
              PROPERTIES_STORAGE_KEY,
              JSON.stringify(apiProperties)
            );
          } else if (savedProperties.length === 0) {
            // If no data from API and no saved data, use empty array
            setProperties([]);
          }
          setIsLoading(false);
          clearTimeout(loadingTimeout);
        }
      } catch (error) {
        console.error("Failed to load properties:", error);
        // Even if there's an error, try loading from local storage
        if (isMounted) {
          const savedProperties = loadPropertiesFromStorage();
          setProperties(savedProperties);
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

  // Helper function to load properties from localStorage
  const loadPropertiesFromStorage = (): Property[] => {
    if (typeof window === "undefined") return [];

    try {
      const savedData = localStorage.getItem(PROPERTIES_STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (err) {
      console.error("Error loading properties from localStorage:", err);
    }
    return [];
  };

  // Add a new property and save to Supabase
  const handleAddProperty = async (newProperty: Property) => {
    try {
      // Test Supabase connection first
      const isConnected = await testSupabaseConnection();
      if (!isConnected) {
        console.error(
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
        streetNumber: !isNaN(parseInt(newProperty.streetAddress))
          ? parseInt(newProperty.streetAddress)
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
      };

      // Format address data for Supabase

      const propertyId = await createProperty(propertyData);

      if (propertyId) {
        // If saving was successful, update the ID with the one from the database
        const propertyWithDbId = {
          ...newProperty,
          id: propertyId,
        };

        // Update local state
        setProperties([...properties, propertyWithDbId]);
      } else {
        console.error("Failed to save property to database");
      }
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  // Filter properties for search
  const [searchTerm, setSearchTerm] = useState("");

  console.log("Current properties:=================>", properties);

  const filteredProperties = properties.filter(
    (property) =>
      property?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property?.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
