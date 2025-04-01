import { ArrowUpRight, ArrowDownRight, DollarSign, Percent, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardCards() {
  const cards = [
    {
      title: "Total Assets",
      value: "$12,546,000",
      change: "+20.1% from last month",
      icon: DollarSign,
      progress: 75,
      delay: "0s",
    },
    {
      title: "Monthly Cash Flow",
      value: "$245,000",
      change: "+5.2%",
      changeLabel: "vs forecast",
      icon: DollarSign,
      trend: "up",
      delay: "0.1s",
    },
    {
      title: "Property Portfolio",
      value: "8 Properties",
      change: "+1",
      changeLabel: "this quarter",
      icon: Building2,
      trend: "up",
      delay: "0.2s",
    },
    {
      title: "Investment Return",
      value: "8.2%",
      change: "-0.5%",
      changeLabel: "vs forecast",
      icon: Percent,
      trend: "down",
      delay: "0.3s",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="dashboard-card card-hover-effect overflow-hidden"
          style={{ animationDelay: card.delay }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className="h-7 w-7 rounded-full bg-primary/5 flex items-center justify-center">
              <card.icon className="h-3.5 w-3.5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-medium">{card.value}</div>
            {card.trend ? (
              <div className="flex items-center text-xs">
                {card.trend === "up" ? (
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    <span>{card.change}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-rose-600 dark:text-rose-400">
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                    <span>{card.change}</span>
                  </div>
                )}
                {card.changeLabel && <span className="ml-1 text-muted-foreground">{card.changeLabel}</span>}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">{card.change}</p>
            )}
            {card.progress && (
              <div className="mt-4 h-1 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${card.progress}%`, animationDelay: card.delay }}
                ></div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

