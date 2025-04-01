import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, DollarSign, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UpcomingDisbursements() {
  const disbursements = [
    {
      id: 1,
      title: "Property Tax - 123 Main St",
      amount: 12500,
      date: "Mar 15, 2025",
      status: "upcoming",
      daysLeft: 5,
    },
    {
      id: 2,
      title: "Mortgage Payment - Oceanview Condo",
      amount: 8750,
      date: "Mar 20, 2025",
      status: "upcoming",
      daysLeft: 10,
    },
    {
      id: 3,
      title: "Investment Fund Contribution",
      amount: 50000,
      date: "Mar 25, 2025",
      status: "upcoming",
      daysLeft: 15,
    },
    {
      id: 4,
      title: "Insurance Premium - Commercial Property",
      amount: 15000,
      date: "Apr 1, 2025",
      status: "upcoming",
      daysLeft: 22,
    },
    {
      id: 5,
      title: "Credit Facility Interest Payment",
      amount: 7500,
      date: "Apr 5, 2025",
      status: "upcoming",
      daysLeft: 26,
    },
  ]

  return (
    <Card className="card-hover-effect">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Upcoming Disbursements</CardTitle>
            <CardDescription>Scheduled payments for the next 30 days</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-primary">
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {disbursements.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/20 p-2 rounded-md transition-colors -mx-2"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarClock className="mr-1 h-3 w-3" />
                    {item.date}
                    {item.daysLeft <= 7 && (
                      <Badge variant="destructive" className="ml-2 text-[10px] px-1 py-0">
                        Due soon
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-semibold text-foreground">${item.amount.toLocaleString()}</p>
                <Badge variant="outline" className="mt-1 text-foreground">
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

