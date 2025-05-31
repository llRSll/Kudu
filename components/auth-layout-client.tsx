"use client";
import { AuthProvider } from "@/lib/auth-context";
import type { ReactNode } from "react";

export default function AuthLayoutClient({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>{children}</AuthProvider>
  );
}
