import type { Metadata } from "next"
import { SettingsTabs } from "@/components/settings/settings-tabs"

export const metadata: Metadata = {
  title: "Settings - Kudu",
  description: "Manage your account settings and preferences",
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      <SettingsTabs />
    </div>
  )
}

