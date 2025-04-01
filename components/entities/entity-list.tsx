"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Building2, FileText, MoreHorizontal, Users, Briefcase, Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample data for entities
const entities = [
  {
    id: 1,
    name: "Doe Family Holdings, LLC",
    type: "Limited Liability Company",
    description: "Parent holding company for all family assets",
    taxClassification: "Partnership",
    jurisdiction: "Delaware",
    formationDate: "2010-05-12",
    assets: [
      { type: "Cash", value: 1500000 },
      { type: "Investments", value: 5000000 },
    ],
    members: [
      { name: "John Doe", role: "Manager", ownership: 50 },
      { name: "Jane Doe", role: "Manager", ownership: 50 },
    ],
    status: "active",
  },
  {
    id: 2,
    name: "Doe Real Estate, LLC",
    type: "Limited Liability Company",
    description: "Holds all real estate assets",
    taxClassification: "Disregarded Entity",
    jurisdiction: "Delaware",
    formationDate: "2012-03-18",
    assets: [{ type: "Real Estate", value: 12000000 }],
    members: [{ name: "Doe Family Holdings, LLC", role: "Sole Member", ownership: 100 }],
    status: "active",
  },
  {
    id: 3,
    name: "Doe Investments, Inc",
    type: "Corporation",
    description: "Investment vehicle for securities and alternative investments",
    taxClassification: "C-Corporation",
    jurisdiction: "Delaware",
    formationDate: "2014-07-22",
    assets: [
      { type: "Securities", value: 8500000 },
      { type: "Alternative Investments", value: 3500000 },
    ],
    members: [{ name: "Doe Family Holdings, LLC", role: "Shareholder", ownership: 100 }],
    status: "active",
  },
  {
    id: 4,
    name: "Doe Family Trust",
    type: "Trust",
    description: "Irrevocable trust for estate planning and asset protection",
    taxClassification: "Grantor Trust",
    jurisdiction: "Nevada",
    formationDate: "2015-11-05",
    assets: [
      { type: "Cash", value: 500000 },
      { type: "Securities", value: 2500000 },
    ],
    members: [
      { name: "John Doe", role: "Grantor", ownership: 0 },
      { name: "Jane Doe", role: "Grantor", ownership: 0 },
      { name: "First National Trust Company", role: "Trustee", ownership: 0 },
      { name: "Doe Children", role: "Beneficiaries", ownership: 0 },
    ],
    status: "active",
  },
  {
    id: 5,
    name: "123 Main St, LLC",
    type: "Limited Liability Company",
    description: "Holds commercial property at 123 Main Street",
    taxClassification: "Disregarded Entity",
    jurisdiction: "New York",
    formationDate: "2016-02-28",
    assets: [{ type: "Real Estate", value: 4500000 }],
    members: [{ name: "Doe Real Estate, LLC", role: "Sole Member", ownership: 100 }],
    status: "active",
  },
  {
    id: 6,
    name: "Oceanview Properties, LLC",
    type: "Limited Liability Company",
    description: "Holds residential properties in Miami",
    taxClassification: "Disregarded Entity",
    jurisdiction: "Florida",
    formationDate: "2018-05-10",
    assets: [{ type: "Real Estate", value: 3500000 }],
    members: [{ name: "Doe Real Estate, LLC", role: "Sole Member", ownership: 100 }],
    status: "active",
  },
  {
    id: 7,
    name: "Mountain Development, LLC",
    type: "Limited Liability Company",
    description: "Development project in Colorado",
    taxClassification: "Disregarded Entity",
    jurisdiction: "Colorado",
    formationDate: "2022-09-15",
    assets: [{ type: "Real Estate", value: 3500000 }],
    members: [{ name: "Doe Real Estate, LLC", role: "Sole Member", ownership: 100 }],
    status: "active",
  },
  {
    id: 8,
    name: "Legacy Charitable Foundation",
    type: "Non-Profit Corporation",
    description: "Family charitable foundation",
    taxClassification: "501(c)(3)",
    jurisdiction: "Delaware",
    formationDate: "2020-12-01",
    assets: [
      { type: "Cash", value: 1000000 },
      { type: "Securities", value: 4000000 },
    ],
    members: [
      { name: "John Doe", role: "Director", ownership: 0 },
      { name: "Jane Doe", role: "Director", ownership: 0 },
      { name: "Sarah Johnson", role: "Director", ownership: 0 },
    ],
    status: "active",
  },
]

export function EntityList() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Entities</TabsTrigger>
          <TabsTrigger value="llc">LLCs</TabsTrigger>
          <TabsTrigger value="corporations">Corporations</TabsTrigger>
          <TabsTrigger value="trusts">Trusts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entities.map((entity) => (
              <EntityCard key={entity.id} entity={entity} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="llc" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entities
              .filter((e) => e.type === "Limited Liability Company")
              .map((entity) => (
                <EntityCard key={entity.id} entity={entity} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="corporations" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entities
              .filter((e) => e.type === "Corporation" || e.type === "Non-Profit Corporation")
              .map((entity) => (
                <EntityCard key={entity.id} entity={entity} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="trusts" className="mt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entities
              .filter((e) => e.type === "Trust")
              .map((entity) => (
                <EntityCard key={entity.id} entity={entity} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EntityCard({ entity }) {
  // Calculate total assets value
  const totalAssets = entity.assets.reduce((sum, asset) => sum + asset.value, 0)

  // Format formation date
  const formationDate = new Date(entity.formationDate)
  const formattedFormationDate = formationDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Determine entity icon
  const EntityIcon = () => {
    switch (entity.type) {
      case "Limited Liability Company":
        return <Building2 className="h-5 w-5" />
      case "Corporation":
      case "Non-Profit Corporation":
        return <Briefcase className="h-5 w-5" />
      case "Trust":
        return <Shield className="h-5 w-5" />
      default:
        return <Building2 className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center">
              <EntityIcon />
              <span className="ml-2">{entity.name}</span>
            </CardTitle>
            <CardDescription className="mt-1">{entity.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={entity.status === "inactive" ? "secondary" : "default"}>
              {entity.status === "inactive" ? "Inactive" : "Active"}
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
                <DropdownMenuItem>Edit Entity</DropdownMenuItem>
                <DropdownMenuItem>Upload Documents</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Generate Reports</DropdownMenuItem>
                <DropdownMenuItem>View Tax Information</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="font-medium">{entity.type}</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Tax Classification</p>
            <p className="font-medium">{entity.taxClassification}</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Jurisdiction</p>
            <p className="font-medium">{entity.jurisdiction}</p>
          </div>
          <div className="rounded-md bg-muted p-2">
            <p className="text-xs text-muted-foreground">Formation Date</p>
            <p className="font-medium">{formattedFormationDate}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Assets</p>
          <div className="space-y-2">
            {entity.assets.map((asset, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{asset.type}</span>
                <span className="font-medium">${asset.value.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <span className="font-medium">Total</span>
              <span className="font-medium">${totalAssets.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Members/Ownership</p>
          <div className="space-y-2">
            {entity.members.map((member, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{member.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground mr-2">{member.role}</span>
                  {member.ownership > 0 && <span>{member.ownership}%</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <Button variant="outline" size="sm" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Documents
        </Button>
        <Button size="sm" className="w-full">
          <BarChart3 className="mr-2 h-4 w-4" />
          Financial Reports
        </Button>
      </CardFooter>
    </Card>
  )
}

