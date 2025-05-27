"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  MapPin,
  MoreHorizontal,
  TrendingUp,
  Building2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Property } from "./types";

// export interface Property {
//   id: string;
//   name: string;
// type: string;
// location: string;
// value: number;
// income: number;
// expenses: number;
// occupancy: number;
// status:
//   | "active"
//   | "prospect"
//   | "under-contract"
//   | "in-development"
//   | "for-sale"
//   | "pending-sale"
//   | "archived";
// image: string;
// description?: string;
// area?: number;
// bedrooms?: number;
// bathrooms?: number;
// yearBuilt?: number;
// }

// Status badge configuration
const getStatusBadge = (status: Property["status"]) => {
  const badges = {
    prospect: { variant: "outline", text: "Prospect" },
    "under-contract": { variant: "secondary", text: "Under Contract" },
    active: { variant: "default", text: "Active" },
    "in-development": { variant: "secondary", text: "In Development" },
    "for-sale": { variant: "destructive", text: "For Sale" },
    "pending-sale": { variant: "outline", text: "Pending Sale" },
    archived: { variant: "outline", text: "Archived" },
  };
  return badges[status] || badges.active;
};

// Property Action Menu Component
const PropertyActions = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">More options</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem>View Details</DropdownMenuItem>
      <DropdownMenuItem>Edit Property</DropdownMenuItem>
      <DropdownMenuItem>Upload Documents</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Cash Flow Analysis</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// Property Details Component
const PropertyDetails = ({ property }: { property: Property }) => (
  <div className="flex flex-wrap gap-2 mt-3">
    {property.area && (
      <Badge variant="outline" className="text-xs">
        {property.area.toLocaleString()} sqft
      </Badge>
    )}
    {property.bedrooms && (
      <Badge variant="outline" className="text-xs">
        {property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
      </Badge>
    )}
    {property.bathrooms && (
      <Badge variant="outline" className="text-xs">
        {property.bathrooms}{" "}
        {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
      </Badge>
    )}
    {property.yearBuilt && (
      <Badge variant="outline" className="text-xs">
        Built {property.yearBuilt}
      </Badge>
    )}
  </div>
);

// Property Stats Component
const PropertyStats = ({ property }: { property: Property }) => (
  <div className="mt-4 grid grid-cols-2 gap-2">
    <div className="rounded-md bg-muted p-2">
      <p className="text-xs text-muted-foreground">Value</p>
      <p className="font-medium">
        ${property.currentValuation?.toLocaleString()}
      </p>
    </div>
    <div className="rounded-md bg-muted p-2">
      <p className="text-xs text-muted-foreground">Monthly Income</p>
      <p className="font-medium">
        ${property.monthly_income?.toLocaleString()}
      </p>
    </div>
    <div className="rounded-md bg-muted p-2">
      <p className="text-xs text-muted-foreground">Monthly Expenses</p>
      <p className="font-medium">${property.expenses?.toLocaleString()}</p>
    </div>
    <div className="rounded-md bg-muted p-2">
      <p className="text-xs text-muted-foreground">Type</p>
      <p className="font-medium">{property.type}</p>
    </div>
  </div>
);

// Property Occupancy Component
const PropertyOccupancy = ({ occupancy }: { occupancy: number }) => (
  <div className="mt-4">
    <div className="flex items-center justify-between">
      <p className="text-sm">Occupancy</p>
      <p className="text-sm font-medium">{occupancy}%</p>
    </div>
    <Progress value={occupancy} className="mt-2" />
  </div>
);

// Property Card Component
function PropertyCard({ property }: { property: Property }) {
  const statusBadge = getStatusBadge(property.status);
  const showOccupancy = property.status === "active";

  return (
    <Card>
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={property.image || "/placeholder.svg"}
            alt={property.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute right-2 top-2">
            <Badge variant={statusBadge.variant as any}>
              {statusBadge.text}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{property.name}</CardTitle>
            {property.street_Name
              ? property.street_Name
              : property.street_name &&
                property.state &&
                property.country && (
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="mr-1 h-3 w-3" />
                    {`${property.street_name}, ${property.state} ${property.country}`}
                  </CardDescription>
                )}

            {property.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {property.description}
              </p>
            )}
          </div>
          <PropertyActions />
        </div>

        <PropertyDetails property={property} />
        <PropertyStats property={property} />
        {showOccupancy && <PropertyOccupancy occupancy={property.occupancy} />}
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Link href={`/properties/${property.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            More Detail
          </Button>
        </Link>
        <Link
          href={`/properties/${property.id}?tab=cashflow`}
          className="w-full"
        >
          <Button size="sm" className="w-full">
            <TrendingUp className="mr-2 h-4 w-4" />
            Cash Flow
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export interface PropertyListProps {
  properties?: Property[];
  isLoading?: boolean;
}

export function PropertyList({
  properties = [],
  isLoading = false,
}: PropertyListProps) {
  const [view, setView] = useState("grid");
  const [selectedTab, setSelectedTab] = useState("all");

  // Filter properties by type based on selected tab
  const getFilteredProperties = () => {
    // Filter by property type
    if (selectedTab === "all") return properties;
    if (selectedTab === "commercial")
      return properties.filter((p) => p.type === "Commercial");
    if (selectedTab === "residential")
      return properties.filter((p) => p.type === "Residential");
    if (selectedTab === "land")
      return properties.filter((p) => p.type === "Land");

    // Filter by status
    if (selectedTab === "active")
      return properties.filter((p) => p.status === "active");
    if (selectedTab === "prospect")
      return properties.filter((p) => p.status === "prospect");
    if (selectedTab === "under-contract")
      return properties.filter((p) => p.status === "under-contract");
    if (selectedTab === "in-development")
      return properties.filter((p) => p.status === "in-development");
    if (selectedTab === "for-sale")
      return properties.filter((p) => p.status === "for-sale");
    if (selectedTab === "pending-sale")
      return properties.filter((p) => p.status === "pending-sale");
    if (selectedTab === "archived")
      return properties.filter((p) => p.status === "archived");

    return properties;
  };

  const filteredProperties = getFilteredProperties();

  console.log("Filtered Properties:", filteredProperties);

  // Empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg border border-dashed">
      <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No properties found</h3>
      <p className="text-muted-foreground max-w-md mb-4">
        You don't have any properties yet. Click the "Add Property" button to
        get started.
      </p>
    </div>
  );

  // Loading skeletons
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-x-1 rounded-lg border p-1 w-fit">
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-8 w-24 rounded" />
            <Skeleton className="h-8 w-24 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16 rounded" />
            <Skeleton className="h-8 w-16 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  // If there are no properties at all, show the empty state
  if (properties.length === 0 && filteredProperties.length === 0) {
    return <EmptyState />;
  }

  console.log("Filtered Properties after tab selection:", filteredProperties);

  return (
    <div className="space-y-4">
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="residential">Residential</TabsTrigger>
            <TabsTrigger value="commercial">Commercial</TabsTrigger>
            <TabsTrigger value="land">Land</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="prospect">Prospect</TabsTrigger>
            <TabsTrigger value="in-development">Development</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("grid")}
            >
              Grid
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("list")}
            >
              List
            </Button>
          </div>
        </div>
        <TabsContent value="all" className="mt-4">
          {filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No properties in this category
                </p>
              </CardContent>
            </Card>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <PropertyListItem key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="commercial" className="mt-4">
          {filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No commercial properties found
                </p>
              </CardContent>
            </Card>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <PropertyListItem key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="residential" className="mt-4">
          {filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No residential properties found
                </p>
              </CardContent>
            </Card>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <PropertyListItem key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="land" className="mt-4">
          {filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No land properties found
                </p>
              </CardContent>
            </Card>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <PropertyListItem key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="development" className="mt-4">
          {filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No development properties found
                </p>
              </CardContent>
            </Card>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <PropertyListItem key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          {filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No active properties found
                </p>
              </CardContent>
            </Card>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <PropertyListItem key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="prospect" className="mt-4">
          {filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No prospect properties found
                </p>
              </CardContent>
            </Card>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <PropertyListItem key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="in-development" className="mt-4">
          {filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center">
                <p className="text-center text-muted-foreground">
                  No properties in development found
                </p>
              </CardContent>
            </Card>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <PropertyListItem key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PropertyListItem({ property }: { property: Property }) {
  const description =
    property.description || `${property.type} property in ${property.location}`;
  const statusBadge = getStatusBadge(property.status);
  const showOccupancy = property.status === "active";

  return (
    <Card>
      <div className="flex flex-col md:flex-row">
        <div className="h-48 w-full md:h-auto md:w-48 overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
          <img
            src={property.image || "/placeholder.svg"}
            alt={property.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{property.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="mr-1 h-3 w-3" />
                  {property.location}
                </CardDescription>
                {description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {property.area && property.area > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {property.area.toLocaleString()} sqft
                    </Badge>
                  )}
                  {property.bedrooms && property.bedrooms > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {property.bedrooms}{" "}
                      {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                    </Badge>
                  )}
                  {property.bathrooms && property.bathrooms > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {property.bathrooms}{" "}
                      {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                    </Badge>
                  )}
                  {property.yearBuilt && property.yearBuilt > 0 && (
                    <Badge variant="outline" className="text-xs">
                      Built {property.yearBuilt}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={statusBadge.variant as any}>
                  {statusBadge.text}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Property</DropdownMenuItem>
                    <DropdownMenuItem>Upload Documents</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Cash Flow Analysis</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Value</p>
                <p className="font-medium">
                  ${property.value.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="font-medium">
                  ${property.income.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Monthly Expenses
                </p>
                <p className="font-medium">
                  ${property.expenses.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{property.type}</p>
              </div>
            </div>
            {showOccupancy && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Occupancy</p>
                  <p className="text-sm font-medium">{property.occupancy}%</p>
                </div>
                <Progress value={property.occupancy} className="mt-2" />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href={`/properties/${property.id}`}>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                More Detail
              </Button>
            </Link>
            <Link href={`/properties/${property.id}?tab=cashflow`}>
              <Button size="sm">
                <TrendingUp className="mr-2 h-4 w-4" />
                Cash Flow
              </Button>
            </Link>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
