// src/api/sendToAI.ts
import type { Thread } from "@/types/thread"; // We'll make this

// const API_URL = import.meta.env.VITE_AI_API_URL || "http://localhost:8787"
const API_URL = import.meta.env.VITE_AI_API_URL
console.log(API_URL)
export async function sendToAI(thread: Thread): Promise<string> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thread), // send whole thread
  });

  if (!res.ok) throw new Error("Failed to fetch from AI");

  return await res.text();
}
