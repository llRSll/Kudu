import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsLoading() {
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account" disabled>
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" disabled>
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" disabled>
            Appearance
          </TabsTrigger>
          <TabsTrigger value="integrations" disabled>
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Skeleton className="h-64 w-full" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

