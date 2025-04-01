"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        // If user is already logged in, redirect to properties
        router.push("/properties")
      } else {
        // If not logged in, redirect to login
        router.push("/login")
      }
    }
  }, [user, loading, router])

  // Show a loading state
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-pulse text-xl text-muted-foreground">
        Loading...
      </div>
    </div>
  )
}

