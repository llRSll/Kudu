import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CollaborationTabs } from "@/components/collaboration/collaboration-tabs"
import { CollaborationStats } from "@/components/collaboration/collaboration-stats"

export default function CollaborationPage() {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Collaboration</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage shared workspaces and team collaboration</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input type="search" placeholder="Search workspaces..." className="w-full pl-8 h-8 text-sm sm:w-[220px]" />
          </div>
          <Button className="h-8 text-sm">
            <Plus className="mr-2 h-3.5 w-3.5" />
            New Workspace
          </Button>
        </div>
      </div>

      <CollaborationStats />
      <CollaborationTabs />
    </div>
  )
}

