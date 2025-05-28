"use client"

import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { SocialSidebar } from "@/components/social-sidebar"
import { AuthProvider } from "@/lib/auth-context"

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <SidebarProvider defaultOpen>
        <div className="flex h-screen w-full overflow-hidden">
          <AppSidebar />
          <SidebarInset className="relative flex-1 w-full">
            <div className="flex h-full w-full">
              <main className="flex-1 w-full overflow-auto">{children}</main>
              <SocialSidebar />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthProvider>
  )
}