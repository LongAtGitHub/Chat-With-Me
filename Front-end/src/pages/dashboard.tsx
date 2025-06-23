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
import { sendToAI } from "@/api/sendToAI"
import type { Thread, Message } from "@/types/thread"
import ReactMarkdown from "react-markdown"

const STORAGE_KEY = "chat-threads"

export default function Page() {
    // ===================
    // # State
    // ===================
    const [threads, setThreads] = useState<Thread[]>([])
    const [activeThread, setActiveThread] = useState<string | null>(null)
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)

    // =========================================
    // # Effects: Load threads from localStorage
    // =========================================
    useEffect(() => {
        const loadThreads = () => {
            try {
                const saved = localStorage.getItem(STORAGE_KEY)
                if (saved) {
                    setThreads(JSON.parse(saved))
                } else {
                    setThreads([])
                }
            } catch (e) {
                console.error("Error loading threads", e)
                setThreads([])
            } finally {
                setIsInitialized(true)
            }
        }
        loadThreads()
    }, [])

    // =========================================
    // # Effects: Save threads to localStorage
    // =========================================
    useEffect(() => {
        if (!isInitialized) return
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
        } catch (e) {
            console.error("Error saving threads", e)
        }
    }, [threads, isInitialized])

    // =========================================
    // # Utils
    // =========================================
    const generateThreadTitle = (text: string) => text.length <= 50 ? text : text.slice(0, 47) + "..."

    const currentMessages = activeThread
        ? threads.find((t) => t.id === activeThread)?.messages || []
        : []

    // =========================================
    // # Handlers: Thread Management
    // =========================================
    const handleNewThread = () => setActiveThread(null)

    const handleSelectThread = (id: string) => setActiveThread(id)

    const handleDeleteThread = (id: string) => {
        setThreads((prev) => prev.filter((t) => t.id !== id))
        if (activeThread === id) setActiveThread(null)
    }

    // =========================================
    // # Handler: Send to AI and save AI response
    // =========================================
    const handleAiSendPrompt = async (thread: Thread) => {
        try {
            const aiResponse = await sendToAI(thread)
            const aiMessage: Message = {
                role: "ai",
                content: aiResponse,
                timestamp: new Date().toISOString(),
            }
            setThreads((prev) =>
                prev.map((t) =>
                    t.id === thread.id ? { ...t, messages: [...t.messages, aiMessage] } : t
                )
            )
        } catch (e) {
            console.error("AI call failed:", e)
            alert("The chat bot is currently offline")
            const fallbackMessage: Message = {
                role: "ai",
                content: "⚠️ I'm currently unable to respond. The server may be down or unreachable.",
                timestamp: new Date().toISOString(),
            }
            setThreads((prev) =>
                prev.map((t) =>
                    t.id === thread.id ? { ...t, messages: [...t.messages, fallbackMessage] } : t
                )
            )
        }
    }   

    // =========================================
    // # Handler: On send message
    // =========================================
    const handleSendMessage = async (content: string) => {
        if (!content.trim()) {
            console.log("content is not trimmed")
            return
        }
        const userMessage: Message = {
            role: "user",
            content: content.trim(),
            timestamp: new Date().toISOString(),
        }

        let threadToUpdate: Thread
        if (!activeThread) {
            const id = `thread-${Date.now()}`
            threadToUpdate = {
                id,
                title: generateThreadTitle(content),
                createdAt: new Date().toISOString(),
                messages: [userMessage],
            }
            setThreads((prev) => [threadToUpdate, ...prev])
            setActiveThread(id)
        } else {
            threadToUpdate =
                threads.find((t) => t.id === activeThread) ?? {
                    id: activeThread,
                    title: "Untitled",
                    createdAt: new Date().toISOString(),
                    messages: [],
                }

            threadToUpdate = {
                ...threadToUpdate,
                messages: [...threadToUpdate.messages, userMessage],
            }

            setThreads((prev) =>
                prev.map((t) =>
                    t.id === threadToUpdate.id ? threadToUpdate : t
                )
            )
        }

        setInputValue("")
        setIsLoading(true)
        await handleAiSendPrompt(threadToUpdate)
        setIsLoading(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleSendMessage(inputValue)
    }

    const handleCardClick = (prompt: string) => {
        handleSendMessage(prompt)
    }

    // =========================================
    // # Sidebar Formatting
    // =========================================
    const sidebarChats = threads.map((t) => ({
        id: t.id,
        title: t.title,
        lastMessage: t.messages[t.messages.length - 1]?.content || "",
        timestamp: new Date(t.createdAt),
    }))

    // =========================================
    // # UI
    // =========================================
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
                {/* Header */}
                <header className="flex h-16 items-center gap-2 border-b px-4">
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
                                    {activeThread
                                        ? threads.find((t) => t.id === activeThread)?.title || "Thread"
                                        : "New Thread"}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                {/* Main */}
                <div className="flex flex-1 flex-col h-full">
                    {!isInitialized ? (
                        // Loading State
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center space-y-2">
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-muted-foreground">Loading conversations...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto">
                                {currentMessages.length === 0 ? (
                                    // Welcome Prompt
                                    <div className="flex flex-col items-center justify-center p-8 space-y-8 h-full">
                                        <div className="text-center space-y-2">
                                            <h1 className="text-4xl font-semibold">How can I help you today?</h1>
                                            <p className="text-muted-foreground">
                                                Choose a suggestion below or type your own message
                                            </p>
                                            {threads.length > 0 && (
                                                <p className="text-sm text-muted-foreground">
                                                    You have {threads.length} saved conversation{threads.length !== 1 ? "s" : ""}
                                                </p>
                                            )}
                                        </div>

                                        {/* Prompt Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                                            {[
                                                {
                                                    title: "Create a landing page",
                                                    prompt: "Create a landing page for a SaaS product with hero section and features",
                                                    desc: "Build a modern landing page for a SaaS product with hero section and features",
                                                },
                                                {
                                                    title: "Build a dashboard",
                                                    prompt: "Build an analytics dashboard with charts, metrics, and data visualization",
                                                    desc: "Create an analytics dashboard with charts, metrics, and data visualization",
                                                },
                                                {
                                                    title: "Design a form",
                                                    prompt: "Design a contact form with validation and modern styling",
                                                    desc: "Make a contact form with validation and modern styling",
                                                },
                                                {
                                                    title: "E-commerce page",
                                                    prompt: "Build a product page with image gallery, reviews, and purchase options",
                                                    desc: "Build a product page with image gallery, reviews, and purchase options",
                                                },
                                            ].map((card, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleCardClick(card.prompt)}
                                                    className="p-4 text-left border rounded-lg hover:bg-muted/50 transition-colors group"
                                                >
                                                    <div className="space-y-2">
                                                        <h3 className="font-medium group-hover:text-primary">{card.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{card.desc}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    // Chat Messages
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
                                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

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
                                                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Input Field */}
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
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
