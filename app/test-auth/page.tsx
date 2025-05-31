"use client";

import { useAuth } from "@/lib/auth-context";

export default function TestAuthPage() {
  try {
    const { user } = useAuth();
    return (
      <div className="p-4">
        <h1>Auth Test Page</h1>
        <p>User: {user ? JSON.stringify(user, null, 2) : "No user"}</p>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4">
        <h1>Auth Test Page</h1>
        <p className="text-red-500">Error: {(error as Error).message}</p>
      </div>
    );
  }
}
