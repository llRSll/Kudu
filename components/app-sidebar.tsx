"use client"

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
  User,
  FileText,
  FileBarChart,
  Activity,
  Search,
  MessageSquare,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfile } from "@/components/user-profile"

export function AppSidebar() {
  const pathname = usePathname()
  const { isMobile } = useSidebar()

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
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
  ]

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-col gap-0 px-3 py-2">
        <div className="flex items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-2 font-medium text-lg">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
              <Home className="h-4 w-4" />
            </div>
            <span className="font-medium tracking-tight">KUDU</span>
          </Link>
          {isMobile && <SidebarTrigger />}
        </div>
        <div className="flex items-center gap-2 py-2">
          <UserProfile />
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 relative">
                  <Bell className="h-3.5 w-3.5" />
                  <span className="sr-only">Notifications</span>
                  <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 dropdown-menu-content">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span className="text-xs text-foreground">Notifications</span>
                  <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 font-normal badge-text-fix">
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
                      description: "Portfolio performance exceeded target by 2.3%",
                      time: "5 hours ago",
                      isNew: true,
                    },
                    {
                      title: "Credit Facility",
                      description: "Upcoming payment due for Bank of America line",
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
                        <div className="font-medium text-xs">{notification.title}</div>
                        {notification.isNew && <Badge className="ml-auto text-[9px] px-1 py-0 font-normal">New</Badge>}
                      </div>
                      <div className="text-xs text-muted-foreground">{notification.description}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">{notification.time}</div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary text-xs font-medium">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className={isActive ? "bg-primary/10 text-primary font-medium" : ""}
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User className="h-4 w-4" />
                  <span className="text-sm">Account</span>
                  <ChevronDown className="ml-auto h-3.5 w-3.5" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-52 dropdown-menu-content">
                <DropdownMenuItem className="text-xs text-foreground">
                  <User className="mr-2 h-3.5 w-3.5" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs text-foreground">
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive text-xs">
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

