"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  MessageSquare,
  Users,
  X,
  Send,
  Paperclip,
  ChevronLeft,
  AtSign,
  FileText,
  Activity,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

export function SocialSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const isMobile = useMobile()

  // Sample family members data
  const familyMembers = [
    {
      id: "1",
      name: "John Doe",
      status: "online",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
      unread: 0,
    },
    {
      id: "2",
      name: "Jane Doe",
      status: "online",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
      unread: 3,
    },
    {
      id: "3",
      name: "Emily Doe",
      status: "offline",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "ED",
      unread: 0,
    },
    {
      id: "4",
      name: "Michael Doe",
      status: "away",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MD",
      unread: 1,
    },
  ]

  // Sample messages data
  const messages = [
    {
      id: "1",
      sender: { id: "2", name: "Jane Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      content: "Have you reviewed the new investment proposal?",
      timestamp: "10:30 AM",
      isCurrentUser: false,
    },
    {
      id: "2",
      sender: { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      content: "Yes, I think it looks promising. The projected returns are better than expected.",
      timestamp: "10:32 AM",
      isCurrentUser: true,
    },
    {
      id: "3",
      sender: { id: "2", name: "Jane Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      content: "Great! Should we discuss it during the family meeting tomorrow?",
      timestamp: "10:35 AM",
      isCurrentUser: false,
    },
    {
      id: "4",
      sender: { id: "1", name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      content: "Definitely. I'll add it to the agenda.",
      timestamp: "10:36 AM",
      isCurrentUser: true,
    },
    {
      id: "5",
      sender: { id: "2", name: "Jane Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      content: "Perfect. Also, did you see the quarterly report from our property manager?",
      timestamp: "10:40 AM",
      isCurrentUser: false,
    },
  ]

  // Sample mentions data
  const mentions = [
    {
      id: "1",
      from: { name: "Jane Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      content: "mentioned you in a comment on Investment Strategy",
      timestamp: "2 hours ago",
      location: "Documents",
      isRead: false,
    },
    {
      id: "2",
      from: { name: "Michael Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "MC" },
      content: "mentioned you in a task about Property Acquisition",
      timestamp: "Yesterday",
      location: "Tasks",
      isRead: true,
    },
    {
      id: "3",
      from: { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
      content: "tagged you in a document about Tax Planning",
      timestamp: "2 days ago",
      location: "Documents",
      isRead: true,
    },
  ]

  // Sample updates data
  const updates = [
    {
      id: "1",
      type: "document",
      title: "Investment Strategy Updated",
      description: "The Q2 investment strategy document has been updated",
      timestamp: "1 hour ago",
      icon: FileText,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      id: "2",
      type: "activity",
      title: "Portfolio Performance",
      description: "Your portfolio has increased by 2.3% this month",
      timestamp: "3 hours ago",
      icon: Activity,
      iconColor: "text-green-500",
      iconBg: "bg-green-500/10",
    },
    {
      id: "3",
      type: "event",
      title: "Family Meeting",
      description: "Scheduled for tomorrow at 10:00 AM",
      timestamp: "Yesterday",
      icon: Calendar,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
    },
    {
      id: "4",
      type: "approval",
      title: "Document Approval",
      description: "Tax planning document requires your approval",
      timestamp: "Yesterday",
      icon: CheckCircle2,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
    },
    {
      id: "5",
      type: "alert",
      title: "Credit Facility Alert",
      description: "Upcoming payment due in 5 days",
      timestamp: "2 days ago",
      icon: AlertCircle,
      iconColor: "text-red-500",
      iconBg: "bg-red-500/10",
    },
  ]

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message to the server
      setMessageInput("")
    }
  }

  // Calculate total unread notifications
  const totalUnread = familyMembers.reduce((sum, member) => sum + member.unread, 0)

  // Close sidebar on mobile when navigating to a new page
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    }
  }, [isMobile])

  return (
    <div
      className={cn("h-full border-l transition-all duration-300 ease-in-out flex-shrink-0", isOpen ? "w-80" : "w-14")}
    >
      {/* Toggle button */}
      <div className="h-full flex flex-col">
        <div className="border-b p-3 flex items-center justify-between">
          {isOpen ? (
            <>
              <h2 className="text-sm font-medium">Family Connect</h2>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 mx-auto text-foreground"
              onClick={() => setIsOpen(true)}
            >
              <MessageSquare className="h-4 w-4" />
              {totalUnread > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {totalUnread}
                </Badge>
              )}
            </Button>
          )}
        </div>

        {isOpen ? (
          activeChat ? (
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-2 border-b p-3">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setActiveChat(null)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={familyMembers.find((m) => m.id === activeChat)?.avatar}
                    alt={familyMembers.find((m) => m.id === activeChat)?.name}
                  />
                  <AvatarFallback className="text-xs">
                    {familyMembers.find((m) => m.id === activeChat)?.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {familyMembers.find((m) => m.id === activeChat)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {familyMembers.find((m) => m.id === activeChat)?.status === "online"
                      ? "Online"
                      : familyMembers.find((m) => m.id === activeChat)?.status === "away"
                        ? "Away"
                        : "Offline"}
                  </p>
                </div>
              </div>

              <ScrollArea className="flex-1 p-3">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex gap-2", message.isCurrentUser ? "justify-end" : "justify-start")}
                    >
                      {!message.isCurrentUser && (
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                          <AvatarFallback className="text-[10px]">{message.sender.initials}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "rounded-lg px-3 py-2 text-sm max-w-[80%]",
                          message.isCurrentUser ? "bg-primary/10 text-foreground" : "bg-muted text-foreground",
                        )}
                      >
                        <p>{message.content}</p>
                        <p className="mt-1 text-right text-[10px] text-muted-foreground">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="border-t p-3">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    className="h-8 text-sm"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="chat" className="flex-1">
              <TabsList className="grid w-full grid-cols-3 h-10">
                <TabsTrigger value="chat" className="text-xs">
                  <MessageSquare className="mr-1 h-3.5 w-3.5" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="mentions" className="text-xs">
                  <AtSign className="mr-1 h-3.5 w-3.5" />
                  Mentions
                </TabsTrigger>
                <TabsTrigger value="updates" className="text-xs">
                  <Bell className="mr-1 h-3.5 w-3.5" />
                  Updates
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 p-0">
                <div className="p-3 border-b">
                  <h3 className="text-xs font-medium mb-2">Family Members</h3>
                  <div className="space-y-2">
                    {familyMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 cursor-pointer"
                        onClick={() => setActiveChat(member.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                            </Avatar>
                            <span
                              className={cn(
                                "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background",
                                member.status === "online"
                                  ? "bg-green-500"
                                  : member.status === "away"
                                    ? "bg-amber-500"
                                    : "bg-muted",
                              )}
                            />
                          </div>
                          <span className="text-sm text-foreground">{member.name}</span>
                        </div>
                        {member.unread > 0 && (
                          <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                            {member.unread}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="text-xs font-medium mb-2">Group Chats</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar className="h-7 w-7 bg-primary/10">
                            <Users className="h-4 w-4 text-primary" />
                          </Avatar>
                        </div>
                        <span className="text-sm text-foreground">Family Group</span>
                      </div>
                      <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">5</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar className="h-7 w-7 bg-blue-500/10">
                            <Users className="h-4 w-4 text-blue-500" />
                          </Avatar>
                        </div>
                        <span className="text-sm text-foreground">Investment Committee</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mentions" className="p-0 flex-1">
                <ScrollArea className="h-full">
                  <div className="p-3">
                    <h3 className="text-xs font-medium mb-2">Recent Mentions</h3>
                    <div className="space-y-3">
                      {mentions.map((mention) => (
                        <div
                          key={mention.id}
                          className={cn("p-3 rounded-md border", !mention.isRead ? "bg-muted/30" : "")}
                        >
                          <div className="flex items-start gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={mention.from.avatar} alt={mention.from.name} />
                              <AvatarFallback className="text-xs">{mention.from.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm text-foreground">
                                <span className="font-medium">{mention.from.name}</span> {mention.content}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-muted-foreground">{mention.location}</span>
                                <span className="text-xs text-muted-foreground">{mention.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="updates" className="p-0 flex-1">
                <ScrollArea className="h-full">
                  <div className="p-3">
                    <h3 className="text-xs font-medium mb-2">Recent Updates</h3>
                    <div className="space-y-3">
                      {updates.map((update) => (
                        <div key={update.id} className="p-3 rounded-md border">
                          <div className="flex gap-3">
                            <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", update.iconBg)}>
                              <update.icon className={cn("h-4 w-4", update.iconColor)} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{update.title}</p>
                              <p className="text-xs text-muted-foreground">{update.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{update.timestamp}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )
        ) : (
          <div className="flex flex-col items-center gap-6 pt-6">
            <Button variant="ghost" size="icon" className="relative text-foreground" onClick={() => setIsOpen(true)}>
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                5
              </Badge>
            </Button>

            <Button variant="ghost" size="icon" className="text-foreground" onClick={() => setIsOpen(true)}>
              <AtSign className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="text-foreground" onClick={() => setIsOpen(true)}>
              <Users className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

