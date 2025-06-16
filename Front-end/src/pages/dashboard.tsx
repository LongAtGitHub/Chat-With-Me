"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  role: "user" | "ai"
  content: string
  timestamp: string
}

interface Thread {
  id: string
  title: string
  createdAt: string
  messages: Message[]
}

const STORAGE_KEY = "chat-threads"

export default function Page() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeThread, setActiveThread] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load threads from localStorage on mount
  useEffect(() => {
    const loadThreads = () => {
      try {
        const savedThreads = localStorage.getItem(STORAGE_KEY)
        if (savedThreads) {
          const parsedThreads = JSON.parse(savedThreads) as Thread[]
          console.log("Loaded threads from localStorage:", parsedThreads)
          setThreads(parsedThreads)
        } else {
          console.log("No threads found in localStorage")
          setThreads([])
        }
      } catch (error) {
        console.error("Error loading threads from localStorage:", error)
        setThreads([])
      } finally {
        setIsInitialized(true)
      }
    }

    loadThreads()
  }, [])

  // Save threads to localStorage whenever threads change (but only after initialization)
  useEffect(() => {
    if (!isInitialized) return

    try {
      console.log("Saving threads to localStorage:", threads)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
    } catch (error) {
      console.error("Error saving threads to localStorage:", error)
    }
  }, [threads, isInitialized])

  // Get current thread messages
  const currentMessages = activeThread ? threads.find((thread) => thread.id === activeThread)?.messages || [] : []

  // Generate thread title from first message
  const generateThreadTitle = (firstMessage: string): string => {
    if (firstMessage.length <= 50) return firstMessage
    return firstMessage.substring(0, 47) + "..."
  }

  // Create new thread
  const handleNewThread = () => {
    setActiveThread(null)
  }

  // Select existing thread
  const handleSelectThread = (threadId: string) => {
    setActiveThread(threadId)
  }

  // Delete thread
  const handleDeleteThread = (threadId: string) => {
    setThreads((prevThreads) => {
      const updatedThreads = prevThreads.filter((thread) => thread.id !== threadId)
      console.log("Deleting thread:", threadId, "Updated threads:", updatedThreads)
      return updatedThreads
    })

    if (activeThread === threadId) {
      setActiveThread(null)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    }

    let currentThreadId = activeThread

    // If no active thread, create a new one
    if (!currentThreadId) {
      currentThreadId = `thread-${Date.now()}`
      const newThread: Thread = {
        id: currentThreadId,
        title: generateThreadTitle(content.trim()),
        createdAt: new Date().toISOString(),
        messages: [userMessage],
      }

      console.log("Creating new thread:", newThread)

      setThreads((prevThreads) => {
        const updatedThreads = [newThread, ...prevThreads]
        console.log("Updated threads after adding new thread:", updatedThreads)
        return updatedThreads
      })

      setActiveThread(currentThreadId)
    } else {
      // Add message to existing thread
      setThreads((prevThreads) => {
        const updatedThreads = prevThreads.map((thread) =>
          thread.id === currentThreadId
            ? {
                ...thread,
                messages: [...thread.messages, userMessage],
              }
            : thread,
        )
        console.log("Updated threads after adding message:", updatedThreads)
        return updatedThreads
      })
    }

    setInputValue("")
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        role: "ai",
        content: `I'll help you with "${content}". Let me create that for you! This is a mock response - in a real implementation, this would connect to an AI service to generate the actual code or content you requested.`,
        timestamp: new Date().toISOString(),
      }

      setThreads((prevThreads) => {
        const updatedThreads = prevThreads.map((thread) =>
          thread.id === currentThreadId
            ? {
                ...thread,
                messages: [...thread.messages, aiMessage],
              }
            : thread,
        )
        console.log("Updated threads after AI response:", updatedThreads)
        return updatedThreads
      })

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

  // Convert threads to the format expected by AppSidebar
  const sidebarChats = threads.map((thread) => ({
    id: thread.id,
    title: thread.title,
    lastMessage: thread.messages[thread.messages.length - 1]?.content || "",
    timestamp: new Date(thread.createdAt),
  }))

  // Debug logging
  console.log("Current state:", {
    threadsCount: threads.length,
    activeThread,
    isInitialized,
    sidebarChatsCount: sidebarChats.length,
  })

  return (
    <SidebarProvider>
      <AppSidebar
        chats={sidebarChats}
        activeChat={activeThread}
        onNewChat={handleNewThread}
        onSelectChat={handleSelectThread}
        onDeleteChat={handleDeleteThread}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">v0 Assistant</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {activeThread ? threads.find((t) => t.id === activeThread)?.title || "Thread" : "New Thread"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col h-full">
          {/* Show loading state while initializing */}
          {!isInitialized ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-muted-foreground">Loading conversations...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat messages area or welcome screen */}
              <div className="flex-1 overflow-y-auto">
                {currentMessages.length === 0 ? (
                  // Welcome screen
                  <div className="flex flex-col items-center justify-center p-8 space-y-8 h-full">
                    <div className="text-center space-y-2">
                      <h1 className="text-4xl font-semibold">How can I help you today?</h1>
                      <p className="text-muted-foreground">Choose a suggestion below or type your own message</p>
                      {threads.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          You have {threads.length} saved conversation{threads.length !== 1 ? "s" : ""}
                        </p>
                      )}
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
                    {currentMessages.map((message, index) => (
                      <div key={`${activeThread}-${index}`} className="flex gap-4">
                        <Avatar className="w-8 h-8 mt-1">
                          <AvatarFallback>{message.role === "user" ? "U" : "AI"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{message.role === "user" ? "You" : "v0"}</span>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ""}
                            </span>
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
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
