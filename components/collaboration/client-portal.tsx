"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, FileText, MoreHorizontal, Plus, Settings, Share2, Users, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Sample data for client portals
const clients = [
  {
    id: 1,
    name: "Doe Family",
    email: "john.doe@example.com",
    status: "active",
    lastActive: "2025-03-15T14:30:00",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "DF",
    sharedItems: 12,
    pendingApprovals: 3,
  },
  {
    id: 2,
    name: "Smith Enterprises",
    email: "robert.smith@example.com",
    status: "active",
    lastActive: "2025-03-14T09:45:00",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SE",
    sharedItems: 8,
    pendingApprovals: 1,
  },
  {
    id: 3,
    name: "Johnson Family Office",
    email: "mjohnson@example.com",
    status: "inactive",
    lastActive: "2025-03-01T16:20:00",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JF",
    sharedItems: 5,
    pendingApprovals: 0,
  },
]

// Sample data for pending approvals
const pendingApprovals = [
  {
    id: 1,
    title: "Q1 Investment Strategy",
    type: "Document",
    client: "Doe Family",
    sentDate: "2025-03-10T14:30:00",
    expiryDate: "2025-03-25T14:30:00",
    status: "pending",
  },
  {
    id: 2,
    title: "Tax Planning Proposal",
    type: "Document",
    client: "Doe Family",
    sentDate: "2025-03-12T10:15:00",
    expiryDate: "2025-03-26T10:15:00",
    status: "pending",
  },
  {
    id: 3,
    title: "Property Acquisition Terms",
    type: "Agreement",
    client: "Doe Family",
    sentDate: "2025-03-14T16:45:00",
    expiryDate: "2025-03-28T16:45:00",
    status: "pending",
  },
  {
    id: 4,
    title: "Portfolio Rebalancing Proposal",
    type: "Document",
    client: "Smith Enterprises",
    sentDate: "2025-03-15T11:30:00",
    expiryDate: "2025-03-29T11:30:00",
    status: "pending",
  },
]

export function ClientPortal() {
  const [isCreatePortalOpen, setIsCreatePortalOpen] = useState(false)
  const [isShareDocumentOpen, setIsShareDocumentOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleShareWithClient = (client) => {
    setSelectedClient(client)
    setIsShareDocumentOpen(true)
  }

  return (
    <div className="p-4">
      <Tabs defaultValue="clients" className="w-full">
        <TabsList className="mb-4 h-8">
          <TabsTrigger value="clients" className="text-xs">
            Client Portals
          </TabsTrigger>
          <TabsTrigger value="approvals" className="text-xs">
            Pending Approvals
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs">
            Client Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Active Client Portals</h3>
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsCreatePortalOpen(true)}>
              <Plus className="mr-1 h-3 w-3" />
              New Client Portal
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="border rounded-md p-4 hover:bg-muted/20 transition-colors card-hover-effect"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={client.avatar} alt={client.name} />
                      <AvatarFallback>{client.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-sm">{client.name}</h3>
                      <p className="text-xs text-muted-foreground">{client.email}</p>
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
                      <DropdownMenuItem
                        className="text-xs text-foreground"
                        onClick={() => handleShareWithClient(client)}
                      >
                        <Share2 className="mr-2 h-3.5 w-3.5" />
                        Share Document
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs text-foreground">
                        <Settings className="mr-2 h-3.5 w-3.5" />
                        Portal Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-xs text-destructive">Deactivate Portal</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-muted/30 p-2">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="flex items-center mt-1">
                      <Badge
                        variant={client.status === "active" ? "default" : "secondary"}
                        className="text-xs font-normal"
                      >
                        {client.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="rounded-md bg-muted/30 p-2">
                    <p className="text-xs text-muted-foreground">Last Active</p>
                    <p className="text-xs font-medium mt-1">{formatDate(client.lastActive)}</p>
                  </div>
                  <div className="rounded-md bg-muted/30 p-2">
                    <p className="text-xs text-muted-foreground">Shared Items</p>
                    <p className="text-xs font-medium mt-1">{client.sharedItems} items</p>
                  </div>
                  <div className="rounded-md bg-muted/30 p-2">
                    <p className="text-xs text-muted-foreground">Pending Approvals</p>
                    <p className="text-xs font-medium mt-1">{client.pendingApprovals} items</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm" className="h-7 text-xs w-[48%] text-foreground">
                    <Users className="mr-1 h-3 w-3" />
                    View Portal
                  </Button>
                  <Button
                    size="sm"
                    className="h-7 text-xs w-[48%] text-primary-foreground"
                    onClick={() => handleShareWithClient(client)}
                  >
                    <Share2 className="mr-1 h-3 w-3" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approvals">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Pending Approvals</h3>
              <Badge variant="outline" className="text-xs font-normal">
                {pendingApprovals.length} items
              </Badge>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Clock className="mr-1 h-3 w-3" />
              View History
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-3 text-xs font-medium">Document</th>
                  <th className="text-left p-3 text-xs font-medium">Client</th>
                  <th className="text-left p-3 text-xs font-medium">Sent Date</th>
                  <th className="text-left p-3 text-xs font-medium">Expiry Date</th>
                  <th className="text-left p-3 text-xs font-medium">Status</th>
                  <th className="text-left p-3 text-xs font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApprovals.map((approval) => (
                  <tr key={approval.id} className="border-b hover:bg-muted/20">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-primary/70" />
                        <div>
                          <p className="text-sm font-medium">{approval.title}</p>
                          <p className="text-xs text-muted-foreground">{approval.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{approval.client}</td>
                    <td className="p-3 text-xs">{formatDateTime(approval.sentDate)}</td>
                    <td className="p-3 text-xs">{formatDateTime(approval.expiryDate)}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs font-normal">
                        {approval.status === "pending" ? "Awaiting Approval" : approval.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <XCircle className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-sm font-medium">Client activity will appear here</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Track when clients view or interact with shared content
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Client Portal Dialog */}
      <Dialog open={isCreatePortalOpen} onOpenChange={setIsCreatePortalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Client Portal</DialogTitle>
            <DialogDescription>Set up a secure portal for client collaboration and document sharing.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client-name" className="text-xs">
                Client Name
              </Label>
              <Input id="client-name" placeholder="Enter client name" className="h-8 text-sm" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-email" className="text-xs">
                Client Email
              </Label>
              <Input id="client-email" type="email" placeholder="Enter client email" className="h-8 text-sm" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-type" className="text-xs">
                Client Type
              </Label>
              <Select>
                <SelectTrigger id="client-type" className="h-8 text-sm">
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="trust">Trust</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="access-level" className="text-xs">
                Default Access Level
              </Label>
              <Select defaultValue="view">
                <SelectTrigger id="access-level" className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View Only</SelectItem>
                  <SelectItem value="comment">Can Comment</SelectItem>
                  <SelectItem value="approve">Can Approve</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes" className="text-xs">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this client"
                className="resize-none h-20 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsCreatePortalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={() => setIsCreatePortalOpen(false)}>
              Create Portal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Document Dialog */}
      <Dialog open={isShareDocumentOpen} onOpenChange={setIsShareDocumentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share with Client</DialogTitle>
            <DialogDescription>
              {selectedClient && `Share documents with ${selectedClient.name} for review or approval.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-xs">Document Type</Label>
              <Select>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="report">Financial Report</SelectItem>
                  <SelectItem value="statement">Account Statement</SelectItem>
                  <SelectItem value="proposal">Investment Proposal</SelectItem>
                  <SelectItem value="agreement">Legal Agreement</SelectItem>
                  <SelectItem value="tax">Tax Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="document" className="text-xs">
                Select Document
              </Label>
              <div className="flex gap-2">
                <Input id="document" placeholder="Choose file" className="h-8 text-sm" />
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Browse
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs">Approval Required</Label>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="require-approval" className="rounded border-gray-300" />
                <Label htmlFor="require-approval" className="text-xs font-normal">
                  Require client approval for this document
                </Label>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs">Expiry Date</Label>
              <Input type="date" className="h-8 text-sm" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message" className="text-xs">
                Message to Client
              </Label>
              <Textarea id="message" placeholder="Add a message to the client" className="resize-none h-20 text-sm" />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="notify-client" className="rounded border-gray-300" defaultChecked />
              <Label htmlFor="notify-client" className="text-xs font-normal">
                Send email notification to client
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsShareDocumentOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={() => setIsShareDocumentOpen(false)}>
              Share Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

