"use client";

import Link from "next/link";
import { Property } from "./types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MapPin, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PropertyActions } from "./property-actions";
import { getStatusBadge } from "./utils";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
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
            <CardDescription className="flex items-center mt-1">
              <MapPin className="mr-1 h-3 w-3" />
              {property.location}
            </CardDescription>
            {property.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {property.description}
              </p>
            )}
          </div>
          <PropertyActions />
        </div>

        {/* Property Details */}
        {(property.area || property.bedrooms || property.bathrooms || property.yearBuilt) && (
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
                {property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
              </Badge>
            )}
            {property.yearBuilt && (
              <Badge variant="outline" className="text-xs">
                Built {property.yearBuilt}
              </Badge>
            )}
          </div>
        )}

        {/* Property Stats */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Value</p>
            <p className="font-medium">${(property.value ?? 0).toLocaleString()}</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Monthly Income</p>
            <p className="font-medium">${(property.income ?? property.monthlyIncome ?? 0).toLocaleString()}</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Monthly Expenses</p>
            <p className="font-medium">${(property.expenses ?? 0).toLocaleString()}</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="font-medium">{property.type}</p>
          </div>
        </div>

        {/* Occupancy */}
        {showOccupancy && property.occupancy !== undefined && (
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
  );
}
