"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building,
  Calendar,
  DollarSign,
  FileText,
  MapPin,
  MoreHorizontal,
  Pencil,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Progress } from "@/components/ui/progress";
import { Property } from "./types";
import { PropertyWithAddress } from "@/lib/api/properties";
import {
  FilterControls,
  BarChart,
  DateRangeSelector,
} from "./portfolio-summary";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

// Extend Property interface for the detail view
interface PropertyDetail {
  id: string;
  address?: string;
  purchaseDate?: string | Date;
  tenants?: Tenant[];
  maintenanceItems?: MaintenanceItem[];
  documents?: Document[];
  cashFlowData?: CashFlowItem[];
  squareFeet?: number;
  yearBuilt?: number;
  zoning?: string;
  parkingSpaces?: number;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
  amenities?: string[] | unknown;
  upcomingCashFlows?: UpcomingCashFlow[];
  valuationHistory?: ValuationRecord[];
  // Include all other properties from Property interface
  name?: string;
  location?: string;
  value?: number;
  income?: number;
  expenses?: number;
  occupancy?: number;
  status?: string;
  image?: string;
  type?: string;
  developmentStages?: DevelopmentStage[];
}

interface Tenant {
  id: number;
  name: string;
  leaseStart: Date;
  leaseEnd: Date;
  rentAmount: number;
  status: "active" | "late" | "ending";
}

interface MaintenanceItem {
  id: number;
  title: string;
  description: string;
  cost: number;
  date: Date;
  status: "scheduled" | "completed" | "pending";
}

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: Date;
  size: string;
  folderId?: number;
}

interface CashFlowItem {
  month: string;
  income: number;
  expenses: number;
  maintenance: number;
  date: Date;
  amount: number;
  [key: string]: number | string | Date;
}

interface UpcomingCashFlow {
  id: number;
  date: Date;
  amount: number;
  type: "income" | "expense";
  description: string;
  status: "scheduled" | "pending" | "completed";
}

interface ValuationRecord {
  id: number;
  date: Date;
  value: number;
  changePercent: number;
  appraisedBy?: string;
}

interface DevelopmentStage {
  id: number;
  name: string;
  description: string;
  plannedDate: Date;
  actualDate?: Date;
  budget: number;
  actualCost?: number;
  status: "planned" | "in_progress" | "completed" | "delayed";
  completionPercentage: number;
}

interface DocumentFolder {
  id: number;
  name: string;
  documents: Document[];
}

// Sample data for a property detail
const samplePropertyDetail: PropertyDetail = {
  id: "1",
  name: "123 Main Street",
  type: "Commercial",
  location: "New York, NY",
  address: "123 Main Street, New York, NY 10001",
  value: 2500000,
  income: 18500,
  expenses: 5200,
  occupancy: 95,
  status: "active",
  image: "/placeholder.svg?height=400&width=600",
  purchaseDate: new Date(2020, 5, 15),
  squareFeet: 12500,
  yearBuilt: 2010,
  zoning: "Commercial C-2",
  parkingSpaces: 45,
  bedrooms: 0,
  bathrooms: 4,
  description:
    "Modern commercial building in prime downtown location with excellent visibility and access to public transportation. Features open floor plans, high ceilings, and energy-efficient systems.",
  amenities: [
    "Elevator",
    "HVAC System",
    "Security System",
    "Parking Garage",
    "Loading Dock",
    "Fiber Internet",
  ],
  tenants: [
    {
      id: 1,
      name: "ABC Corp",
      leaseStart: new Date(2022, 1, 1),
      leaseEnd: new Date(2025, 1, 1),
      rentAmount: 12500,
      status: "active",
    },
    {
      id: 2,
      name: "XYZ Startup",
      leaseStart: new Date(2023, 3, 15),
      leaseEnd: new Date(2024, 3, 15),
      rentAmount: 6000,
      status: "ending",
    },
  ],
  maintenanceItems: [
    {
      id: 1,
      title: "HVAC Repair",
      description: "Replace faulty compressor in main HVAC system",
      cost: 3200,
      date: new Date(2023, 11, 10),
      status: "completed",
    },
    {
      id: 2,
      title: "Roof Inspection",
      description: "Annual roof inspection and minor repairs",
      cost: 1500,
      date: new Date(2024, 5, 20),
      status: "scheduled",
    },
    {
      id: 3,
      title: "Lobby Renovation",
      description: "Update lobby furniture and paint",
      cost: 8500,
      date: new Date(2024, 3, 5),
      status: "pending",
    },
  ],
  documents: [
    {
      id: 1,
      name: "Purchase Agreement",
      type: "Legal",
      uploadDate: new Date(2020, 5, 10),
      size: "2.4 MB",
      folderId: 1,
    },
    {
      id: 2,
      name: "Property Insurance",
      type: "Insurance",
      uploadDate: new Date(2024, 0, 15),
      size: "1.8 MB",
      folderId: 3,
    },
    {
      id: 3,
      name: "Tenant Lease - ABC Corp",
      type: "Lease",
      uploadDate: new Date(2022, 0, 25),
      size: "3.1 MB",
      folderId: 2,
    },
    {
      id: 4,
      name: "Property Tax Statement 2023",
      type: "Tax",
      uploadDate: new Date(2023, 3, 10),
      size: "1.2 MB",
      folderId: 3,
    },
    {
      id: 5,
      name: "Building Code Compliance",
      type: "Legal",
      uploadDate: new Date(2021, 8, 12),
      size: "3.6 MB",
      folderId: 1,
    },
    {
      id: 6,
      name: "Property Survey",
      type: "Legal",
      uploadDate: new Date(2020, 5, 5),
      size: "8.2 MB",
      folderId: 1,
    },
    {
      id: 7,
      name: "Tenant Lease - XYZ Startup",
      type: "Lease",
      uploadDate: new Date(2023, 3, 10),
      size: "2.9 MB",
      folderId: 2,
    },
    {
      id: 8,
      name: "Maintenance Contract",
      type: "Service",
      uploadDate: new Date(2023, 6, 18),
      size: "1.5 MB",
      folderId: 4,
    },
    {
      id: 9,
      name: "HVAC Service Records",
      type: "Service",
      uploadDate: new Date(2023, 11, 5),
      size: "4.2 MB",
      folderId: 4,
    },
  ],
  cashFlowData: [
    {
      month: "Jan",
      income: 18500,
      expenses: 5200,
      maintenance: 800,
      date: new Date(2024, 0, 1),
      amount: 18500,
    },
    {
      month: "Feb",
      income: 18500,
      expenses: 5100,
      maintenance: 0,
      date: new Date(2024, 1, 1),
      amount: 18500,
    },
    {
      month: "Mar",
      income: 18500,
      expenses: 5300,
      maintenance: 1200,
      date: new Date(2024, 2, 1),
      amount: 18500,
    },
    {
      month: "Apr",
      income: 18500,
      expenses: 5200,
      maintenance: 0,
      date: new Date(2024, 3, 1),
      amount: 18500,
    },
    {
      month: "May",
      income: 18500,
      expenses: 5400,
      maintenance: 3200,
      date: new Date(2024, 4, 1),
      amount: 18500,
    },
    {
      month: "Jun",
      income: 18500,
      expenses: 5250,
      maintenance: 0,
      date: new Date(2024, 5, 1),
      amount: 18500,
    },
  ],
  upcomingCashFlows: [
    {
      id: 1,
      date: new Date(2024, 6, 15),
      amount: 18500,
      type: "income",
      description: "Tenant Rent - ABC Corp",
      status: "scheduled",
    },
    {
      id: 2,
      date: new Date(2024, 6, 20),
      amount: 6000,
      type: "income",
      description: "Tenant Rent - XYZ Startup",
      status: "scheduled",
    },
    {
      id: 3,
      date: new Date(2024, 6, 30),
      amount: 3200,
      type: "expense",
      description: "Property Tax Payment",
      status: "scheduled",
    },
    {
      id: 4,
      date: new Date(2024, 7, 5),
      amount: 1800,
      type: "expense",
      description: "Insurance Premium",
      status: "pending",
    },
    {
      id: 5,
      date: new Date(2024, 7, 15),
      amount: 18500,
      type: "income",
      description: "Tenant Rent - ABC Corp",
      status: "pending",
    },
  ],
  valuationHistory: [
    {
      id: 1,
      date: new Date(2020, 5, 15),
      value: 2200000,
      changePercent: 0,
      appraisedBy: "Smith & Associates",
    },
    {
      id: 2,
      date: new Date(2021, 6, 10),
      value: 2320000,
      changePercent: 5.45,
      appraisedBy: "Commercial Appraisers Inc.",
    },
    {
      id: 3,
      date: new Date(2022, 5, 25),
      value: 2400000,
      changePercent: 3.45,
      appraisedBy: "Urban Property Valuations",
    },
    {
      id: 4,
      date: new Date(2023, 7, 15),
      value: 2500000,
      changePercent: 4.17,
      appraisedBy: "Smith & Associates",
    },
  ],
  developmentStages: [
    {
      id: 1,
      name: "Land Acquisition",
      description: "Purchase of property and land transfer",
      plannedDate: new Date(2023, 5, 10),
      actualDate: new Date(2023, 5, 15),
      budget: 1800000,
      actualCost: 1820000,
      status: "completed",
      completionPercentage: 100,
    },
    {
      id: 2,
      name: "Planning & Permits",
      description: "Architectural plans and building permits",
      plannedDate: new Date(2023, 7, 20),
      actualDate: new Date(2023, 8, 5),
      budget: 75000,
      actualCost: 82000,
      status: "completed",
      completionPercentage: 100,
    },
    {
      id: 3,
      name: "Foundation",
      description: "Site preparation and foundation work",
      plannedDate: new Date(2023, 9, 15),
      actualDate: new Date(2023, 9, 20),
      budget: 350000,
      actualCost: 362000,
      status: "completed",
      completionPercentage: 100,
    },
    {
      id: 4,
      name: "Framing",
      description: "Structural framing of the building",
      plannedDate: new Date(2023, 11, 10),
      actualDate: new Date(2023, 11, 18),
      budget: 420000,
      actualCost: 405000,
      status: "completed",
      completionPercentage: 100,
    },
    {
      id: 5,
      name: "Exterior Finishing",
      description: "Roofing, siding, windows and doors",
      plannedDate: new Date(2024, 1, 15),
      actualDate: new Date(2024, 1, 25),
      budget: 380000,
      actualCost: 395000,
      status: "completed",
      completionPercentage: 100,
    },
    {
      id: 6,
      name: "Interior Systems",
      description: "HVAC, plumbing, and electrical",
      plannedDate: new Date(2024, 3, 1),
      actualDate: new Date(2024, 3, 5),
      budget: 450000,
      actualCost: 455000,
      status: "in_progress",
      completionPercentage: 85,
    },
    {
      id: 7,
      name: "Interior Finishing",
      description: "Drywall, flooring, painting, fixtures",
      plannedDate: new Date(2024, 5, 1),
      actualDate: undefined,
      budget: 520000,
      actualCost: undefined,
      status: "planned",
      completionPercentage: 0,
    },
    {
      id: 8,
      name: "Final Inspection",
      description: "Inspections and certificate of occupancy",
      plannedDate: new Date(2024, 6, 15),
      actualDate: undefined,
      budget: 25000,
      actualCost: undefined,
      status: "planned",
      completionPercentage: 0,
    },
  ],
};

// Time periods for filter
const timePeriods = [
  { label: "Last 6 months", value: "6m" },
  { label: "Last 12 months", value: "12m" },
  { label: "Year to date", value: "ytd" },
  { label: "All time", value: "all" },
  { label: "Custom", value: "custom" },
];

// Cash flow types for filter
const cashFlowTypes = [
  { label: "All", value: "all" },
  { label: "Income", value: "income" },
  { label: "Expenses", value: "expenses" },
  { label: "Maintenance", value: "maintenance" },
];

// Define document folders
const documentFolders = [
  { id: 1, name: "Legal Documents" },
  { id: 2, name: "Tenant Leases" },
  { id: 3, name: "Financial Records" },
  { id: 4, name: "Maintenance Records" },
  { id: 5, name: "Other Documents" },
];

// Updated interface in property-detail.tsx
interface PropertyDetailProps {
  propertyId?: number;
  initialTab?: string;
}

export function PropertyDetail({
  propertyId,
  initialTab = "overview",
}: PropertyDetailProps) {
  const router = useRouter();
  const [property] = useState<PropertyDetail>(samplePropertyDetail);
  const [selectedPeriod, setSelectedPeriod] = useState("6m");
  const [selectedType, setSelectedType] = useState("all");
  const [dateRange, setDateRange] = useState<
    { from?: Date; to?: Date } | undefined
  >(undefined);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(1); // Default to first folder

  // Calculate net income with null safety
  const income = property.income ?? 0;
  const expenses = property.expenses ?? 0;
  const netIncome = income - expenses;
  const netIncomePercentage =
    income > 0 ? Math.round((netIncome / income) * 100) : 0;

  // Go back to property list
  const handleBack = () => {
    router.back();
  };

  // Get filtered cash flow data
  const getFilteredCashFlowData = () => {
    if (!property.cashFlowData) return [];

    let filteredData = [...property.cashFlowData];

    // Apply period filter
    switch (selectedPeriod) {
      case "6m":
        filteredData = filteredData.slice(-6);
        break;
      case "12m":
        filteredData = filteredData.slice(-12);
        break;
      case "ytd":
        const currentYear = new Date().getFullYear();
        filteredData = filteredData.filter(
          (d) => d.date.getFullYear() === currentYear
        );
        break;
      case "custom":
        if (dateRange?.from && dateRange?.to) {
          filteredData = filteredData.filter(
            (d) => d.date >= dateRange.from! && d.date <= dateRange.to!
          );
        }
        break;
    }

    // Update amounts based on selected type to ensure chart works properly
    return filteredData.map((item) => {
      const result = { ...item };
      if (selectedType === "income") {
        result.amount = item.income;
      } else if (selectedType === "expenses") {
        result.amount = item.expenses;
      } else if (selectedType === "maintenance") {
        result.amount = item.maintenance;
      } else {
        // "all" case - use income as default
        result.amount = item.income;
      }
      return result;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Button>
        <Button variant="outline" className="gap-1">
          <Pencil className="h-4 w-4" />
          Edit Property
        </Button>
      </div>

      {/* Main content */}
      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial & Tenants</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-7">
            {/* Property image and main details */}
            <Card className="md:col-span-4">
              <div className="relative h-[300px] w-full overflow-hidden rounded-t-lg">
                <img
                  src={property.image}
                  alt={property.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute right-3 top-3">
                  <Badge
                    variant={
                      property.status === "development"
                        ? "secondary"
                        : "default"
                    }
                  >
                    {property.status === "development"
                      ? "Development"
                      : "Active"}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-2xl">{property.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="mr-1 h-4 w-4" />
                      {property.address || property.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Property Type
                    </div>
                    <div className="font-medium">{property.type}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Value</div>
                    <div className="font-medium text-lg">
                      ${(property.value ?? 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Monthly Income
                    </div>
                    <div className="font-medium text-lg">
                      ${(property.income ?? 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Monthly Expenses
                    </div>
                    <div className="font-medium text-lg">
                      ${(property.expenses ?? 0).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Purchase Date
                    </div>
                    <div className="font-medium text-lg">
                      {property.purchaseDate
                        ? format(property.purchaseDate, "MMM d, yyyy")
                        : "N/A"}
                    </div>
                  </div>
                </div>

                {property.status !== "development" && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Occupancy</div>
                      <div className="text-sm font-medium">
                        {property.occupancy}%
                      </div>
                    </div>
                    <Progress value={property.occupancy} className="mt-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary cards */}
            <div className="space-y-6 md:col-span-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Monthly Income
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          ${(property.income ?? 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Monthly Expenses
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          ${(property.expenses ?? 0).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Net Monthly Income
                        </div>
                        <div className="text-lg font-bold">
                          ${netIncome.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Profit Margin
                        </div>
                        <div className="text-lg font-bold">
                          {netIncomePercentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick info cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Tenants
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {property.tenants?.length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {property.tenants?.filter((t) => t.status === "active")
                        .length || 0}{" "}
                      Active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Maintenance
                    </CardTitle>
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {property.maintenanceItems?.length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {property.maintenanceItems?.filter(
                        (m) => m.status === "pending"
                      ).length || 0}{" "}
                      Pending
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Square Feet
                  </div>
                  <div className="font-medium">
                    {property.squareFeet?.toLocaleString() || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Year Built
                  </div>
                  <div className="font-medium">
                    {property.yearBuilt || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Zoning</div>
                  <div className="font-medium">{property.zoning || "N/A"}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Parking Spaces
                  </div>
                  <div className="font-medium">
                    {property.parkingSpaces || "N/A"}
                  </div>
                </div>
                {property.bedrooms !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Bedrooms
                    </div>
                    <div className="font-medium">{property.bedrooms}</div>
                  </div>
                )}
                {property.bathrooms !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Bathrooms
                    </div>
                    <div className="font-medium">{property.bathrooms}</div>
                  </div>
                )}
              </div>

              {property.description && (
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground">
                    Description
                  </div>
                  <div className="mt-1">{property.description}</div>
                </div>
              )}

              {property.amenities &&
                Array.isArray(property.amenities) &&
                property.amenities.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      Amenities
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map(
                        (amenity: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {amenity}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Upcoming Cash Flows Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Cash Flows</CardTitle>
              <CardDescription>Next 5 scheduled transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {property.upcomingCashFlows?.map((cashFlow) => (
                    <TableRow key={cashFlow.id}>
                      <TableCell>
                        {format(cashFlow.date, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{cashFlow.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cashFlow.type === "income"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {cashFlow.type === "income" ? "Income" : "Expense"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${cashFlow.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cashFlow.status === "scheduled"
                              ? "outline"
                              : cashFlow.status === "pending"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {cashFlow.status === "scheduled"
                            ? "Scheduled"
                            : cashFlow.status === "pending"
                            ? "Pending"
                            : "Completed"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial & Tenants Tab */}
        <TabsContent value="financial" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Tenants Section */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Tenants</CardTitle>
                <CardDescription>
                  Current and upcoming tenant information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Lease Period</TableHead>
                      <TableHead>Monthly Rent</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {property.tenants?.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell className="font-medium">
                          {tenant.name}
                        </TableCell>
                        <TableCell>
                          {format(tenant.leaseStart, "MMM d, yyyy")} -{" "}
                          {format(tenant.leaseEnd, "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          ${tenant.rentAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tenant.status === "active"
                                ? "default"
                                : tenant.status === "late"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {tenant.status === "active"
                              ? "Active"
                              : tenant.status === "late"
                              ? "Late Payment"
                              : "Ending Soon"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Add Tenant</Button>
              </CardFooter>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
                <CardDescription>
                  Property financial information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Property Value
                  </div>
                  <div className="text-xl font-bold">
                    ${(property.value ?? 0).toLocaleString()}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground">
                    Annual Income
                  </div>
                  <div className="text-lg font-medium text-green-600">
                    ${((property.income ?? 0) * 12).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Annual Expenses
                  </div>
                  <div className="text-lg font-medium text-red-600">
                    ${((property.expenses ?? 0) * 12).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Annual Net Income
                  </div>
                  <div className="text-lg font-medium">
                    ${(netIncome * 12).toLocaleString()}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground">Cap Rate</div>
                  <div className="text-xl font-bold">
                    {property.value
                      ? (((netIncome * 12) / property.value) * 100).toFixed(2)
                      : "N/A"}
                    %
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Valuation History Section */}
          <Card>
            <CardHeader>
              <CardTitle>Valuation History</CardTitle>
              <CardDescription>Property value over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Appraised Value</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Appraised By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {property.valuationHistory?.map((valuation) => (
                    <TableRow key={valuation.id}>
                      <TableCell>
                        {format(valuation.date, "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${valuation.value.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            valuation.changePercent > 0
                              ? "text-green-600"
                              : valuation.changePercent < 0
                              ? "text-red-600"
                              : ""
                          }
                        >
                          {valuation.changePercent > 0 ? "+" : ""}
                          {valuation.changePercent}%
                        </span>
                      </TableCell>
                      <TableCell>{valuation.appraisedBy || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  Add New Valuation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Section */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>
                Upcoming and completed maintenance items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Maintenance Item</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {property.maintenanceItems?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      </TableCell>
                      <TableCell>{format(item.date, "MMM d, yyyy")}</TableCell>
                      <TableCell>${item.cost.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "completed"
                              ? "default"
                              : item.status === "pending"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {item.status === "completed"
                            ? "Completed"
                            : item.status === "pending"
                            ? "Pending"
                            : "Scheduled"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Add Maintenance Item</Button>
            </CardFooter>
          </Card>

          {/* Development Stages Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Development Stages</CardTitle>
                <CardDescription>
                  Construction and development progress
                </CardDescription>
              </div>
              <Button>Add Stage</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Progress Overview */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Overall Progress</div>
                    <div className="text-sm font-medium">
                      {property.developmentStages?.filter(
                        (s) => s.status === "completed"
                      ).length || 0}{" "}
                      / {property.developmentStages?.length || 0} Stages
                      Completed
                    </div>
                  </div>
                  <Progress
                    value={
                      property.developmentStages &&
                      property.developmentStages.length > 0
                        ? (property.developmentStages.filter(
                            (s) => s.status === "completed"
                          ).length /
                            property.developmentStages.length) *
                          100
                        : 0
                    }
                    className="h-2"
                  />

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Budget
                      </div>
                      <div className="font-medium">
                        $
                        {property.developmentStages
                          ?.reduce((sum, stage) => sum + stage.budget, 0)
                          .toLocaleString() || "0"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Actual Costs
                      </div>
                      <div className="font-medium">
                        $
                        {property.developmentStages
                          ?.reduce(
                            (sum, stage) => sum + (stage.actualCost || 0),
                            0
                          )
                          .toLocaleString() || "0"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Development Stages List */}
                <div className="space-y-4">
                  {property.developmentStages?.map((stage) => (
                    <div
                      key={stage.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="bg-muted p-3 flex items-center justify-between">
                        <div className="font-medium flex items-center">
                          <Badge
                            variant={
                              stage.status === "completed"
                                ? "default"
                                : stage.status === "in_progress"
                                ? "secondary"
                                : stage.status === "delayed"
                                ? "destructive"
                                : "outline"
                            }
                            className="mr-2"
                          >
                            {stage.status === "completed"
                              ? "Completed"
                              : stage.status === "in_progress"
                              ? "In Progress"
                              : stage.status === "delayed"
                              ? "Delayed"
                              : "Planned"}
                          </Badge>
                          {stage.name}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Stage</DropdownMenuItem>
                            <DropdownMenuItem>Update Progress</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="p-4">
                        <div className="text-sm text-muted-foreground mb-2">
                          {stage.description}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Planned Date
                            </div>
                            <div className="text-sm">
                              {format(stage.plannedDate, "MMM d, yyyy")}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Actual Date
                            </div>
                            <div className="text-sm">
                              {stage.actualDate
                                ? format(stage.actualDate, "MMM d, yyyy")
                                : "Pending"}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Budget
                            </div>
                            <div className="text-sm">
                              ${stage.budget.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Actual Cost
                            </div>
                            <div className="text-sm">
                              {stage.actualCost
                                ? `$${stage.actualCost.toLocaleString()}`
                                : "Pending"}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div>Completion</div>
                            <div>{stage.completionPercentage}%</div>
                          </div>
                          <Progress
                            value={stage.completionPercentage}
                            className="h-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Property Cash Flow</CardTitle>
                <CardDescription>
                  Monthly income and expenses breakdown
                </CardDescription>
              </div>
              <FilterControls
                timePeriods={timePeriods}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                propertyTypes={cashFlowTypes}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                dateRange={dateRange}
                onDateRangeChange={(range) => setDateRange(range)}
                onGenerateReport={() => console.log("Generating report")}
              />
            </CardHeader>
            <CardContent>
              <BarChart
                data={getFilteredCashFlowData()}
                selectedType={selectedType}
              />

              <div className="mt-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Income</TableHead>
                      <TableHead className="text-right">Expenses</TableHead>
                      <TableHead className="text-right">Maintenance</TableHead>
                      <TableHead className="text-right">Net Income</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredCashFlowData().map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{format(item.date, "MMM yyyy")}</TableCell>
                        <TableCell className="text-right">
                          ${item.income.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.expenses.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.maintenance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          $
                          {(
                            item.income -
                            item.expenses -
                            item.maintenance
                          ).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Property Documents</CardTitle>
                  <CardDescription>
                    Upload and manage property documents
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">New Folder</Button>
                  <Button>Upload Document</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                {/* Folders sidebar */}
                <div className="space-y-1 md:border-r pr-4">
                  <div className="font-medium text-sm mb-3">Folders</div>
                  {documentFolders.map((folder) => (
                    <div
                      key={folder.id}
                      className={`flex items-center gap-2 px-2 py-2 rounded cursor-pointer ${
                        selectedFolder === folder.id
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      }`}
                      onClick={() => setSelectedFolder(folder.id)}
                    >
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{folder.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {property.documents?.filter(
                          (doc) => doc.folderId === folder.id
                        ).length || 0}
                      </span>
                    </div>
                  ))}
                  <div
                    className="flex items-center gap-2 px-2 py-2 rounded cursor-pointer hover:bg-accent/50"
                    onClick={() => setSelectedFolder(null)}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">All Documents</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {property.documents?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Document list */}
                <div className="md:col-span-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {property.documents
                        ?.filter(
                          (doc) =>
                            selectedFolder === null ||
                            doc.folderId === selectedFolder
                        )
                        .map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                              {doc.name}
                            </TableCell>
                            <TableCell>{doc.type}</TableCell>
                            <TableCell>
                              {format(doc.uploadDate, "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>{doc.size}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Download
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">
                                        More options
                                      </span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Rename</DropdownMenuItem>
                                    <DropdownMenuItem>
                                      Move to Folder
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>Replace</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}

                      {selectedFolder !== null &&
                        property.documents?.filter(
                          (doc) => doc.folderId === selectedFolder
                        ).length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-muted-foreground"
                            >
                              This folder is empty. Upload documents or move
                              them here.
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
