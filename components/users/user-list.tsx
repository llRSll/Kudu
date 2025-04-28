"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Check,
  Clock,
  Edit,
  Key,
  Lock,
  MoreHorizontal,
  Pencil,
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
import { AddUserForm } from "./add-user-form";
import { type User as UserType } from "@/lib/actions/users"
import Link from "next/link";

interface UserListProps {
  users: UserType[];
}

export function UserList({ users }: UserListProps) {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);

  const formatDate = (dateString: Date | string | null | undefined): string => {
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

  const getTimeAgo = (dateString: Date | string | null | undefined): string => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    if (days > 0) return `${days} days ago`
    if (hours > 0) return `${hours} hours ago`
    if (minutes > 0) return `${minutes} minutes ago`
    if (seconds > 0) return `${seconds} seconds ago`
    return "Just now"
  }

  const getStatusBadge = (status: string | null | undefined) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return <Badge variant="default">Active</Badge>
      case "PENDING":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        )
      case "INACTIVE":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Inactive
          </Badge>
        )
      default:
        return null
    }
  }

  const getRoleIcon = (role: string | null | undefined) => {
    switch (role) {
      case "ADMIN":
        return <ShieldAlert className="h-4 w-4 text-red-500" />
      case "PROPERTY MANAGER":
        return <Key className="h-4 w-4 text-blue-500" />
      case "INVESTMENT ADVISOR":
        return <UserCog className="h-4 w-4 text-green-500" />
      case "FINANCIAL ADVISOR":
        return <UserCog className="h-4 w-4 text-purple-500" />
      case "FAMILY MEMBER":
        return <User className="h-4 w-4 text-orange-500" />
      case "LEGAL ADVISOR":
        return <Shield className="h-4 w-4 text-indigo-500" />
      case "TAX ADVISOR":
        return <UserCog className="h-4 w-4 text-teal-500" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user access and permissions.</CardDescription>
              <div className="flex items-center gap-2">
                <Input placeholder="Search users..." className="max-w-sm" />
                <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                      <UserPlus className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add User
                      </span>
                    </Button>
                  </DialogTrigger>
                  <AddUserForm setOpen={setIsAddUserDialogOpen} />
                </Dialog>
              </div>
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
                              {user.avatar_url ? (
                                <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.surname}`} />
                              ) : null}
                              <AvatarFallback>
                                {(user.first_name?.[0] ?? '') + (user.surname?.[0] ?? '')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                              <p className="text-sm font-medium leading-none">{user.first_name} {user.surname}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
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
                          <div className="flex items-center text-sm">
                            <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                            {getTimeAgo(user.last_login)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Link href={`/users/${user.id}/edit`} passHref>
                              <Button variant="outline" size="icon">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit User</span>
                              </Button>
                            </Link>
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
                      .filter((user) => user.status?.toUpperCase() === "ACTIVE")
                      .map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-3">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                {user.avatar_url ? (
                                  <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.surname}`} />
                                ) : null}
                                <AvatarFallback>
                                  {(user.first_name?.[0] ?? '') + (user.surname?.[0] ?? '')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">{user.first_name} {user.surname}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
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
                              {getTimeAgo(user.last_login)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Link href={`/users/${user.id}/edit`} passHref>
                                <Button variant="outline" size="icon">
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit User</span>
                                </Button>
                              </Link>
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
              {users.filter((user) => user.status?.toUpperCase() === "PENDING").length > 0 ? (
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
                        .filter((user) => user.status?.toUpperCase() === "PENDING")
                        .map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="p-3">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  {user.avatar_url ? (
                                    <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.surname}`} />
                                  ) : null}
                                  <AvatarFallback>
                                    {(user.first_name?.[0] ?? '') + (user.surname?.[0] ?? '')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                  <p className="text-sm font-medium leading-none">{user.first_name} {user.surname}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
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
                                <Link href={`/users/${user.id}/edit`} passHref>
                                  <Button variant="outline" size="icon">
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit User</span>
                                  </Button>
                                </Link>
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
                      .filter((user) => user.status?.toUpperCase() === "INACTIVE")
                      .map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-3">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                {user.avatar_url ? (
                                  <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.surname}`} />
                                ) : null}
                                <AvatarFallback>
                                  {(user.first_name?.[0] ?? '') + (user.surname?.[0] ?? '')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="grid gap-1">
                                <p className="text-sm font-medium leading-none">{user.first_name} {user.surname}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
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
                              {getTimeAgo(user.last_login)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Link href={`/users/${user.id}/edit`} passHref>
                                <Button variant="outline" size="icon">
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit User</span>
                                </Button>
                              </Link>
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
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>User Details: {selectedUser?.first_name} {selectedUser?.surname}</DialogTitle>
              <DialogDescription>
                View and manage user details and permissions.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="flex items-center mb-4 pb-4 border-b">
                <Avatar className="h-10 w-10 mr-4">
                  {selectedUser.avatar_url ? (
                    <AvatarImage src={selectedUser.avatar_url} alt={`${selectedUser.first_name} ${selectedUser.surname}`} />
                  ) : null}
                  <AvatarFallback>
                    {(selectedUser.first_name?.[0] ?? '') + (selectedUser.surname?.[0] ?? '')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedUser.first_name} {selectedUser.surname}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
                <Badge className="ml-auto">{selectedUser.role}</Badge>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <p id="email" className="text-sm">{selectedUser.email}</p>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="role">Role</Label>
                <p id="role" className="text-sm">{selectedUser.role}</p>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="status">Status</Label>
                <p id="status" className="text-sm capitalize">{selectedUser.status}</p>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="lastActive">Last Active</Label>
                <p id="lastActive" className="text-sm">{formatDate(selectedUser.last_login)}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
