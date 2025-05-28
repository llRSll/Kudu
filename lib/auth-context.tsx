"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

// Define user type
export interface User {
  id: string;
  email: string;
  name: string;
  first_name?: string | null;
  surname?: string | null;
  avatar_url?: string | null;
  role?: string | null;
}

// Define backend user type (adjust according to your actual backend response)
export interface BackendUser {
  id: string;
  email: string;
  first_name?: string | null;
  surname?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  // Add any other fields that come from your backend
}

export interface AuthContextType {
  user: User | null;
  login: (backendUser: BackendUser) => void;
  logout: () => void;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; // Expose setUser
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Initial state is true
  const router = useRouter();
  const pathname = usePathname();

  console.log(
    "[AuthProvider] Component rendered/re-rendered. Initial loading state:",
    loading,
    "Pathname:",
    pathname
  );

  // Check for existing user session on initial client-side load
  useEffect(() => {
    console.log(
      "[AuthProvider] Mount/Effect to load user triggered. Pathname:",
      pathname
    );
    const loadUser = () => {
      console.log("[AuthProvider] loadUser function invoked.");
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          console.log("[AuthProvider] User found in localStorage:", storedUser);
          setUser(JSON.parse(storedUser));
        } else {
          console.log("[AuthProvider] No user found in localStorage.");
        }
      } catch (error) {
        console.error(
          "[AuthProvider] Error loading user from localStorage:",
          error
        );
      } finally {
        console.log(
          "[AuthProvider] loadUser finally block. Setting loading to false."
        );
        setLoading(false); // This is critical for dependant components
      }
    };

    // Ensure this runs only on the client
    if (typeof window !== "undefined") {
      console.log(
        "[AuthProvider] Window defined, proceeding to call loadUser()."
      );
      loadUser();
    } else {
      console.log(
        "[AuthProvider] Window undefined (SSR), loadUser() skipped. Loading remains true from server."
      );
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // Redirect logic
  useEffect(() => {
    console.log(
      `[AuthProvider] Redirect check. Loading: ${loading}, User: ${!!user}, Pathname: ${pathname}`
    );
    if (!loading) {
      if (user && (pathname === "/login" || pathname === "/register")) {
        console.log(
          "[AuthProvider] User logged in and on auth page, redirecting to /dashboard."
        );
        router.push("/dashboard");
      } else if (!user && pathname !== "/login" && pathname !== "/register") {
        // Define public paths that don't require authentication
        const publicPaths = ["/"]; // Add other public paths if any, e.g., marketing pages
        if (!publicPaths.includes(pathname)) {
          console.log(
            `[AuthProvider] No user, and not on a public path or auth page (${pathname}). Redirecting to /login.`
          );
          router.push("/login");
        }
      }
    }
  }, [user, loading, router, pathname]);

  const login = (backendUser: BackendUser) => {
    console.log(
      "[AuthProvider] login function called with backendUser:",
      backendUser
    );
    const userToStore: User = {
      id: backendUser.id,
      email: backendUser.email,
      name:
        `${backendUser.first_name || ""} ${backendUser.surname || ""}`.trim() ||
        backendUser.email,
      first_name: backendUser.first_name,
      surname: backendUser.surname,
      avatar_url: backendUser.avatar_url,
      role: backendUser.role,
    };
    localStorage.setItem("user", JSON.stringify(userToStore));
    setUser(userToStore);
    console.log(
      "[AuthProvider] User set and stored. Navigating to /dashboard via router.push."
    );
    router.push("/dashboard");
  };

  const logout = () => {
    console.log("[AuthProvider] logout function called.");
    localStorage.removeItem("user");
    Cookies.remove("sb-access-token", { path: "/" });
    setUser(null);
    console.log(
      "[AuthProvider] User removed from state and localStorage. Navigating to /login."
    );
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
