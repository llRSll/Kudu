"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Send, Image, FileText, Smile, MoreHorizontal, Search, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Sample data for chat conversations
const conversations = [
  {
    id: 1,
    name: "Investment Strategy Team",
    lastMessage: "Let's review the Q1 performance next week",
    timestamp: "2025-03-18T14:30:00",
    unread: 3,
    members: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
      { name: "Michael Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "MC" },
    ],
    isActive: true,
  },
  {
    id: 2,
    name: "Real Estate Acquisitions",
    lastMessage: "The property inspection is scheduled for Friday",
    timestamp: "2025-03-18T11:15:00",
    unread: 0,
    members: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      { name: "Sarah Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "SJ" },
    ],
    isActive: false,
  },
  {
    id: 3,
    name: "Tax Planning Group",
    lastMessage: "I've uploaded the latest tax projections",
    timestamp: "2025-03-17T16:45:00",
    unread: 1,
    members: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      { name: "Alex Rodriguez", avatar: "/placeholder.svg?height=32&width=32", initials: "AR" },
    ],
    isActive: false,
  },
  {
    id: 4,
    name: "Client: Doe Family",
    lastMessage: "Thank you for the portfolio update",
    timestamp: "2025-03-16T10:30:00",
    unread: 0,
    members: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      { name: "Client: Doe Family", avatar: "/placeholder.svg?height=32&width=32", initials: "DF" },
    ],
    isActive: false,
  },
]

// Sample messages for the active conversation
const messages = [
  {
    id: 1,
    sender: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    content: "I've reviewed the Q1 investment performance and have some thoughts to share.",
    timestamp: "2025-03-18T10:15:00",
    isCurrentUser: true,
  },
  {
    id: 2,
    sender: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SJ",
    },
    content: "Great, I'd like to hear your analysis. The tech sector performed better than expected.",
    timestamp: "2025-03-18T10:18:00",
    isCurrentUser: false,
  },
  {
    id: 3,
    sender: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MC",
    },
    content:
      "I've prepared a detailed breakdown of each sector's performance. Should I share it here or in the workspace?",
    timestamp: "2025-03-18T10:22:00",
    isCurrentUser: false,
  },
  {
    id: 4,
    sender: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    content:
      "Let's add it to the workspace so we can reference it during our meeting. But you can share a summary here.",
    timestamp: "2025-03-18T10:25:00",
    isCurrentUser: true,
  },
  {
    id: 5,
    sender: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SJ",
    },
    content: "I agree. Also, I think we should discuss reallocating some assets based on the Q1 performance.",
    timestamp: "2025-03-18T10:30:00",
    isCurrentUser: false,
    attachment: {
      type: "document",
      name: "Q1_Performance_Summary.pdf",
      size: "1.2 MB",
    },
  },
  {
    id: 6,
    sender: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MC",
    },
    content:
      "Here's a quick summary: Tech +12.4%, Healthcare +8.7%, Energy -3.2%, Financials +5.1%. Overall portfolio performance is +7.8% vs benchmark +6.2%.",
    timestamp: "2025-03-18T10:35:00",
    isCurrentUser: false,
  },
  {
    id: 7,
    sender: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    content: "That's excellent performance. Let's schedule a meeting to discuss reallocation strategy.",
    timestamp: "2025-03-18T10:40:00",
    isCurrentUser: true,
  },
  {
    id: 8,
    sender: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "SJ",
    },
    content: "I'm available next Tuesday at 10 AM. Does that work for everyone?",
    timestamp: "2025-03-18T10:45:00",
    isCurrentUser: false,
  },
  {
    id: 9,
    sender: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "MC",
    },
    content: "Tuesday works for me.",
    timestamp: "2025-03-18T10:48:00",
    isCurrentUser: false,
  },
  {
    id: 10,
    sender: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "JD",
    },
    content: "Let's review the Q1 performance next week. I'll send a calendar invite.",
    timestamp: "2025-03-18T14:30:00",
    isCurrentUser: true,
  },
]

export function TeamChat() {
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [messageInput, setMessageInput] = useState("")

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message to the server
      setMessageInput("")
    }
  }

  return (
    <div className="flex h-[calc(100vh-16rem)]">
      {/* Conversation List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input type="search" placeholder="Search conversations..." className="w-full pl-8 h-8 text-xs" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 hover:bg-muted/20 cursor-pointer ${
                activeConversation.id === conversation.id ? "bg-muted/30" : ""
              }`}
              onClick={() => setActiveConversation(conversation)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={conversation.members[0].avatar} alt={conversation.members[0].name} />
                      <AvatarFallback>{conversation.members[0].initials}</AvatarFallback>
                    </Avatar>
                    {conversation.members.length > 1 && (
                      <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground">
                        +{conversation.members.length - 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm flex items-center">
                      {conversation.name}
                      {conversation.unread > 0 && (
                        <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                          {conversation.unread}
                        </Badge>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate w-40">{conversation.lastMessage}</p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {formatDate(conversation.timestamp).split(",")[0]}
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="p-3 border-t">
          <Button size="sm" className="w-full h-8 text-xs">
            <Users className="mr-2 h-3.5 w-3.5" />
            New Conversation
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activeConversation.members[0].avatar} alt={activeConversation.members[0].name} />
              <AvatarFallback>{activeConversation.members[0].initials}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">{activeConversation.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {activeConversation.members.length} members
                </span>
                <span className="mx-2">•</span>
                <span className={activeConversation.isActive ? "text-green-500" : "text-muted-foreground"}>
                  {activeConversation.isActive
                    ? "Active now"
                    : "Last active " + formatDate(activeConversation.timestamp)}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[70%] ${message.isCurrentUser ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8 mt-0.5 flex-shrink-0">
                    <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                    <AvatarFallback>{message.sender.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${message.isCurrentUser ? "text-right" : ""}`}>
                        {message.sender.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{formatMessageTime(message.timestamp)}</span>
                    </div>
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        message.isCurrentUser ? "bg-primary/10 text-foreground" : "bg-muted/50 text-foreground"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.attachment && (
                      <div className="mt-2 flex items-center gap-2 rounded-md border p-2 bg-background">
                        <FileText className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs font-medium">{message.attachment.name}</p>
                          <p className="text-[10px] text-muted-foreground">{message.attachment.size}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-3 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Image className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <FileText className="h-4 w-4" />
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
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Smile className="h-4 w-4" />
            </Button>
            <Button size="icon" className="h-8 w-8" onClick={handleSendMessage} disabled={!messageInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

