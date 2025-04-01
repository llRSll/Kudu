"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Check,
  Clock,
  Edit,
  Key,
  Lock,
  MoreHorizontal,
  Shield,
  ShieldAlert,
  User,
  UserCog,
  UserPlus,
  X,
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Sample data for users
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "active",
    lastActive: "2025-03-15T14:30:00",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JD",
    permissions: {
      dashboard: "full",
      properties: "full",
      investments: "full",
      credit: "full",
      entities: "full",
      documents: "full",
      users: "full",
    },
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "Admin",
    status: "active",
    lastActive: "2025-03-14T09:45:00",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JD",
    permissions: {
      dashboard: "full",
      properties: "full",
      investments: "full",
      credit: "full",
      entities: "full",
      documents: "full",
      users: "full",
    },
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Property Manager",
    status: "active",
    lastActive: "2025-03-12T16:20:00",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SJ",
    permissions: {
      dashboard: "read",
      properties: "full",
      investments: "none",
      credit: "none",
      entities: "read",
      documents: "limited",
      users: "none",
    },
  },
  {
    id: 4,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "Investment Advisor",
    status: "active",
    lastActive: "2025-03-10T11:15:00",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MC",
    permissions: {
      dashboard: "read",
      properties: "read",
      investments: "full",
      credit: "read",
      entities: "read",
      documents: "limited",
      users: "none",
    },
  },
  {
    id: 5,
    name: "Alex Rodriguez",
    email: "alex.rodriguez@example.com",
    role: "Financial Advisor",
    status: "active",
    lastActive: "2025-03-13T13:40:00",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AR",
    permissions: {
      dashboard: "read",
      properties: "read",
      investments: "read",
      credit: "full",
      entities: "read",
      documents: "limited",
      users: "none",
    },
  },
  {
    id: 6,
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    role: "Family Member",
    status: "active",
    lastActive: "2025-03-08T10:30:00",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "EW",
    permissions: {
      dashboard: "read",
      properties: "read",
      investments: "read",
      credit: "read",
      entities: "read",
      documents: "read",
      users: "none",
    },
  },
  {
    id: 7,
    name: "David Smith",
    email: "david.smith@example.com",
    role: "Legal Advisor",
    status: "pending",
    lastActive: null,
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "DS",
    permissions: {
      dashboard: "none",
      properties: "none",
      investments: "none",
      credit: "none",
      entities: "read",
      documents: "limited",
      users: "none",
    },
  },
  {
    id: 8,
    name: "Lisa Brown",
    email: "lisa.brown@example.com",
    role: "Tax Advisor",
    status: "inactive",
    lastActive: "2025-01-15T09:20:00",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "LB",
    permissions: {
      dashboard: "none",
      properties: "none",
      investments: "none",
      credit: "none",
      entities: "read",
      documents: "limited",
      users: "none",
    },
  },
]

export function UserList() {
  const [selectedUser, setSelectedUser] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return "Never"

    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Inactive
          </Badge>
        )
      default:
        return null
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin":
        return <ShieldAlert className="h-4 w-4 text-red-500" />
      case "Property Manager":
        return <Key className="h-4 w-4 text-blue-500" />
      case "Investment Advisor":
        return <UserCog className="h-4 w-4 text-green-500" />
      case "Financial Advisor":
        return <UserCog className="h-4 w-4 text-purple-500" />
      case "Family Member":
        return <User className="h-4 w-4 text-orange-500" />
      case "Legal Advisor":
        return <Shield className="h-4 w-4 text-indigo-500" />
      case "Tax Advisor":
        return <UserCog className="h-4 w-4 text-teal-500" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and their access permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">User</th>
                      <th className="p-3 text-left font-medium">Role</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Last Active</th>
                      <th className="p-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-3">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center">
                            {getRoleIcon(user.role)}
                            <span className="ml-2">{user.role}</span>
                          </div>
                        </td>
                        <td className="p-3">{getStatusBadge(user.status)}</td>
                        <td className="p-3">
                          {user.lastActive ? (
                            <div className="flex items-center text-sm">
                              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                              {formatDate(user.lastActive)}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Never</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                  <Lock className="mr-2 h-4 w-4" />
                                  Permissions
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[525px]">
                                <DialogHeader>
                                  <DialogTitle>User Permissions</DialogTitle>
                                  <DialogDescription>
                                    Manage access permissions for {selectedUser?.name}
                                  </DialogDescription>
                                </DialogHeader>

                                {selectedUser && (
                                  <div className="py-4">
                                    <div className="flex items-center mb-4 pb-4 border-b">
                                      <Avatar className="h-10 w-10 mr-4">
                                        <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                                        <AvatarFallback>{selectedUser.initials}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h3 className="font-medium">{selectedUser.name}</h3>
                                        <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                      </div>
                                      <Badge className="ml-auto">{selectedUser.role}</Badge>
                                    </div>

                                    <div className="space-y-4">
                                      <div className="grid grid-cols-4 items-center gap-4 py-2 border-b">
                                        <Label className="font-medium">Module</Label>
                                        <Label className="text-center">No Access</Label>
                                        <Label className="text-center">View Only</Label>
                                        <Label className="text-center">Full Access</Label>
                                      </div>

                                      {Object.entries(selectedUser.permissions).map(([module, permission]) => (
                                        <div key={module} className="grid grid-cols-4 items-center gap-4">
                                          <Label className="capitalize">{module}</Label>
                                          <div className="flex justify-center">
                                            <input
                                              type="radio"
                                              name={`permission-${module}`}
                                              defaultChecked={permission === "none"}
                                            />
                                          </div>
                                          <div className="flex justify-center">
                                            <input
                                              type="radio"
                                              name={`permission-${module}`}
                                              defaultChecked={permission === "read" || permission === "limited"}
                                            />
                                          </div>
                                          <div className="flex justify-center">
                                            <input
                                              type="radio"
                                              name={`permission-${module}`}
                                              defaultChecked={permission === "full"}
                                            />
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <DialogFooter>
                                  <Button type="submit">Save Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More options</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                {user.status === "pending" && (
                                  <>
                                    <DropdownMenuItem>
                                      <Check className="mr-2 h-4 w-4 text-green-500" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <X className="mr-2 h-4 w-4 text-red-500" />
                                      Reject
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {user.status === "active" && (
                                  <DropdownMenuItem>
                                    <X className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </DropdownMenuItem>
                                )}
                                {user.status === "inactive" && (
                                  <DropdownMenuItem>
                                    <Check className="mr-2 h-4 w-4" />
                                    Reactivate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Key className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">
                                  <X className="mr-2 h-4 w-4" />
                                  Delete User
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>Users with active access to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">User</th>
                      <th className="p-3 text-left font-medium">Role</th>
                      <th className="p-3 text-left font-medium">Last Active</th>
                      <th className="p-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((user) => user.status === "active")
                      .map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-3">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center">
                              {getRoleIcon(user.role)}
                              <span className="ml-2">{user.role}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center text-sm">
                              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                              {formatDate(user.lastActive)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Lock className="mr-2 h-4 w-4" />
                                Permissions
                              </Button>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Users</CardTitle>
              <CardDescription>Users awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              {users.filter((user) => user.status === "pending").length > 0 ? (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">User</th>
                        <th className="p-3 text-left font-medium">Role</th>
                        <th className="p-3 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter((user) => user.status === "pending")
                        .map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="p-3">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback>{user.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                {getRoleIcon(user.role)}
                                <span className="ml-2">{user.role}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600"
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No pending users</h3>
                  <p className="text-muted-foreground mt-1 max-w-md">
                    There are no users waiting for approval at this time
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Users</CardTitle>
              <CardDescription>Users with deactivated accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">User</th>
                      <th className="p-3 text-left font-medium">Role</th>
                      <th className="p-3 text-left font-medium">Last Active</th>
                      <th className="p-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter((user) => user.status === "inactive")
                      .map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-3">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center">
                              {getRoleIcon(user.role)}
                              <span className="ml-2">{user.role}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center text-sm">
                              <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                              {formatDate(user.lastActive)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Check className="mr-2 h-4 w-4" />
                                Reactivate
                              </Button>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

