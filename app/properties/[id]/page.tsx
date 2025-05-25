"use client"

import { PropertyDetail } from "@/components/properties/property-detail"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchInvestmentPropertyById, fetchPropertyById, fetchPropertyCashFlow } from "@/lib/api/investments-properties"
import { Property } from "@/components/properties/property-list"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function PropertyPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Set active tab from URL param if available
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["overview", "financial", "cashflow", "documents"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])
  
  // Get property ID from route
  const propertyId = params?.id ? params.id.toString() : undefined
  
  // Fetch property data
  useEffect(() => {
    async function loadProperty() {
      if (!propertyId) {
        setError("Property ID is required")
        setIsLoading(false)
        return
      }
      
      try {
        setIsLoading(true)
        const data = await fetchPropertyById(propertyId)
        if (!data) {
          setError("Property not found")
        } else {
          setProperty(data)
          setError(null)
        }
      } catch (err) {
        console.error("Failed to load property:", err)
        setError("Failed to load property details")
      } finally {
        setIsLoading(false)
      }
    }
    
    loadProperty()
  }, [propertyId])
  
  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-full max-w-[300px]" />
                <div className="grid gap-6 md:grid-cols-2">
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-semibold text-destructive">{error}</h2>
            <p className="text-muted-foreground">
              Please try again or contact support if the issue persists.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="container py-6">
      {/* We pass the property ID to the component which will use either real data or sample data */}
      <PropertyDetail propertyId={propertyId as any} initialTab={activeTab} />
    </div>
  )
} 