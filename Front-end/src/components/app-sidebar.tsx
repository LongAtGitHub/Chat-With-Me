import type * as React from "react"
import { MessageSquarePlus, Search } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Sample potential texts data
const potentialTexts = [
  "Create a landing page for a SaaS product",
  "Build a dashboard with charts and analytics",
  "Design a blog layout with article cards",
  "Make a contact form with validation",
  "Create an e-commerce product page",
  "Build a pricing table component",
  "Design a user profile settings page",
  "Create a todo list application",
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                <SidebarMenuButton asChild>
                  <a href="#new-chat">
                    <MessageSquarePlus />
                    <span>New Chat</span>
                  </a>
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

        {/* Potential Texts Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Suggestions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {potentialTexts.map((text, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <a href={`#suggestion-${index}`}>
                      <span className="text-sm text-muted-foreground">{text}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}