"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, DollarSign, TrendingUp, Calendar, Download, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { Property } from "./property-list"
import { useState } from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import type { CustomComponents } from "react-day-picker"
import React from "react"

interface CashFlowData {
  month: string
  amount: number
  commercial: number
  residential: number
  development: number
  date: Date // Adding date field for proper filtering
  [key: string]: number | string | Date // Add index signature for dynamic property access
}

const cashFlowData: CashFlowData[] = [
  { month: "Jan", amount: 45000, commercial: 25000, residential: 15000, development: 5000, date: new Date(2024, 0, 1) },
  { month: "Feb", amount: 48000, commercial: 28000, residential: 16000, development: 4000, date: new Date(2024, 1, 1) },
  { month: "Mar", amount: 47000, commercial: 26000, residential: 16000, development: 5000, date: new Date(2024, 2, 1) },
  { month: "Apr", amount: 51000, commercial: 30000, residential: 17000, development: 4000, date: new Date(2024, 3, 1) },
  { month: "May", amount: 49000, commercial: 27000, residential: 17000, development: 5000, date: new Date(2024, 4, 1) },
  { month: "Jun", amount: 52000, commercial: 31000, residential: 18000, development: 3000, date: new Date(2024, 5, 1) },
]

const timePeriods = [
  { label: "Last 6 months", value: "6m" },
  { label: "Last 12 months", value: "12m" },
  { label: "Year to date", value: "ytd" },
  { label: "All time", value: "all" },
  { label: "Custom", value: "custom" },
]

const propertyTypes = [
  { label: "All Types", value: "all" },
  { label: "Commercial", value: "commercial" },
  { label: "Residential", value: "residential" },
  { label: "Development", value: "development" },
]

// Define shared types and interfaces
interface DateRangeValue {
  from?: Date;
  to?: Date;
}

interface DateRangeSelectorProps {
  dateRange: DateRangeValue | undefined;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
  onClose?: () => void;
}

interface FilterOption {
  label: string;
  value: string;
}

interface FilterControlsProps {
  timePeriods: FilterOption[];
  selectedPeriod: string;
  onPeriodChange: (value: string) => void;
  propertyTypes: FilterOption[];
  selectedType: string;
  onTypeChange: (value: string) => void;
  dateRange: DateRangeValue | undefined;
  onDateRangeChange: (range: DateRangeValue | undefined) => void;
  onGenerateReport: () => void;
}

interface ChartDataItem {
  month: string;
  amount: number;
  [key: string]: number | string | Date;
  date: Date;
}

interface BarChartProps {
  data: ChartDataItem[];
  selectedType: string;
  className?: string;
}

// Date Range Selector Component
export function DateRangeSelector({
  dateRange,
  onDateRangeChange,
  onClose
}: DateRangeSelectorProps) {
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [startDate, setStartDate] = useState<Date | undefined>(dateRange?.from);
  const [endDate, setEndDate] = useState<Date | undefined>(dateRange?.to);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  // Format the current month and year
  const formattedMonth = format(currentMonth, 'MMMM yyyy');
  
  // Calculate years and months for picker
  const yearMonths = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
    
    const result = years.flatMap(year => 
      Array.from({ length: 12 }, (_, month) => {
        const date = new Date(year, month, 1);
        return {
          value: date,
          label: format(date, 'MMMM yyyy')
        };
      })
    );
    
    return result;
  }, []);
  
  // Handle month/year selection
  const handleMonthYearSelect = (date: Date) => {
    setCurrentMonth(date);
    setShowMonthYearPicker(false);
  };

  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth)
      newMonth.setMonth(newMonth.getMonth() - 1)
      return newMonth
    })
  }

  // Function to navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth)
      newMonth.setMonth(newMonth.getMonth() + 1)
      return newMonth
    })
  }
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (isSelectingStartDate) {
      setStartDate(date);
      // Auto switch to end date selection if start date is selected
      if (date) {
        setIsSelectingStartDate(false);
      }
    } else {
      setEndDate(date);
    }
    
    // Update the parent component with the new date range
    onDateRangeChange({
      from: isSelectingStartDate ? date : startDate,
      to: !isSelectingStartDate ? date : endDate
    });
    
    // If both dates are set, notify parent to close if needed
    if ((isSelectingStartDate ? date : startDate) && (!isSelectingStartDate ? date : endDate) && onClose) {
      onClose();
    }
  };
  
  // Format for display
  const formattedDateRange = React.useMemo(() => {
    if (!startDate && !endDate) return "Select a date range";
    
    const startStr = startDate ? format(startDate, "MMM d, yyyy") : "Select start";
    const endStr = endDate ? format(endDate, "MMM d, yyyy") : "Select end";
    
    return `${startStr} - ${endStr}`;
  }, [startDate, endDate]);
  
  // Handle quick selections
  const handleQuickSelect = (startDate: Date, endDate: Date) => {
    setStartDate(startDate);
    setEndDate(endDate);
    onDateRangeChange({ from: startDate, to: endDate });
  };

  return (
    <div>
      <div className="border-b p-4 bg-muted/5">
        <h4 className="font-semibold text-base">Select Date Range</h4>
        <p className="text-sm text-muted-foreground mt-1">
          Choose your start and end dates
        </p>
      </div>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-6 mb-4">
          {/* Quick select buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(today.getMonth() - 3);
                handleQuickSelect(threeMonthsAgo, today);
              }}
            >
              Last 3 Months
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(today.getMonth() - 6);
                handleQuickSelect(sixMonthsAgo, today);
              }}
            >
              Last 6 Months
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                const startOfYear = new Date(today.getFullYear(), 0, 1);
                handleQuickSelect(startOfYear, today);
              }}
            >
              This Year
            </Button>
          </div>
        </div>
        {/* Calendar component for date range selection */}
        <div className="bg-card border overflow-hidden rounded-md relative">
          <div className="absolute inset-y-0 inset-x-0 pointer-events-none flex items-center justify-between px-0 mx-1">
            <button 
              className="inline-flex items-center justify-center rounded-md transition-colors h-10 w-10 bg-transparent p-0 text-muted-foreground hover:text-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 pointer-events-auto"
              onClick={goToPreviousMonth}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              className="inline-flex items-center justify-center rounded-md transition-colors h-10 w-10 bg-transparent p-0 text-muted-foreground hover:text-foreground hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 pointer-events-auto"
              onClick={goToNextMonth}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          
          {/* Custom month display centered at the top with dropdown functionality */}
          <div className="text-center mb-2 mt-2 relative">
            <button 
              onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
              className="text-sm font-semibold hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded focus:outline-none"
            >
              {formattedMonth}
            </button>
            {showMonthYearPicker && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-popover p-2 rounded shadow-md z-10 w-48 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-1 gap-1">
                  {yearMonths.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleMonthYearSelect(item.value)}
                      className={cn(
                        "text-sm rounded px-2 py-1 w-full text-left",
                        currentMonth.getMonth() === item.value.getMonth() && 
                        currentMonth.getFullYear() === item.value.getFullYear()
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <CalendarComponent
            initialFocus
            mode="single"
            defaultMonth={new Date()}
            month={currentMonth}
            selected={isSelectingStartDate ? startDate : endDate}
            onSelect={(date) => handleDateSelect(date)}
            numberOfMonths={1}
            className="pt-0 pb-4 px-4"
            weekStartsOn={1}
            formatters={{
              formatWeekdayName: (date: Date) => {
                const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
                const day = date.getDay()
                const mondayBasedIndex = (day + 6) % 7
                return days[mondayBasedIndex]
              }
            }}
            classNames={{
              months: "flex flex-col space-y-0",
              month: "space-y-2 mx-auto max-w-[296px] relative",
              caption: "hidden",
              caption_label: "hidden",
              nav: "hidden",
              nav_button: "hidden",
              nav_button_previous: "hidden",
              nav_button_next: "hidden",
              table: "w-full border-collapse space-y-1 border border-dashed rounded p-3",
              head_row: "flex w-full mt-2",
              head_cell: cn(
                "text-muted-foreground text-[0.8rem] font-medium",
                "flex-1 text-center"
              ),
              row: "flex w-full mt-2",
              cell: cn(
                "text-center p-0 relative flex justify-center items-center",
                "focus-within:relative focus-within:z-20"
              ),
              day: cn(
                "h-9 w-9 p-0 font-normal",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                "aria-selected:opacity-100 text-center"
              ),
              day_selected: cn(
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                "focus:bg-primary focus:text-primary-foreground"
              ),
              day_today: "bg-accent/50 text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_hidden: "invisible",
            }}
          />

          {/* Date Selection Indicator */}
          <div className="px-4 pb-2 flex gap-2">
            <div 
              className={cn(
                "text-xs rounded py-1 px-2 cursor-pointer flex-1 text-center",
                isSelectingStartDate 
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              onClick={() => setIsSelectingStartDate(true)}
            >
              {startDate ? format(startDate, "MMM d, yyyy") : "Start Date"}
            </div>
            <div 
              className={cn(
                "text-xs rounded py-1 px-2 cursor-pointer flex-1 text-center",
                !isSelectingStartDate 
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
              onClick={() => setIsSelectingStartDate(false)}
            >
              {endDate ? format(endDate, "MMM d, yyyy") : "End Date"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Date range display and action buttons */}
      <div className="border-t p-4 bg-muted/5">
        <div className="flex items-center justify-between">
          {/* Selected date range display */}
          <div className="text-sm text-muted-foreground">
            {startDate && endDate ? (
              <>
                <span className="font-medium text-foreground">
                  {format(startDate, "MMM d, yyyy")}
                </span>
                {" - "}
                <span className="font-medium text-foreground">
                  {format(endDate, "MMM d, yyyy")}
                </span>
              </>
            ) : (
              "Select a date range"
            )}
          </div>
          {/* Clear and Apply buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStartDate(undefined);
                setEndDate(undefined);
                onDateRangeChange(undefined);
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (startDate && endDate && onClose) {
                  onClose();
                }
              }}
              disabled={!startDate || !endDate}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Filter Controls Component
export function FilterControls({
  timePeriods,
  selectedPeriod,
  onPeriodChange,
  propertyTypes,
  selectedType,
  onTypeChange,
  dateRange,
  onDateRangeChange,
  onGenerateReport
}: FilterControlsProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Format date range for display
  const formattedDateRange = React.useMemo(() => {
    if (!dateRange?.from && !dateRange?.to) {
      return "Pick a date range";
    }
    
    if (dateRange.from) {
      if (dateRange.to) {
        return `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`;
      }
      return format(dateRange.from, "LLL dd, y");
    }
    
    return "Pick a date range";
  }, [dateRange]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Select value={selectedPeriod} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {timePeriods.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedPeriod === "custom" && (
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-[240px]",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {formattedDateRange}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-lg" align="end">
              <DateRangeSelector 
                dateRange={dateRange}
                onDateRangeChange={onDateRangeChange}
                onClose={() => setIsCalendarOpen(false)}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {propertyTypes.map((type) => (
            <DropdownMenuCheckboxItem
              key={type.value}
              checked={selectedType === type.value}
              onCheckedChange={() => onTypeChange(type.value)}
            >
              {type.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" size="icon" onClick={onGenerateReport}>
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Bar Chart Component
export function BarChart({
  data,
  selectedType,
  className
}: BarChartProps) {
  // Calculate the maximum value for scaling
  const getMaxAmount = () => {
    if (selectedType === "all") return Math.max(...data.map(d => d.amount));
    return Math.max(...data.map(d => d[selectedType] as number));
  };

  // Get the amount to display based on selected type
  const getAmount = (data: ChartDataItem) => {
    if (selectedType === "all") return data.amount;
    return data[selectedType] as number;
  };

  return (
    <div className={cn("h-[200px] w-full", className)}>
      <div className="flex h-full items-end gap-2">
        {data.map((item) => {
          const amount = getAmount(item);
          const height = (amount / getMaxAmount()) * 100;
          return (
            <div key={item.month} className="group flex-1 relative">
              <div 
                className="bg-blue-500 rounded-t transition-all duration-300 group-hover:bg-blue-600"
                style={{ height: `${height}%` }}
              />
              <div className="text-xs text-center mt-2">{item.month}</div>
              <div className="text-xs text-center text-muted-foreground">
                ${(amount / 1000).toFixed(0)}k
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-popover rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                <div className="text-xs">
                  <div>Commercial: ${(item.commercial as number / 1000).toFixed(0)}k</div>
                  <div>Residential: ${(item.residential as number / 1000).toFixed(0)}k</div>
                  <div>Development: ${(item.development as number / 1000).toFixed(0)}k</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PortfolioSummary({ properties }: { properties: Property[] }) {
  const [selectedPeriod, setSelectedPeriod] = useState("6m")
  const [selectedType, setSelectedType] = useState("all")
  const [dateRange, setDateRange] = useState<DateRangeValue | undefined>(undefined)
  
  const totalProperties = properties.length
  const monthlyIncome = properties.reduce((sum: number, prop: Property) => sum + prop.income, 0)
  const activeProperties = properties.filter((p: Property) => p.status === "active").length
  
  // Default value or calculated from properties if available
  const upcomingDisbursement = properties.length > 0 ? 35000 : 0

  // Handle case when there are no properties
  const portfolioGrowth = properties.length > 0 ? "+12.5%" : "N/A"
  const portfolioGrowthDesc = properties.length > 0 ? "From last month" : "Add properties to see growth"

  // Filter data based on selected period
  const getFilteredData = () => {
    // If there are no properties, return empty data or minimal sample data
    if (properties.length === 0) {
      return []
    }

    let filteredData = [...cashFlowData]
    
    // Apply period filter
    switch (selectedPeriod) {
      case "6m":
        filteredData = filteredData.slice(-6)
        break
      case "12m":
        filteredData = filteredData.slice(-12)
        break
      case "ytd":
        const currentYear = new Date().getFullYear()
        filteredData = filteredData.filter(d => d.date.getFullYear() === currentYear)
        break
      case "custom":
        if (dateRange?.from && dateRange?.to) {
          filteredData = filteredData.filter(d => 
            d.date >= dateRange.from! && 
            d.date <= dateRange.to!
          )
        }
        break
      // "all" case doesn't need filtering
    }

    return filteredData
  }

  const handleGenerateReport = () => {
    if (properties.length === 0) {
      alert("Add properties to generate a report")
      return
    }
    
    const reportData = {
      period: selectedPeriod,
      type: selectedType,
      data: getFilteredData()
    }
    console.log("Generating report with data:", reportData)
    // In a real app, this would trigger a report generation and download
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">
              {activeProperties} Active Properties
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${monthlyIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {properties.length > 0 
                ? `From ${activeProperties} properties` 
                : "Add properties to generate income"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Disbursement</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {properties.length > 0 
                ? `$${upcomingDisbursement.toLocaleString()}` 
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {properties.length > 0 ? "Due in 5 days" : "Add properties to see disbursements"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioGrowth}</div>
            <p className="text-xs text-muted-foreground">
              {portfolioGrowthDesc}
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cash Flow</CardTitle>
          <FilterControls
            timePeriods={timePeriods}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            propertyTypes={propertyTypes}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onGenerateReport={handleGenerateReport}
          />
        </CardHeader>
        <CardContent>
          {properties.length > 0 ? (
            <BarChart 
              data={getFilteredData()} 
              selectedType={selectedType} 
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center h-[200px]">
              <p className="text-muted-foreground">
                Add properties to see cash flow data
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 