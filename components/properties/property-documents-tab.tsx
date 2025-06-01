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
}

interface PropertyDocumentsTabProps {
  property: Property;
  // In a real app, these would be fetched from an API
  propertyDocuments: PropertyDocument[];
}

export function PropertyDocumentsTab({
  property,
  propertyDocuments = [] // Default to empty array
}: PropertyDocumentsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  
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
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Property Documents</CardTitle>
              <CardDescription>
                Manage all documents related to {property.name || 'this property'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
              <DocumentUploadDialog />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
                <TabsTrigger value="financial">Financial</TabsTrigger>
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>
              <div className="relative max-w-sm">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search documents..." 
                  className="pl-8 h-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <TabsContent value="all" className="mt-0 p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox 
                          checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                          onCheckedChange={selectAllDocuments}
                          aria-label="Select all documents"
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden md:table-cell">Size</TableHead>
                      <TableHead className="hidden md:table-cell">Date Added</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          {searchQuery ? (
                            <div>
                              <p className="text-muted-foreground">No documents matching "{searchQuery}"</p>
                              <Button variant="link" onClick={() => setSearchQuery("")}>
                                Clear search
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <p className="text-muted-foreground">No documents found for this property</p>
                              <DocumentUploadDialog />
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocuments.map(doc => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedDocuments.includes(doc.id.toString())}
                              onCheckedChange={() => toggleDocumentSelection(doc.id)}
                              aria-label={`Select ${doc.name}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {doc.starred && <Star className="h-3 w-3 text-orange-400" />}
                              {getFileIcon(doc.type)}
                              <span className="font-medium truncate max-w-[250px]">{doc.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{doc.type}</TableCell>
                          <TableCell className="hidden md:table-cell">{doc.size}</TableCell>
                          <TableCell className="hidden md:table-cell">{formatDate(doc.uploadDate)}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {doc.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="px-1 py-0 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {doc.tags.length > 2 && (
                                <Badge variant="outline" className="px-1 py-0 text-xs">
                                  +{doc.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  {doc.starred ? (
                                    <>
                                      <Star className="mr-2 h-4 w-4" />
                                      Remove Star
                                    </>
                                  ) : (
                                    <>
                                      <Star className="mr-2 h-4 w-4" />
                                      Star Document
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Other tabs would have similar content structure */}
            <TabsContent value="legal" className="mt-0 p-0">
              <div className="rounded-md border">
                <Table>
                  {/* Similar structure as above but filtered for legal documents */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox aria-label="Select all documents" />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden md:table-cell">Size</TableHead>
                      <TableHead className="hidden md:table-cell">Date Added</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments
                      .filter(doc => doc.category === 'Legal')
                      .length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          <p className="text-muted-foreground">No legal documents found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocuments
                        .filter(doc => doc.category === 'Legal')
                        .map(doc => (
                          <TableRow key={doc.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedDocuments.includes(doc.id.toString())}
                                onCheckedChange={() => toggleDocumentSelection(doc.id)}
                                aria-label={`Select ${doc.name}`}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {doc.starred && <Star className="h-3 w-3 text-orange-400" />}
                                {getFileIcon(doc.type)}
                                <span className="font-medium truncate max-w-[250px]">{doc.name}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{doc.type}</TableCell>
                            <TableCell className="hidden md:table-cell">{doc.size}</TableCell>
                            <TableCell className="hidden md:table-cell">{formatDate(doc.uploadDate)}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {doc.tags.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="secondary" className="px-1 py-0 text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        {selectedDocuments.length > 0 && (
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{selectedDocuments.length} selected</span>
              <Button size="sm" variant="outline" className="h-8">
                <Download className="mr-1 h-3.5 w-3.5" />
                Download
              </Button>
              <Button size="sm" variant="outline" className="h-8">
                <Share2 className="mr-1 h-3.5 w-3.5" />
                Share
              </Button>
              <Button size="sm" variant="outline" className="h-8 text-destructive hover:bg-destructive/10">
                Delete
              </Button>
            </div>
            <Button size="sm" variant="ghost" className="h-8" onClick={() => setSelectedDocuments([])}>
              Clear selection
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
