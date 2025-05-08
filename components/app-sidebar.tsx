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
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfile } from "@/components/user-profile"
import { useAuth } from "@/lib/auth-context"

// Helper function for initials (can be moved to a utils file later)
const getInitials = (name: string) => {
  if (!name) return ""
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

export function AppSidebar() {
  const pathname = usePathname()
  const { isMobile } = useSidebar()
  const [isHovered, setIsHovered] = useState(false)
  const { user, loading: authLoading } = useAuth()
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
  ]

  return (
    <Sidebar
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      variant="floating"
      collapsible="none"
      className={`border-r bg-background transition-all duration-300 ease-in-out ${isHovered ? 'w-64' : 'w-20'}`}
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
            {isHovered && <span className="font-medium tracking-tight ml-2 whitespace-nowrap overflow-hidden">KUDU</span>}
          </Link>
          {isMobile && <SidebarTrigger />}
        </div>
        <div className="flex items-center gap-2 py-2">
          {isHovered && <UserProfile />}
          {!isHovered && (
            <div className="w-full flex justify-center">
              <Avatar className="h-7 w-7">
                {/* Display user initials or a placeholder if loading/no user */}
                {!hasMounted || authLoading ? (
                  <AvatarFallback className="text-xs">...</AvatarFallback> // Placeholder during auth loading or before mount
                ) : user ? (
                  <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                ) : (
                  <AvatarFallback className="text-xs">??</AvatarFallback> // Placeholder if no user after loading and mounted
                )}
              </Avatar>
            </div>
          )}
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
                  className={`w-full ${isActive ? "bg-primary/10 text-primary font-medium" : ""}`}
                >
                  <Link href={item.href} className="flex items-center w-full">
                    <div className="w-20 flex-shrink-0 flex justify-center items-center"> 
                      <item.icon className="h-4 w-4" />
                    </div>
                    {isHovered && <span className="text-sm ml-2 whitespace-nowrap overflow-hidden">{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          {/* Theme Toggle */}
          <SidebarMenuItem className="p-0">
            <div className={`flex items-center w-full py-2 ${isHovered ? 'px-[calc((theme(spacing.20)-theme(spacing.8))/2)] justify-start' : 'justify-center'}`}>
              <div className={`${isHovered ? '' : 'w-20'} flex-shrink-0 flex ${isHovered ? 'justify-start' : 'justify-center'} items-center`}>
                <ThemeToggle />
              </div>
              {isHovered && <span className="text-sm ml-2 whitespace-nowrap overflow-hidden">Theme</span>}
            </div>
          </SidebarMenuItem>

          {/* Notifications Dropdown */}
          <SidebarMenuItem className="p-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full flex items-center h-auto py-2 ${isHovered ? 'px-[calc((theme(spacing.20)-theme(spacing.8))/2)] justify-start' : 'justify-center'}`}
                  aria-label="Notifications"
                >
                  <div className={`${isHovered ? '' : 'w-20'} flex-shrink-0 flex ${isHovered ? 'justify-start' : 'justify-center'} items-center relative`}>
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" style={{ display: isHovered ? 'none' : 'block' }}></span> {/* Indicator only when collapsed */}
                    <span className="absolute top-1 right-1 transform translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" style={{ display: !isHovered ? 'none' : 'block' }}></span> {/* Indicator adjusted for expanded */}
                  </div>
                  {isHovered && <span className="text-sm ml-2 whitespace-nowrap overflow-hidden">Notifications</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side={isMobile ? "bottom" : "top"} className="w-72 dropdown-menu-content">
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
          </SidebarMenuItem>
          <SidebarSeparator />
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className={`w-full`}
                >
                  <div className="flex items-center w-full">
                    <div className="w-20 flex-shrink-0 flex justify-center items-center"> 
                      <User className="h-4 w-4" />
                    </div>
                    {isHovered && <span className="text-sm ml-2 whitespace-nowrap overflow-hidden">Account</span>}
                    {isHovered && <ChevronDown className="ml-auto h-3.5 w-3.5" />} 
                  </div>
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
