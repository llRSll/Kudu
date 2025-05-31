"use client";

import {
  BarChart3,
  Building2,
  CreditCard,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  TrendingUp,
  Users,
  Bell,
  ChevronDown,
  User as UserIcon,
  FileText,
  FileBarChart,
  Activity,
  Search,
  MessageSquare,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";

// Helper function for initials (can be moved to a utils file later)
const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const [isHovered, setIsHovered] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Properties",
      icon: Building2,
      href: "/properties",
    },
    {
      title: "Investments",
      icon: TrendingUp,
      href: "/investments",
    },
    {
      title: "Credit Facilities",
      icon: CreditCard,
      href: "/credit",
    },
    {
      title: "Entities",
      icon: BarChart3,
      href: "/entities",
    },
    {
      title: "Documents",
      icon: FileText,
      href: "/documents",
    },
    {
      title: "Collaboration",
      icon: MessageSquare,
      href: "/collaboration",
    },
    {
      title: "Reports",
      icon: FileBarChart,
      href: "/reports",
    },
    {
      title: "Analytics",
      icon: Activity,
      href: "/analytics",
    },
    {
      title: "Users",
      icon: Users,
      href: "/users",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];

  const iconContainerStyles =
    "w-20 flex-shrink-0 flex justify-center items-center";
  const textStyles = "ml-3 text-sm whitespace-nowrap overflow-hidden"; // Standardized text style

  const { logout } = useAuth();

  return (
    <Sidebar
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variant="floating"
      collapsible="none"
      className={`border-r bg-background transition-all duration-300 ease-in-out ${
        isHovered ? "w-64" : "w-20"
      }`}
    >
      <SidebarHeader className="flex flex-col gap-0 px-3 py-2">
        <div className="flex items-center justify-between py-2">
          <Link
            href="/dashboard"
            className={`flex items-center font-medium text-lg w-full`}
          >
            <div className="w-20 flex-shrink-0 flex justify-center items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <Home className="h-4 w-4" />
              </div>
            </div>
            {isHovered && (
              <span className="font-medium tracking-tight ml-2 whitespace-nowrap overflow-hidden">
                KUDU
              </span>
            )}
          </Link>
          {isMobile && <SidebarTrigger />}
        </div>
        {/* Removed UserProfile and Avatar display logic from here */}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className={`w-full ${
                    isActive ? "bg-primary/10 text-primary font-medium" : ""
                  }`}
                >
                  <Link href={item.href} className="flex items-center w-full">
                    <div className="w-20 flex-shrink-0 flex justify-center items-center">
                      <item.icon className="h-4 w-4" />
                    </div>
                    {isHovered && (
                      <span className="text-sm ml-2 whitespace-nowrap overflow-hidden">
                        {item.title}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* Theme Toggle */}
          <SidebarMenuItem className="p-0">
            <div
              className={`flex items-center h-10 ${
                isHovered ? "w-full justify-start" : "w-20 justify-center"
              } hover:bg-muted/50 transition-colors duration-200 ease-in-out group cursor-pointer`}
              onClick={() => {
                // This is a bit tricky. ThemeToggle is likely a button inside a dropdown.
                // We might need to click its internal button. For now, this div provides the hover area.
                // Or, ThemeToggle itself should be structured to fit this model.
                // Assuming ThemeToggle is self-contained and clicking it directly works.
                const themeToggleButton = document.querySelector(
                  '[aria-label="Toggle theme"]'
                ); // A bit hacky, depends on ThemeToggle impl.
                if (themeToggleButton instanceof HTMLElement)
                  themeToggleButton.click();
              }}
            >
              <div className={iconContainerStyles}>
                <ThemeToggle />
              </div>
              {isHovered && <span className={textStyles}>Theme</span>}
            </div>
          </SidebarMenuItem>

          {/* Notifications Dropdown */}
          <SidebarMenuItem className="p-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`flex items-center h-10 ${
                    isHovered ? "w-full justify-start" : "w-20 justify-center"
                  } hover:bg-muted/50 transition-colors duration-200 ease-in-out group px-0`}
                  aria-label="Notifications"
                >
                  <div className={`${iconContainerStyles} relative`}>
                    {" "}
                    {/* Added relative for badge positioning */}
                    <Bell className="h-4 w-4" />
                    {/* Notification Badges - adjust positioning if needed with new structure */}
                    <span className="absolute top-1.5 right-6 transform h-1.5 w-1.5 rounded-full bg-primary"></span>
                  </div>
                  {isHovered && (
                    <span className={textStyles}>Notifications</span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side={isMobile ? "bottom" : "top"}
                className="w-72 dropdown-menu-content"
              >
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span className="text-xs text-foreground">Notifications</span>
                  <Badge
                    variant="outline"
                    className="ml-2 text-[10px] px-1 py-0 font-normal badge-text-fix"
                  >
                    3 new
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-72 overflow-auto">
                  {[
                    {
                      title: "Property Update",
                      description: "New document uploaded for 123 Main St.",
                      time: "2 hours ago",
                      isNew: true,
                    },
                    {
                      title: "Investment Alert",
                      description:
                        "Portfolio performance exceeded target by 2.3%",
                      time: "5 hours ago",
                      isNew: true,
                    },
                    {
                      title: "Credit Facility",
                      description:
                        "Upcoming payment due for Bank of America line",
                      time: "Yesterday",
                      isNew: true,
                    },
                    {
                      title: "Document Shared",
                      description: "Sarah shared 'Q1 Tax Planning' with you",
                      time: "2 days ago",
                      isNew: false,
                    },
                  ].map((notification, i) => (
                    <DropdownMenuItem
                      key={i}
                      className="flex flex-col items-start py-2 px-3 focus:bg-primary/5 cursor-pointer"
                    >
                      <div className="flex items-center w-full">
                        <div className="font-medium text-xs">
                          {notification.title}
                        </div>
                        {notification.isNew && (
                          <Badge className="ml-auto text-[9px] px-1 py-0 font-normal">
                            New
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {notification.description}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {notification.time}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary text-xs font-medium">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          {/* Logout Button */}
          <SidebarMenuItem className="p-0">
            <Button
              variant="ghost"
              className={`flex items-center h-10 ${
                isHovered ? "w-full justify-start" : "w-20 justify-center"
              } hover:bg-muted/50 transition-colors duration-200 ease-in-out group px-0`}
              onClick={() => logout()}
              aria-label="Logout"
            >
              <div className="w-20 flex-shrink-0 flex justify-center items-center">
                <LogOut className="h-4 w-4" />
              </div>
              {isHovered && (
                <span className="text-sm ml-2 whitespace-nowrap overflow-hidden">
                  Logout
                </span>
              )}
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
