"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, MapPin, MoreHorizontal, TrendingUp, Building2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

export interface Property {
  id: number | string
  name: string
  type: string
  location: string
  value: number
  income: number
  expenses: number
  occupancy: number
  status: "active" | "prospect" | "under-contract" | "in-development" | "for-sale" | "pending-sale" | "archived"
  image: string
  extendedData?: any // Store additional property data
}

// Sample data - will be replaced by API calls
export const properties: Property[] = [
  {
    id: 1,
    name: "123 Main Street",
    type: "Commercial",
    location: "New York, NY",
    value: 2500000,
    income: 18500,
    expenses: 5200,
    occupancy: 95,
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Oceanview Condo",
    type: "Residential",
    location: "Miami, FL",
    value: 1800000,
    income: 12000,
    expenses: 3800,
    occupancy: 100,
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Sunset Heights Apartment Complex",
    type: "Multi-family",
    location: "Los Angeles, CA",
    value: 4200000,
    income: 32000,
    expenses: 12500,
    occupancy: 88,
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Downtown Office Building",
    type: "Commercial",
    location: "Chicago, IL",
    value: 5800000,
    income: 45000,
    expenses: 18000,
    occupancy: 92,
    status: "active",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    name: "Mountain View Development",
    type: "Development",
    location: "Denver, CO",
    value: 3500000,
    income: 0,
    expenses: 8500,
    occupancy: 0,
    status: "in-development",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export interface PropertyListProps {
  properties?: Property[]
  isLoading?: boolean
}

export function PropertyList({ properties = [], isLoading = false }: PropertyListProps) {
  const [view, setView] = useState("grid")
  const [selectedTab, setSelectedTab] = useState("all")

  // Filter properties by type based on selected tab
  const getFilteredProperties = () => {
    // Filter by property type
    if (selectedTab === "all") return properties
    if (selectedTab === "commercial") return properties.filter(p => p.type === "Commercial")
    if (selectedTab === "residential") return properties.filter(p => p.type === "Residential")
    if (selectedTab === "land") return properties.filter(p => p.type === "Land")
    
    // Filter by status
    if (selectedTab === "active") return properties.filter(p => p.status === "active")
    if (selectedTab === "prospect") return properties.filter(p => p.status === "prospect")
    if (selectedTab === "under-contract") return properties.filter(p => p.status === "under-contract")
    if (selectedTab === "in-development") return properties.filter(p => p.status === "in-development")
    if (selectedTab === "for-sale") return properties.filter(p => p.status === "for-sale")
    if (selectedTab === "pending-sale") return properties.filter(p => p.status === "pending-sale")
    if (selectedTab === "archived") return properties.filter(p => p.status === "archived")
    
    return properties
  }

  const filteredProperties = getFilteredProperties()

  // Empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg border border-dashed">
      <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No properties found</h3>
      <p className="text-muted-foreground max-w-md mb-4">
        You don't have any properties yet. Click the "Add Property" button to get started.
      </p>
    </div>
  )

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
          {Array(6).fill(0).map((_, i) => (
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
    )
  }

  // If there are no properties at all, show the empty state
  if (properties.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
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
            <Button variant={view === "grid" ? "default" : "outline"} size="sm" onClick={() => setView("grid")}>
              Grid
            </Button>
            <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
              List
            </Button>
          </div>
        </div>
        <TabsContent value="all" className="mt-4">
          {filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="flex h-40 items-center justify-center">
                <p className="text-center text-muted-foreground">No properties in this category</p>
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
                <p className="text-center text-muted-foreground">No commercial properties found</p>
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
                <p className="text-center text-muted-foreground">No residential properties found</p>
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
                <p className="text-center text-muted-foreground">No land properties found</p>
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
                <p className="text-center text-muted-foreground">No development properties found</p>
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
                <p className="text-center text-muted-foreground">No active properties found</p>
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
                <p className="text-center text-muted-foreground">No prospect properties found</p>
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
                <p className="text-center text-muted-foreground">No properties in development found</p>
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
  )
}

function PropertyCard({ property }: { property: Property }) {
  const hasExtendedData = !!property.extendedData;
  
  // Get description from extended data if available
  const description = hasExtendedData ? 
    property.extendedData.description : 
    `${property.type} property in ${property.location}`;
  
  // Get specific details from extended data
  const details = hasExtendedData ? {
    squareFeet: property.extendedData.squareFeet,
    bedrooms: property.extendedData.bedrooms,
    bathrooms: property.extendedData.bathrooms
  } : null;
  
  // Get badge variant and text based on status
  const getStatusBadge = () => {
    switch (property.status) {
      case "prospect":
        return { variant: "outline", text: "Prospect" };
      case "under-contract":
        return { variant: "secondary", text: "Under Contract" };
      case "active":
        return { variant: "default", text: "Active" };
      case "in-development":
        return { variant: "secondary", text: "In Development" };
      case "for-sale":
        return { variant: "destructive", text: "For Sale" };
      case "pending-sale":
        return { variant: "outline", text: "Pending Sale" };
      case "archived":
        return { variant: "outline", text: "Archived" };
      default:
        return { variant: "default", text: "Active" };
    }
  };
  
  const statusBadge = getStatusBadge();
  
  // Only show occupancy for active properties
  const showOccupancy = property.status === "active";
  
  return (
    <Card>
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img src={property.image || "/placeholder.svg"} alt={property.name} className="h-full w-full object-cover" />
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
            <CardDescription className="flex items-center mt-1">
              <MapPin className="mr-1 h-3 w-3" />
              {property.location}
            </CardDescription>
            {description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {description}
              </p>
            )}
          </div>
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
        
        {details && details.squareFeet > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {details.squareFeet > 0 && (
              <Badge variant="outline" className="text-xs">
                {details.squareFeet.toLocaleString()} sqft
              </Badge>
            )}
            {details.bedrooms > 0 && (
              <Badge variant="outline" className="text-xs">
                {details.bedrooms} {details.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
              </Badge>
            )}
            {details.bathrooms > 0 && (
              <Badge variant="outline" className="text-xs">
                {details.bathrooms} {details.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
              </Badge>
            )}
          </div>
        )}
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Value</p>
            <p className="font-medium">${property.value.toLocaleString()}</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Monthly Income</p>
            <p className="font-medium">${property.income.toLocaleString()}</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Monthly Expenses</p>
            <p className="font-medium">${property.expenses.toLocaleString()}</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Type</p>
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
      <CardFooter className="flex justify-between p-4 pt-0">
        <Link href={`/properties/${property.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            More Detail
          </Button>
        </Link>
        <Link href={`/properties/${property.id}?tab=cashflow`} className="w-full">
          <Button size="sm" className="w-full">
            <TrendingUp className="mr-2 h-4 w-4" />
            Cash Flow
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function PropertyListItem({ property }: { property: Property }) {
  const hasExtendedData = !!property.extendedData;
  
  // Get description from extended data if available
  const description = hasExtendedData ? 
    property.extendedData.description : 
    `${property.type} property in ${property.location}`;
  
  // Get specific details from extended data
  const details = hasExtendedData ? {
    squareFeet: property.extendedData.squareFeet,
    bedrooms: property.extendedData.bedrooms,
    bathrooms: property.extendedData.bathrooms,
    yearBuilt: property.extendedData.yearBuilt
  } : null;
  
  // Get badge variant and text based on status
  const getStatusBadge = () => {
    switch (property.status) {
      case "prospect":
        return { variant: "outline", text: "Prospect" };
      case "under-contract":
        return { variant: "secondary", text: "Under Contract" };
      case "active":
        return { variant: "default", text: "Active" };
      case "in-development":
        return { variant: "secondary", text: "In Development" };
      case "for-sale":
        return { variant: "destructive", text: "For Sale" };
      case "pending-sale":
        return { variant: "outline", text: "Pending Sale" };
      case "archived":
        return { variant: "outline", text: "Archived" };
      default:
        return { variant: "default", text: "Active" };
    }
  };
  
  const statusBadge = getStatusBadge();
  
  // Only show occupancy for active properties
  const showOccupancy = property.status === "active";
  
  return (
    <Card>
      <div className="flex flex-col md:flex-row">
        <div className="h-48 w-full md:h-auto md:w-48 overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
          <img src={property.image || "/placeholder.svg"} alt={property.name} className="h-full w-full object-cover" />
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
                {details && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {details.squareFeet > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {details.squareFeet.toLocaleString()} sqft
                      </Badge>
                    )}
                    {details.bedrooms > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {details.bedrooms} {details.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                      </Badge>
                    )}
                    {details.bathrooms > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {details.bathrooms} {details.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                      </Badge>
                    )}
                    {details.yearBuilt > 0 && (
                      <Badge variant="outline" className="text-xs">
                        Built {details.yearBuilt}
                      </Badge>
                    )}
                  </div>
                )}
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
                <p className="font-medium">${property.value.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="font-medium">${property.income.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                <p className="font-medium">${property.expenses.toLocaleString()}</p>
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
  )
}

