"use client"

import { Button } from "@/components/ui/button"
import { Search, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DocumentBrowser } from "@/components/documents/document-browser"
import { DocumentStats } from "@/components/documents/document-stats"

export default function DocumentsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Documents</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and organize all your important documents</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row animate-slide-up">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search documents..." className="w-full pl-8 sm:w-[300px]" />
          </div>
          <Button className="gap-1">
            <Upload className="h-4 w-4" />
            Upload Documents
          </Button>
        </div>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <DocumentStats />
      </div>
      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <DocumentBrowser />
      </div>
    </div>
  )
}

