import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, FileCheck, Clock } from "lucide-react"

export function CollaborationStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="card-hover-effect">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Workspaces</CardTitle>
          <div className="h-7 w-7 rounded-full bg-primary/5 flex items-center justify-center">
            <Users className="h-3.5 w-3.5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-medium">8</div>
          <p className="text-xs text-muted-foreground">3 shared with clients</p>
        </CardContent>
      </Card>

      <Card className="card-hover-effect">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
          <div className="h-7 w-7 rounded-full bg-primary/5 flex items-center justify-center">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-medium">12</div>
          <p className="text-xs text-muted-foreground">5 require action</p>
        </CardContent>
      </Card>

      <Card className="card-hover-effect">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Shared Documents</CardTitle>
          <div className="h-7 w-7 rounded-full bg-primary/5 flex items-center justify-center">
            <FileCheck className="h-3.5 w-3.5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-medium">47</div>
          <p className="text-xs text-muted-foreground">8 pending approval</p>
        </CardContent>
      </Card>

      <Card className="card-hover-effect">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
          <div className="h-7 w-7 rounded-full bg-primary/5 flex items-center justify-center">
            <Clock className="h-3.5 w-3.5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-medium">24</div>
          <p className="text-xs text-muted-foreground">Actions in last 24 hours</p>
        </CardContent>
      </Card>
    </div>
  )
}

