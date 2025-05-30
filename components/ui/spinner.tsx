"use client"

import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
  size?: "small" | "medium" | "large"
}

export function Spinner({ className, size = "medium" }: SpinnerProps) {
  const sizeClasses = {
    small: "h-4 w-4 border",
    medium: "h-6 w-6 border-2",
    large: "h-8 w-8 border-2",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-r-transparent border-primary",
        sizeClasses[size],
        className
      )}
      aria-label="Loading"
    />
  )
}
