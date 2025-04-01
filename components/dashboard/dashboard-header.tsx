"use client"

import { CalendarIcon, Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back to your financial overview.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row animate-slide-up">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-[220px] h-8 pl-8 text-sm" />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal sm:w-[220px] h-8 text-sm text-foreground",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button className="gap-2 h-8 text-sm text-primary-foreground">
            <Download className="h-3.5 w-3.5" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-muted/20 rounded-md p-3 border border-border/50 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-primary/5">
            <CalendarIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm text-foreground">Quarterly Financial Review</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Scheduled for April 15, 2025 at 10:00 AM</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden md:inline-flex text-xs font-normal text-foreground">
            Upcoming
          </Badge>
          <Button variant="outline" size="sm" className="h-7 text-xs text-foreground">
            Reschedule
          </Button>
          <Button size="sm" className="h-7 text-xs text-primary-foreground">
            Join Meeting
          </Button>
        </div>
      </div>
    </div>
  )
}

