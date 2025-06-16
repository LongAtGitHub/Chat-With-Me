"use client"

import type React from "react"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'll help you with "${content}". Let me create that for you! This is a mock response - in a real implementation, this would connect to an AI service to generate the actual code or content you requested.`,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  const handleCardClick = (prompt: string) => {
    handleSendMessage(prompt)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chat</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col h-full">
          {/* Chat messages area or welcome screen */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              // Welcome screen
              <div className="flex flex-col items-center justify-center p-8 space-y-8 h-full">
                <div className="text-center space-y-2">
                  <h1 className="text-4xl font-semibold">How can I help you today?</h1>
                  <p className="text-muted-foreground">Choose a suggestion below or type your own message</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                  <button
                    onClick={() =>
                      handleCardClick("Create a landing page for a SaaS product with hero section and features")
                    }
                    className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="space-y-2">
                      <h3 className="font-medium group-hover:text-primary">Create a landing page</h3>
                      <p className="text-sm text-muted-foreground">
                        Build a modern landing page for a SaaS product with hero section and features
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      handleCardClick("Build an analytics dashboard with charts, metrics, and data visualization")
                    }
                    className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="space-y-2">
                      <h3 className="font-medium group-hover:text-primary">Build a dashboard</h3>
                      <p className="text-sm text-muted-foreground">
                        Create an analytics dashboard with charts, metrics, and data visualization
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleCardClick("Design a contact form with validation and modern styling")}
                    className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="space-y-2">
                      <h3 className="font-medium group-hover:text-primary">Design a form</h3>
                      <p className="text-sm text-muted-foreground">
                        Make a contact form with validation and modern styling
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      handleCardClick("Build a product page with image gallery, reviews, and purchase options")
                    }
                    className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="space-y-2">
                      <h3 className="font-medium group-hover:text-primary">E-commerce page</h3>
                      <p className="text-sm text-muted-foreground">
                        Build a product page with image gallery, reviews, and purchase options
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              // Chat messages
              <div className="max-w-4xl mx-auto p-4 space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-4">
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback>{message.role === "user" ? "U" : "AI"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{message.role === "user" ? "You" : "v0"}</span>
                        <span className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-4">
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">v0</span>
                        <span className="text-xs text-muted-foreground">typing...</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input section at bottom */}
          <div className="border-t bg-background p-4">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Message v0..."
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </form>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                v0 can make mistakes. Consider checking important information.
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
