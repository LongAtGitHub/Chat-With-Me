// src/types/thread.ts
export interface Message {
    role: "user" | "ai";
    content: string;
    timestamp: string;
  }
  
  export interface Thread {
    id: string;
    title: string;
    createdAt: string;
    messages: Message[];
  }
  