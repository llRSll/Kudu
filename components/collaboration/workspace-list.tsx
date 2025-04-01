"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  Calendar,
  CreditCard,
  FileText,
  MoreHorizontal,
  Plus,
  Settings,
  Share2,
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

// Sample data for workspaces
const workspaces = [
  {
    id: 1,
    name: "Investment Strategy",
    description: "Collaborative workspace for investment planning and strategy",
    category: "Investments",
    icon: TrendingUp,
    members: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
      { name: "Michael Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "MC" },
    ],
    lastActivity: "2025-03-15T14:30:00",
    isSharedWithClients: true,
  },
  {
    id: 2,
    name: "Real Estate Portfolio",
    description: "Manage and collaborate on real estate assets",
    category: "Properties",
    icon: Building2,
    members: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
    ],
    lastActivity: "2025-03-14T09:45:00",
    isSharedWithClients: false,
  },
  {
    id: 3,
    name: "Tax Planning",
    description: "Collaborative tax planning and strategy",
    category: "Financial",
    icon: Calendar,
    members: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      { name: "Alex Rodriguez", avatar: "/placeholder.svg?height=32&width=32", initials: "AR" },
    ],
    lastActivity: "2025-03-12T16:20:00",
    isSharedWithClients: false,
  },
  {
    id: 4,
    name: "Credit Facility Management",
    description: "Manage and monitor credit facilities",
    category: "Credit",
    icon: CreditCard,
    members: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      { name: "Michael Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "MC" },
      { name: "Alex Rodriguez", avatar: "/placeholder.svg?height=32&width=32", initials: "AR" },
    ],
    lastActivity: "2025-03-10T11:15:00",
    isSharedWithClients: true,
  },
  {
    id: 5,
    name: "Entity Structuring",
    description: "Collaborative workspace for entity planning",
    category: "Entities",
    icon: Users,
    members: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
    ],
    lastActivity: "2025-03-13T13:40:00",
    isSharedWithClients: false,
  },
  {
    id: 6,
    name: "Document Repository",
    description: "Shared document storage and collaboration",
    category: "Documents",
    icon: FileText,
    members: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
      { name: "Michael Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "MC" },
      { name: "Alex Rodriguez", avatar: "/placeholder.svg?height=32&width=32", initials: "AR" },
    ],
    lastActivity: "2025-03-08T10:30:00",
    isSharedWithClients: true,
  },
]

export function WorkspaceList() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = useState(null)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleShare = (workspace) => {
    setSelectedWorkspace(workspace)
    setIsShareDialogOpen(true)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium">Active Workspaces</h3>
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-1 h-3 w-3" />
          New Workspace
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="border rounded-md p-4 hover:bg-muted/20 transition-colors card-hover-effect"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 mt-0.5">
                  <workspace.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{workspace.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{workspace.description}</p>
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
                  <DropdownMenuItem className="text-xs text-foreground" onClick={() => handleShare(workspace)}>
                    <Share2 className="mr-2 h-3.5 w-3.5" />
                    Share Workspace
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-xs text-foreground">
                    <Settings className="mr-2 h-3.5 w-3.5" />
                    Workspace Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-xs text-destructive">Archive Workspace</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-2">
                {workspace.members.slice(0, 3).map((member, index) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-[10px]">{member.initials}</AvatarFallback>
                  </Avatar>
                ))}
                {workspace.members.length > 3 && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-medium border-2 border-background">
                    +{workspace.members.length - 3}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {workspace.isSharedWithClients && (
                  <Badge variant="outline" className="text-[10px] font-normal px-1 py-0 h-5">
                    Client Access
                  </Badge>
                )}
                <span className="text-[10px] text-muted-foreground">Updated {formatDate(workspace.lastActivity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Workspace Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>Create a collaborative workspace for your team and clients.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-xs">
                Workspace Name
              </Label>
              <Input id="name" placeholder="Enter workspace name" className="h-8 text-sm" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-xs">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this workspace"
                className="resize-none h-20 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-xs">
                Category
              </Label>
              <Select>
                <SelectTrigger id="category" className="h-8 text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investments">Investments</SelectItem>
                  <SelectItem value="properties">Properties</SelectItem>
                  <SelectItem value="credit">Credit Facilities</SelectItem>
                  <SelectItem value="entities">Entities</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                  <SelectItem value="financial">Financial Planning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs">Team Members</Label>
              <div className="flex flex-wrap gap-2 border rounded-md p-2">
                <Badge variant="secondary" className="text-xs flex items-center gap-1 h-6">
                  John Doe
                  <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1">
                    <MoreHorizontal className="h-2.5 w-2.5" />
                  </Button>
                </Badge>
                <Button variant="outline" size="sm" className="h-6 text-xs">
                  <Plus className="mr-1 h-3 w-3" />
                  Add Member
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="client-access" className="rounded border-gray-300" />
              <Label htmlFor="client-access" className="text-xs font-normal">
                Allow client access to this workspace
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={() => setIsCreateDialogOpen(false)}>
              Create Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Workspace Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Workspace</DialogTitle>
            <DialogDescription>
              {selectedWorkspace && `Share "${selectedWorkspace.name}" with team members or clients.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label className="text-xs">Share With</Label>
              <Select>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team">Team Members</SelectItem>
                  <SelectItem value="client">Clients</SelectItem>
                  <SelectItem value="external">External Collaborators</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-xs">
                Email Address
              </Label>
              <div className="flex gap-2">
                <Input id="email" placeholder="Enter email address" className="h-8 text-sm" />
                <Button size="sm" className="h-8 text-xs">
                  Add
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs">Permission Level</Label>
              <Select defaultValue="view">
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View Only</SelectItem>
                  <SelectItem value="comment">Can Comment</SelectItem>
                  <SelectItem value="edit">Can Edit</SelectItem>
                  <SelectItem value="manage">Can Manage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="border rounded-md p-3">
              <h4 className="text-xs font-medium mb-2">Current Access</h4>
              <div className="space-y-2 max-h-[120px] overflow-y-auto">
                {selectedWorkspace?.members.map((member, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-[10px]">{member.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs">{member.name}</span>
                    </div>
                    <Select defaultValue="edit">
                      <SelectTrigger className="h-6 text-[10px] w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View</SelectItem>
                        <SelectItem value="comment">Comment</SelectItem>
                        <SelectItem value="edit">Edit</SelectItem>
                        <SelectItem value="manage">Manage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="notify-users" className="rounded border-gray-300" />
              <Label htmlFor="notify-users" className="text-xs font-normal">
                Notify users about this shared workspace
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsShareDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="h-8 text-xs" onClick={() => setIsShareDialogOpen(false)}>
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

