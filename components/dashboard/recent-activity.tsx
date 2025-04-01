import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, FileText, TrendingUp, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      title: "Document uploaded",
      description: "New lease agreement for 123 Main St",
      timestamp: "2 hours ago",
      icon: FileText,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      user: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SJ",
      },
    },
    {
      id: 2,
      title: "Property update",
      description: "Maintenance completed at Oceanview Condo",
      timestamp: "5 hours ago",
      icon: Building2,
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10",
      user: {
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MC",
      },
    },
    {
      id: 3,
      title: "Investment alert",
      description: "Algorithm performance exceeded target by 3.2%",
      timestamp: "Yesterday",
      icon: TrendingUp,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
      user: {
        name: "Alex Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AR",
      },
    },
    {
      id: 4,
      title: "Meeting scheduled",
      description: "Quarterly financial review with advisors",
      timestamp: "Yesterday",
      icon: Clock,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
      user: {
        name: "John Doe",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "JD",
      },
    },
  ]

  return (
    <Card className="card-hover-effect">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest updates across your portfolio</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-primary">
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/20 p-2 rounded-md transition-colors -mx-2"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${activity.iconBg}`}>
                <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{activity.title}</p>
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
              <Avatar className="h-8 w-8 ring-2 ring-background">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">{activity.user.initials}</AvatarFallback>
              </Avatar>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

