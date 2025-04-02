"use client"

import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserList } from "@/components/users/user-list"

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage user access and permissions</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row animate-slide-up">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search users..." className="w-full pl-8 sm:w-[300px]" />
          </div>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <UserList />
      </div>
    </div>
  )
}

