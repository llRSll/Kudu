"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertCircle,
  ArrowUpDown,
  Building2,
  CreditCard,
  Download,
  Eye,
  File,
  FileArchive,
  FileCheck,
  FileImage,
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileText,
  Filter,
  FolderOpen,
  MoreHorizontal,
  Share2,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample data for documents
const documents = [
  {
    id: 1,
    name: "Property Deed - 123 Main Street.pdf",
    type: "PDF",
    category: "Properties",
    relatedTo: "123 Main Street",
    size: "2.4 MB",
    uploadedBy: "John Doe",
    uploadDate: "2025-02-15",
    lastViewed: "2025-03-10",
    tags: ["deed", "legal", "property"],
    starred: true,
    status: "active",
  },
  {
    id: 2,
    name: "Lease Agreement - Oceanview Condo.pdf",
    type: "PDF",
    category: "Properties",
    relatedTo: "Oceanview Condo",
    size: "3.1 MB",
    uploadedBy: "Sarah Johnson",
    uploadDate: "2025-01-22",
    lastViewed: "2025-03-05",
    tags: ["lease", "legal", "property"],
    starred: false,
    status: "active",
  },
  {
    id: 3,
    name: "Investment Strategy - Q1 2025.pptx",
    type: "Presentation",
    category: "Investments",
    relatedTo: "Investment Portfolio",
    size: "5.7 MB",
    uploadedBy: "Michael Chen",
    uploadDate: "2025-01-05",
    lastViewed: "2025-03-12",
    tags: ["strategy", "presentation", "quarterly"],
    starred: true,
    status: "active",
  },
  {
    id: 4,
    name: "Credit Facility Agreement - Bank of America.pdf",
    type: "PDF",
    category: "Credit",
    relatedTo: "Bank of America Commercial Line",
    size: "4.2 MB",
    uploadedBy: "John Doe",
    uploadDate: "2024-06-20",
    lastViewed: "2025-02-28",
    tags: ["credit", "legal", "agreement"],
    starred: false,
    status: "active",
  },
  {
    id: 5,
    name: "Operating Agreement - Doe Family Holdings LLC.pdf",
    type: "PDF",
    category: "Entities",
    relatedTo: "Doe Family Holdings, LLC",
    size: "3.8 MB",
    uploadedBy: "Jane Doe",
    uploadDate: "2024-05-15",
    lastViewed: "2025-01-10",
    tags: ["legal", "entity", "operating agreement"],
    starred: true,
    status: "active",
  },
  {
    id: 6,
    name: "Insurance Policy - Commercial Properties.pdf",
    type: "PDF",
    category: "Properties",
    relatedTo: "Multiple Properties",
    size: "2.9 MB",
    uploadedBy: "Sarah Johnson",
    uploadDate: "2024-11-30",
    lastViewed: "2025-02-15",
    tags: ["insurance", "policy", "renewal"],
    starred: false,
    status: "renewal-needed",
    renewalDate: "2025-04-15",
  },
  {
    id: 7,
    name: "Tax Return - 2024.pdf",
    type: "PDF",
    category: "Tax",
    relatedTo: "Doe Family Holdings, LLC",
    size: "8.5 MB",
    uploadedBy: "Alex Rodriguez",
    uploadDate: "2025-03-01",
    lastViewed: "2025-03-10",
    tags: ["tax", "annual", "financial"],
    starred: true,
    status: "active",
  },
  {
    id: 8,
    name: "Property Photos - Mountain Development.jpg",
    type: "Image",
    category: "Properties",
    relatedTo: "Mountain Development",
    size: "12.3 MB",
    uploadedBy: "Michael Chen",
    uploadDate: "2025-02-10",
    lastViewed: "2025-03-08",
    tags: ["photos", "development", "property"],
    starred: false,
    status: "active",
  },
  {
    id: 9,
    name: "Financial Statements - Q4 2024.xlsx",
    type: "Spreadsheet",
    category: "Financial",
    relatedTo: "Doe Family Holdings, LLC",
    size: "1.8 MB",
    uploadedBy: "John Doe",
    uploadDate: "2025-01-15",
    lastViewed: "2025-03-05",
    tags: ["financial", "quarterly", "statements"],
    starred: true,
    status: "active",
  },
  {
    id: 10,
    name: "Trust Agreement - Doe Family Trust.pdf",
    type: "PDF",
    category: "Entities",
    relatedTo: "Doe Family Trust",
    size: "4.5 MB",
    uploadedBy: "Jane Doe",
    uploadDate: "2024-11-15",
    lastViewed: "2025-02-20",
    tags: ["trust", "legal", "agreement"],
    starred: false,
    status: "active",
  },
  {
    id: 11,
    name: "Construction Permits - Mountain Development.pdf",
    type: "PDF",
    category: "Properties",
    relatedTo: "Mountain Development",
    size: "3.2 MB",
    uploadedBy: "Sarah Johnson",
    uploadDate: "2024-09-22",
    lastViewed: "2025-01-30",
    tags: ["permits", "construction", "development"],
    starred: false,
    status: "renewal-needed",
    renewalDate: "2025-04-30",
  },
  {
    id: 12,
    name: "Investment Performance Report - 2024.pdf",
    type: "PDF",
    category: "Investments",
    relatedTo: "Investment Portfolio",
    size: "5.1 MB",
    uploadedBy: "Michael Chen",
    uploadDate: "2025-01-10",
    lastViewed: "2025-03-01",
    tags: ["performance", "annual", "investments"],
    starred: true,
    status: "active",
  },
]

// Sample data for folders
const folders = [
  {
    id: 1,
    name: "Properties",
    icon: Building2,
    count: 42,
    size: "156 MB",
  },
  {
    id: 2,
    name: "Investments",
    icon: TrendingUp,
    count: 35,
    size: "98 MB",
  },
  {
    id: 3,
    name: "Credit Facilities",
    icon: CreditCard,
    count: 18,
    size: "45 MB",
  },
  {
    id: 4,
    name: "Entities",
    icon: Users,
    count: 24,
    size: "67 MB",
  },
  {
    id: 5,
    name: "Tax Documents",
    icon: FileCheck,
    count: 56,
    size: "210 MB",
  },
  {
    id: 6,
    name: "Insurance",
    icon: FileArchive,
    count: 15,
    size: "42 MB",
  },
  {
    id: 7,
    name: "Financial Statements",
    icon: FileSpreadsheet,
    count: 38,
    size: "85 MB",
  },
  {
    id: 8,
    name: "Legal Documents",
    icon: FileText,
    count: 20,
    size: "76 MB",
  },
]

export function DocumentBrowser() {
  const [view, setView] = useState("grid")
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)

  const toggleDocumentSelection = (id: number) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter((docId) => docId !== id))
    } else {
      setSelectedDocuments([...selectedDocuments, id])
    }
  }

  const selectAllDocuments = () => {
    if (selectedDocuments.length === documents.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(documents.map((doc) => doc.id))
    }
  }

  const handleFolderClick = (folderName: string) => {
    setCurrentFolder(folderName)
  }

  const handleBackToFolders = () => {
    setCurrentFolder(null)
  }

  const filteredDocuments = currentFolder ? documents.filter((doc) => doc.category === currentFolder) : documents

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    } else if (sortBy === "date") {
      return sortOrder === "asc"
        ? new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        : new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    } else if (sortBy === "size") {
      const aSize = Number.parseFloat(a.size.split(" ")[0])
      const bSize = Number.parseFloat(b.size.split(" ")[0])
      return sortOrder === "asc" ? aSize - bSize : bSize - aSize
    }
    return 0
  })

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FilePdf className="h-8 w-8 text-red-500" />
      case "Spreadsheet":
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />
      case "Presentation":
        return <FileText className="h-8 w-8 text-orange-500" />
      case "Image":
        return <FileImage className="h-8 w-8 text-blue-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentFolder ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleBackToFolders} className="flex items-center gap-1">
                  <FolderOpen className="h-4 w-4" />
                  All Folders
                </Button>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium">{currentFolder}</span>
              </>
            ) : (
              <CardTitle>Document Library</CardTitle>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowUpDown className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("name")
                    setSortOrder("asc")
                  }}
                >
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("name")
                    setSortOrder("desc")
                  }}
                >
                  Name (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("date")
                    setSortOrder("desc")
                  }}
                >
                  Date (Newest first)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("date")
                    setSortOrder("asc")
                  }}
                >
                  Date (Oldest first)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("size")
                    setSortOrder("desc")
                  }}
                >
                  Size (Largest first)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortBy("size")
                    setSortOrder("asc")
                  }}
                >
                  Size (Smallest first)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-1 border rounded-md">
              <Button
                variant={view === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("grid")}
                className="rounded-none rounded-l-md"
              >
                Grid
              </Button>
              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("list")}
                className="rounded-none rounded-r-md"
              >
                List
              </Button>
            </div>
          </div>
        </div>
        {currentFolder && <CardDescription>{filteredDocuments.length} documents in this folder</CardDescription>}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="starred">Starred</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
            <TabsTrigger value="renewals">Renewals</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {!currentFolder && view === "grid" ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {folders.map((folder) => (
                  <FolderCard key={folder.id} folder={folder} onClick={() => handleFolderClick(folder.name)} />
                ))}
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedDocuments.map((document) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    isSelected={selectedDocuments.includes(document.id)}
                    onSelect={() => toggleDocumentSelection(document.id)}
                  />
                ))}
              </div>
            ) : (
              <DocumentTable
                documents={sortedDocuments}
                selectedDocuments={selectedDocuments}
                onSelectAll={selectAllDocuments}
                onSelectDocument={toggleDocumentSelection}
              />
            )}
          </TabsContent>

          <TabsContent value="recent" className="mt-4">
            {view === "grid" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedDocuments
                  .sort((a, b) => new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime())
                  .slice(0, 6)
                  .map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      isSelected={selectedDocuments.includes(document.id)}
                      onSelect={() => toggleDocumentSelection(document.id)}
                    />
                  ))}
              </div>
            ) : (
              <DocumentTable
                documents={sortedDocuments
                  .sort((a, b) => new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime())
                  .slice(0, 10)}
                selectedDocuments={selectedDocuments}
                onSelectAll={selectAllDocuments}
                onSelectDocument={toggleDocumentSelection}
              />
            )}
          </TabsContent>

          <TabsContent value="starred" className="mt-4">
            {view === "grid" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedDocuments
                  .filter((doc) => doc.starred)
                  .map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      isSelected={selectedDocuments.includes(document.id)}
                      onSelect={() => toggleDocumentSelection(document.id)}
                    />
                  ))}
              </div>
            ) : (
              <DocumentTable
                documents={sortedDocuments.filter((doc) => doc.starred)}
                selectedDocuments={selectedDocuments}
                onSelectAll={selectAllDocuments}
                onSelectDocument={toggleDocumentSelection}
              />
            )}
          </TabsContent>

          <TabsContent value="shared" className="mt-4">
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No shared documents</h3>
              <p className="text-muted-foreground mt-1">Documents shared with you will appear here</p>
              <Button className="mt-4">
                <Share2 className="mr-2 h-4 w-4" />
                Share a Document
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="renewals" className="mt-4">
            {view === "grid" ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedDocuments
                  .filter((doc) => doc.status === "renewal-needed")
                  .map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      isSelected={selectedDocuments.includes(document.id)}
                      onSelect={() => toggleDocumentSelection(document.id)}
                    />
                  ))}
              </div>
            ) : (
              <DocumentTable
                documents={sortedDocuments.filter((doc) => doc.status === "renewal-needed")}
                selectedDocuments={selectedDocuments}
                onSelectAll={selectAllDocuments}
                onSelectDocument={toggleDocumentSelection}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )

  function FolderCard({ folder, onClick }) {
    return (
      <div
        className="flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onClick}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
          <folder.icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="font-medium text-center">{folder.name}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {folder.count} items • {folder.size}
        </p>
      </div>
    )
  }

  function DocumentCard({ document, isSelected, onSelect }) {
    return (
      <div className={`border rounded-lg overflow-hidden ${isSelected ? "ring-2 ring-primary" : ""}`}>
        <div className="flex items-start p-4">
          <Checkbox checked={isSelected} onCheckedChange={() => onSelect(document.id)} className="mr-2 mt-1" />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                {getDocumentIcon(document.type)}
                <div className="ml-3">
                  <h3 className="font-medium line-clamp-1">{document.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {document.size} • Uploaded {formatDate(document.uploadDate)}
                  </p>
                </div>
              </div>
              {document.starred && <Star className="h-4 w-4 text-yellow-400 ml-2 flex-shrink-0" />}
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {document.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-3 flex items-center text-xs text-muted-foreground">
              <span>Related to: {document.relatedTo}</span>
            </div>

            {document.status === "renewal-needed" && (
              <div className="mt-2 flex items-center text-amber-500 text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>Renewal needed by {formatDate(document.renewalDate)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between bg-muted/50 p-2 border-t">
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Move to Folder</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Set Reminder</DropdownMenuItem>
              <DropdownMenuItem>Version History</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  function DocumentTable({ documents, selectedDocuments, onSelectAll, onSelectDocument }) {
    return (
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 text-left">
                <Checkbox
                  checked={selectedDocuments.length === documents.length && documents.length > 0}
                  onCheckedChange={onSelectAll}
                />
              </th>
              <th className="p-3 text-left font-medium">Name</th>
              <th className="p-3 text-left font-medium">Related To</th>
              <th className="p-3 text-left font-medium">Size</th>
              <th className="p-3 text-left font-medium">Uploaded</th>
              <th className="p-3 text-left font-medium">Last Viewed</th>
              <th className="p-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-b">
                <td className="p-3">
                  <Checkbox
                    checked={selectedDocuments.includes(document.id)}
                    onCheckedChange={() => onSelectDocument(document.id)}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    {getDocumentIcon(document.type)}
                    <div className="ml-3">
                      <p className="font-medium">{document.name}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {document.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {document.starred && <Star className="h-4 w-4 text-yellow-400 ml-2" />}
                  </div>
                </td>
                <td className="p-3">{document.relatedTo}</td>
                <td className="p-3">{document.size}</td>
                <td className="p-3">{formatDate(document.uploadDate)}</td>
                <td className="p-3">{formatDate(document.lastViewed)}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem>Move to Folder</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Set Reminder</DropdownMenuItem>
                        <DropdownMenuItem>Version History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

