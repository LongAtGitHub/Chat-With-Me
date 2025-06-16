"use client"

import type * as React from "react"
import { MessageSquarePlus, Search, MessageSquare, Trash2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

interface Chat {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  chats: Chat[]
  activeChat: string | null
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
}

export function AppSidebar({ chats, activeChat, onNewChat, onSelectChat, onDeleteChat, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>{/* Empty header or add logo if needed */}</SidebarHeader>
      <SidebarContent>
        {/* Menu Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onNewChat}>
                  <MessageSquarePlus />
                  <span>New Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#search">
                    <Search />
                    <span>Search</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chat History Section */}
        {chats.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
            <SidebarGroupContent>
            <SidebarMenu>
  {chats.map((chat) => (
    <SidebarMenuItem key={chat.id} className="mb-2 last:mb-0"> {/* 👈 margin bottom here */}
      <SidebarMenuButton
        onClick={() => onSelectChat(chat.id)}
        isActive={activeChat === chat.id}
        className="justify-start"
      >
        <MessageSquare className="w-4 h-4" />
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="text-sm font-medium truncate w-full">{chat.title}</span>
          <span className="text-xs text-muted-foreground truncate w-full">{chat.lastMessage}</span>
        </div>
      </SidebarMenuButton>
      <SidebarMenuAction
        onClick={(e) => {
          e.stopPropagation()
          onDeleteChat(chat.id)
        }}
        className="opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </SidebarMenuAction>
    </SidebarMenuItem>
  ))}
</SidebarMenu>

            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
