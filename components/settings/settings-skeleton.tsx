"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface SettingsSkeletonProps {
  title?: string
  fieldCount?: number
}

export function SettingsSkeleton({ title = "Loading...", fieldCount = 5 }: SettingsSkeletonProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-40" />
          </CardTitle>
          <Skeleton className="h-4 w-3/4 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array(fieldCount).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
                {Math.random() > 0.6 && (
                  <Skeleton className="h-3 w-2/3" />
                )}
              </div>
            ))}
            
            {/* Save Button */}
            <Skeleton className="h-10 w-32 mt-8" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
