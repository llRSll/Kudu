"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Eye,
  File, 
  FileArchive, 
  FileCheck, 
  FileImage, 
  FileSpreadsheet,
  FileText,
  Filter, 
  MoreHorizontal, 
  PlusCircle, 
  SearchIcon,
  Share2, 
  Star, 
  Upload
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentUploadDialog } from "@/components/documents/document-upload-dialog";
import { Property } from "@/app/actions/properties";
import { Checkbox } from "@/components/ui/checkbox";

// Mock document type definition - would come from a real data source
interface PropertyDocument {
  id: string | number;
  name: string;
  type: string;
  category?: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  lastViewed?: string;
  tags: string[];
  starred: boolean;
  status: string;
  renewalDate?: string;
  folderId?: string;
}

interface DocumentFolder {
  id: string;
  name: string;
  count?: number;
}

// Extended property type to include documents
interface ExtendedProperty extends Property {
  documents?: PropertyDocument[];
}

interface PropertyDocumentsTabProps {
  property: ExtendedProperty;
  // In a real app, these would be fetched from an API
  propertyDocuments: PropertyDocument[];
}

export function PropertyDocumentsTab({
  property,
  propertyDocuments = [] // Default to empty array
}: PropertyDocumentsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  
  // Mock folders data
  const documentFolders: DocumentFolder[] = [
    { id: "legal", name: "Legal Documents", count: 3 },
    { id: "tenant", name: "Tenant Leases", count: 2 },
    { id: "financial", name: "Financial Records", count: 2 },
    { id: "maintenance", name: "Maintenance Records", count: 2 },
    { id: "other", name: "Other Documents", count: 0 },
  ];
  
  // Mock document data for demonstration
  const mockDocuments: PropertyDocument[] = [
    {
      id: 1,
      name: `Property Deed - ${property.name || 'Property'}.pdf`,
      type: "PDF",
      category: "Legal",
      size: "2.4 MB",
      uploadedBy: "System Admin",
      uploadDate: "2024-12-15",
      lastViewed: "2025-03-10",
      tags: ["deed", "legal", "property"],
      starred: true,
      status: "active",
    },
    {
      id: 2,
      name: `Insurance Policy - ${property.name || 'Property'}.pdf`,
      type: "PDF",
      category: "Insurance",
      size: "3.1 MB",
      uploadedBy: "System Admin",
      uploadDate: "2024-11-22",
      lastViewed: "2025-02-05",
      tags: ["insurance", "policy"],
      starred: false,
      status: "active",
    },
    {
      id: 3,
      name: `${property.name || 'Property'} Photos.jpg`,
      type: "Image",
      category: "Property",
      size: "5.7 MB",
      uploadedBy: "System Admin",
      uploadDate: "2025-01-05",
      lastViewed: "2025-03-12",
      tags: ["photos", "property"],
      starred: true,
      status: "active",
    },
    {
      id: 4,
      name: `Maintenance History - ${property.name || 'Property'}.xlsx`,
      type: "Spreadsheet",
      category: "Maintenance",
      size: "1.2 MB",
      uploadedBy: "System Admin",
      uploadDate: "2025-02-20",
      lastViewed: "2025-02-28",
      tags: ["maintenance", "history"],
      starred: false,
      status: "active",
    }
  ];
  
  // Use real documents if available, otherwise use mock data
  const documents = propertyDocuments.length > 0 ? propertyDocuments : mockDocuments;
  
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM d, yyyy");
  };
  
  // Filter documents based on search query
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );
  
  // Handle document selection
  const toggleDocumentSelection = (documentId: string | number) => {
    const id = documentId.toString();
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter(docId => docId !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };
  
  // Handle bulk selection
  const selectAllDocuments = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id.toString()));
    }
  };
  
  // Get the appropriate icon based on file type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <FileImage className="h-4 w-4" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'archive':
        return <FileArchive className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };
  
  // Mock sample documents based on folders
  const mockDocsByFolder = {
    legal: [
      {
        id: 1,
        name: "Purchase Agreement",
        type: "Legal",
        uploadDate: "2020-06-10",
        size: "2.4 MB",
        folderId: "legal"
      },
      {
        id: 2,
        name: "Building Code Compliance",
        type: "Legal",
        uploadDate: "2021-09-12",
        size: "3.6 MB",
        folderId: "legal"
      },
      {
        id: 3,
        name: "Property Survey",
        type: "Legal",
        uploadDate: "2020-06-05",
        size: "8.2 MB",
        folderId: "legal"
      }
    ],
    tenant: [
      {
        id: 4,
        name: "Tenant Lease - Unit 101",
        type: "Legal",
        uploadDate: "2022-03-15",
        size: "1.8 MB",
        folderId: "tenant"
      },
      {
        id: 5,
        name: "Tenant Agreement - Office Space",
        type: "Legal",
        uploadDate: "2022-04-22",
        size: "2.1 MB",
        folderId: "tenant"
      }
    ],
    financial: [
      {
        id: 6,
        name: "Annual Financial Report 2024",
        type: "Spreadsheet",
        uploadDate: "2024-12-31",
        size: "3.2 MB",
        folderId: "financial"
      },
      {
        id: 7,
        name: "Q1 2025 Financial Statement",
        type: "Spreadsheet",
        uploadDate: "2025-04-10",
        size: "2.5 MB",
        folderId: "financial"
      }
    ],
    maintenance: [
      {
        id: 8,
        name: "HVAC Maintenance Schedule",
        type: "Spreadsheet",
        uploadDate: "2025-01-15",
        size: "1.2 MB",
        folderId: "maintenance"
      },
      {
        id: 9,
        name: "Roof Inspection Report",
        type: "PDF",
        uploadDate: "2025-02-28",
        size: "4.5 MB",
        folderId: "maintenance"
      }
    ],
    other: []
  };
  
  // Flatten all documents for "All Documents" view
  const allDocuments = Object.values(mockDocsByFolder).flat();

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold">Property Documents</h2>
            <p className="text-muted-foreground">Upload and manage property documents</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">New Folder</Button>
            <Button>Upload Document</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Folders sidebar */}
          <div className="col-span-3 space-y-1">
            <h3 className="font-medium text-sm mb-3">Folders</h3>
            
            {documentFolders.map((folder) => (
              <div 
                key={folder.id}
                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${
                  selectedFolder === folder.id 
                    ? "bg-secondary text-secondary-foreground" 
                    : "hover:bg-secondary/30"
                }`}
                onClick={() => setSelectedFolder(folder.id)}
              >
                <FileText className="h-4 w-4" />
                <span className="text-sm">{folder.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {folder.count}
                </span>
              </div>
            ))}
            
            <div 
              className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer ${
                selectedFolder === null 
                  ? "bg-secondary text-secondary-foreground" 
                  : "hover:bg-secondary/30"
              }`}
              onClick={() => setSelectedFolder(null)}
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm">All Documents</span>
              <span className="ml-auto text-xs text-muted-foreground">
                9
              </span>
            </div>
          </div>
          
          {/* Document list */}
          <div className="col-span-9">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Show documents based on selected folder */}
                {(selectedFolder === null ? allDocuments : mockDocsByFolder[selectedFolder as keyof typeof mockDocsByFolder] || []).map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      {doc.name}
                    </TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{formatDate(doc.uploadDate)}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Download</Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Rename</DropdownMenuItem>
                            <DropdownMenuItem>Move to Folder</DropdownMenuItem>
                            <DropdownMenuItem>Replace</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {/* Show message when folder is empty */}
                {selectedFolder !== null && 
                 mockDocsByFolder[selectedFolder as keyof typeof mockDocsByFolder]?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      This folder is empty. Upload documents or move them here.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
