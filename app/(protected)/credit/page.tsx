"use client"

import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CreditFacilitiesList } from "@/components/credit/credit-facilities-list"
import { CreditSummary } from "@/components/credit/credit-summary"

export default function CreditPage() {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Credit Facilities</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your credit facilities and monitor leverage</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row animate-slide-up">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search facilities..." className="w-full pl-8 sm:w-[300px]" />
          </div>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Add Credit Facility
          </Button>
        </div>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <CreditSummary />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <CreditFacilitiesList />
      </div>
    </div>
  )
}

