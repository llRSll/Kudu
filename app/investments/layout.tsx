"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function InvestmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-muted-foreground">
          Loading...
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return children
}
