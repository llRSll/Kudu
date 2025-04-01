"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Clock,
  Download,
  Eye,
  FileText,
  FileSpreadsheet,
  FileIcon as FilePdf,
  MoreHorizontal,
  MessageSquare,
  Share2,
  History,
  Upload,
  Users,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for shared documents
const documents = [
  {
    id: 1,
    name: "Q1 Investment Strategy.pdf",
    type: "PDF",
    workspace: "Investment Strategy",
    size: "2.4 MB",
    uploadedBy: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    uploadDate: "2025-03-15T14:30:00",
    lastViewed: "2025-03-18T10:15:00",
    comments: 8,
    versions: 3,
    sharedWith: [
      { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
      { name: "Michael Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "MC" },
      { name: "Client: Doe Family", avatar: "/placeholder.svg?height=32&width=32", initials: "DF" },
    ],
  },
  {
    id: 2,
    name: "Property Acquisition Analysis.xlsx",
    type: "Spreadsheet",
    workspace: "Real Estate Portfolio",
    size: "1.8 MB",
    uploadedBy: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SJ",
    },
    uploadDate: "2025-03-14T09:45:00",
    lastViewed: "2025-03-17T15:30:00",
    comments: 5,
    versions: 7,
    sharedWith: [{ name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" }],
  },
  {
    id: 3,
    name: "Tax Planning Strategy 2025.pdf",
    type: "PDF",
    workspace: "Tax Planning",
    size: "3.2 MB",
    uploadedBy: {
      name: "Alex Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AR",
    },
    uploadDate: "2025-03-12T16:20:00",
    lastViewed: "2025-03-16T11:45:00",
    comments: 12,
    versions: 4,
    sharedWith: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      { name: "Client: Doe Family", avatar: "/placeholder.svg?height=32&width=32", initials: "DF" },
    ],
  },
  {
    id: 4,
    name: "Credit Facility Terms.pdf",
    type: "PDF",
    workspace: "Credit Facility Management",
    size: "1.5 MB",
    uploadedBy: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MC",
    },
    uploadDate: "2025-03-10T11:15:00",
    lastViewed: "2025-03-15T14:20:00",
    comments: 3,
    versions: 2,
    sharedWith: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      { name: "Alex Rodriguez", avatar: "/placeholder.svg?height=32&width=32", initials: "AR" },
    ],
  },
  {
    id: 5,
    name: "Entity Structure Diagram.pdf",
    type: "PDF",
    workspace: "Entity Structuring",
    size: "2.1 MB",
    uploadedBy: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SJ",
    },
    uploadDate: "2025-03-13T13:40:00",
    lastViewed: "2025-03-17T09:10:00",
    comments: 6,
    versions: 5,
    sharedWith: [{ name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" }],
  },
  {
    id: 6,
    name: "Annual Financial Report.xlsx",
    type: "Spreadsheet",
    workspace: "Document Repository",
    size: "4.7 MB",
    uploadedBy: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    uploadDate: "2025-03-08T10:30:00",
    lastViewed: "2025-03-14T16:45:00",
    comments: 15,
    versions: 8,
    sharedWith: [
      { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
      { name: "Michael Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "MC" },
      { name: "Alex Rodriguez", avatar: "/placeholder.svg?height=32&width=32", initials: "AR" },
      { name: "Client: Doe Family", avatar: "/placeholder.svg?height=32&width=32", initials: "DF" },
    ],
  },
]

export function SharedDocuments() {
  const [activeView, setActiveView] = useState("grid")

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDocumentIcon = (type) => {
    switch (type) {
      case "PDF":
        return <FilePdf className="h-8 w-8 text-primary/70" />
      case "Spreadsheet":
        return <FileSpreadsheet className="h-8 w-8 text-primary/70" />
      default:
        return <FileText className="h-8 w-8 text-primary/70" />
    }
  }

  return (
    <div className="p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Shared Documents</h3>
          <Badge variant="outline" className="text-xs font-normal">
            {documents.length} documents
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input type="search" placeholder="Search documents..." className="w-full pl-8 h-8 text-xs sm:w-[220px]" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Documents</SelectItem>
              <SelectItem value="pdf">PDF Files</SelectItem>
              <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
              <SelectItem value="client">Shared with Clients</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-md">
            <Button
              variant={activeView === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("grid")}
              className="h-8 text-xs rounded-r-none"
            >
              Grid
            </Button>
            <Button
              variant={activeView === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveView("list")}
              className="h-8 text-xs rounded-l-none"
            >
              List
            </Button>
          </div>
          <Button size="sm" className="h-8 text-xs">
            <Upload className="mr-1 h-3.5 w-3.5" />
            Upload
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 h-8">
          <TabsTrigger value="all" className="text-xs">
            All Documents
          </TabsTrigger>
          <TabsTrigger value="recent" className="text-xs">
            Recently Viewed
          </TabsTrigger>
          <TabsTrigger value="shared" className="text-xs">
            Shared by Me
          </TabsTrigger>
          <TabsTrigger value="client" className="text-xs">
            Client Shared
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {activeView === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="border rounded-md p-4 hover:bg-muted/20 transition-colors card-hover-effect"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getDocumentIcon(document.type)}
                      <div>
                        <h3 className="font-medium text-sm">{document.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {document.workspace} • {document.size}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-xs text-foreground">Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="text-xs text-foreground">
                          <Eye className="mr-2 h-3.5 w-3.5" />
                          View Document
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs text-foreground">
                          <Download className="mr-2 h-3.5 w-3.5" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs text-foreground">
                          <Share2 className="mr-2 h-3.5 w-3.5" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs text-foreground">
                          <MessageSquare className="mr-2 h-3.5 w-3.5" />
                          Add Comment
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs text-foreground">
                          <History className="mr-2 h-3.5 w-3.5" />
                          Version History
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {document.sharedWith.slice(0, 3).map((person, index) => (
                        <Avatar key={index} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={person.avatar} alt={person.name} />
                          <AvatarFallback className="text-[10px]">{person.initials}</AvatarFallback>
                        </Avatar>
                      ))}
                      {document.sharedWith.length > 3 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium border-2 border-background">
                          +{document.sharedWith.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        {document.comments}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <History className="mr-1 h-3 w-3" />v{document.versions}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Updated {formatDate(document.uploadDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <Avatar className="h-4 w-4 mr-1">
                          <AvatarImage src={document.uploadedBy.avatar} alt={document.uploadedBy.name} />
                          <AvatarFallback className="text-[8px]">{document.uploadedBy.initials}</AvatarFallback>
                        </Avatar>
                        <span>{document.uploadedBy.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-3 text-xs font-medium">Name</th>
                    <th className="text-left p-3 text-xs font-medium">Workspace</th>
                    <th className="text-left p-3 text-xs font-medium">Shared With</th>
                    <th className="text-left p-3 text-xs font-medium">Last Updated</th>
                    <th className="text-left p-3 text-xs font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((document) => (
                    <tr key={document.id} className="border-b hover:bg-muted/20">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {getDocumentIcon(document.type)}
                          <div>
                            <p className="text-sm font-medium">{document.name}</p>
                            <p className="text-xs text-muted-foreground">{document.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-sm">{document.workspace}</td>
                      <td className="p-3">
                        <div className="flex -space-x-2">
                          {document.sharedWith.slice(0, 3).map((person, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={person.avatar} alt={person.name} />
                              <AvatarFallback className="text-[10px]">{person.initials}</AvatarFallback>
                            </Avatar>
                          ))}
                          {document.sharedWith.length > 3 && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium border-2 border-background">
                              +{document.sharedWith.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-xs text-muted-foreground">{formatDate(document.uploadDate)}</div>
                        <div className="text-xs flex items-center mt-1">
                          <Avatar className="h-4 w-4 mr-1">
                            <AvatarImage src={document.uploadedBy.avatar} alt={document.uploadedBy.name} />
                            <AvatarFallback className="text-[8px]">{document.uploadedBy.initials}</AvatarFallback>
                          </Avatar>
                          <span>{document.uploadedBy.name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Share2 className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-xs">
                                <MessageSquare className="mr-2 h-3.5 w-3.5" />
                                Add Comment
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs">
                                <History className="mr-2 h-3.5 w-3.5" />
                                Version History
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-sm font-medium">Recently viewed documents will appear here</h3>
            <p className="text-xs text-muted-foreground mt-1">Browse documents to see your recent activity</p>
          </div>
        </TabsContent>

        <TabsContent value="shared">
          <div className="flex flex-col items-center justify-center py-12">
            <Share2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-sm font-medium">Documents you've shared will appear here</h3>
            <p className="text-xs text-muted-foreground mt-1">Share documents with your team or clients</p>
          </div>
        </TabsContent>

        <TabsContent value="client">
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-sm font-medium">Client-shared documents will appear here</h3>
            <p className="text-xs text-muted-foreground mt-1">Documents shared with clients for review or approval</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

