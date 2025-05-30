"use client"

import { useEffect, useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ToasterProvider } from "@/components/ToasterProvider"
import { AuthProvider } from "@/lib/auth-context"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <AuthProvider>
        <div suppressHydrationWarning>
          {children}
        </div>
      </AuthProvider>
    )
  }

  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="kudu-theme"
      >
        {children}
        <ToasterProvider />
      </ThemeProvider>
    </AuthProvider>
  )
}
