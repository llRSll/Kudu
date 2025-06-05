"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PropertyPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      
      <Skeleton className="h-12 w-full" />
      
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <Skeleton className="h-[300px] w-full rounded-t-lg" />
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <Skeleton className="h-8 w-[200px] mb-2" />
                  <Skeleton className="h-4 w-[250px]" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-[100px] mb-2" />
                  <Skeleton className="h-6 w-[100px]" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-[80px] mb-2" />
                    <Skeleton className="h-6 w-[100px]" />
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6 md:col-span-3">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-[180px] mb-4" />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-[120px] mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-[120px] mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
                
                <Skeleton className="h-1 w-full" />
                
                <div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-5 w-[100px] mb-4" />
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-5 w-[120px]" />
                      <Skeleton className="h-5 w-[80px]" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-5 w-[100px] mb-4" />
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-5 w-[120px]" />
                      <Skeleton className="h-5 w-[80px]" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
