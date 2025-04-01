import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { SocialSidebar } from "@/components/social-sidebar"
import { AuthProvider } from "@/lib/auth-context"
import "./globals.css"

export const metadata = {
  title: "Kudu - Private Wealth Management",
  description: "Comprehensive wealth management for high net worth families",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased theme-transition">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <SidebarProvider>
              <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />
                <SidebarInset className="relative flex-1 w-full">
                  <div className="flex h-full w-full">
                    <main className="flex-1 w-full overflow-auto">{children}</main>
                    <SocialSidebar />
                  </div>
                </SidebarInset>
              </div>
              <Toaster richColors />
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'