"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WorkspaceList } from "@/components/collaboration/workspace-list"
import { SharedDocuments } from "@/components/collaboration/shared-documents"
import { TeamChat } from "@/components/collaboration/team-chat"
import { ClientPortal } from "@/components/collaboration/client-portal"

export function CollaborationTabs() {
  const [activeTab, setActiveTab] = useState("workspaces")

  return (
    <Card>
      <CardContent className="p-0">
        <Tabs
          defaultValue="workspaces"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full tabs-content-fix"
        >
          <div className="border-b px-4">
            <TabsList className="h-12 bg-transparent">
              <TabsTrigger value="workspaces" className="text-sm data-[state=active]:bg-transparent">
                Workspaces
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-sm data-[state=active]:bg-transparent">
                Shared Documents
              </TabsTrigger>
              <TabsTrigger value="chat" className="text-sm data-[state=active]:bg-transparent">
                Team Chat
              </TabsTrigger>
              <TabsTrigger value="clients" className="text-sm data-[state=active]:bg-transparent">
                Client Portal
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="workspaces" className="m-0 p-0">
            <WorkspaceList />
          </TabsContent>

          <TabsContent value="documents" className="m-0 p-0">
            <SharedDocuments />
          </TabsContent>

          <TabsContent value="chat" className="m-0 p-0">
            <TeamChat />
          </TabsContent>

          <TabsContent value="clients" className="m-0 p-0">
            <ClientPortal />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

