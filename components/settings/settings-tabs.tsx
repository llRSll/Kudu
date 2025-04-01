"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountSettings } from "@/components/settings/account-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { SecuritySettings } from "@/components/settings/security-settings"
import { AppearanceSettings } from "@/components/settings/appearance-settings"
import { IntegrationSettings } from "@/components/settings/integration-settings"

export function SettingsTabs() {
  return (
    <Tabs defaultValue="account" className="space-y-6">
      <TabsList className="w-full border-b pb-0 bg-transparent h-auto flex flex-wrap">
        <TabsTrigger
          value="account"
          className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Notifications
        </TabsTrigger>
        <TabsTrigger
          value="security"
          className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Security
        </TabsTrigger>
        <TabsTrigger
          value="appearance"
          className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Appearance
        </TabsTrigger>
        <TabsTrigger
          value="integrations"
          className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Integrations
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account" className="space-y-6">
        <AccountSettings />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <NotificationSettings />
      </TabsContent>

      <TabsContent value="security" className="space-y-6">
        <SecuritySettings />
      </TabsContent>

      <TabsContent value="appearance" className="space-y-6">
        <AppearanceSettings />
      </TabsContent>

      <TabsContent value="integrations" className="space-y-6">
        <IntegrationSettings />
      </TabsContent>
    </Tabs>
  )
}

