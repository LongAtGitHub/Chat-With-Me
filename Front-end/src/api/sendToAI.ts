// src/api/sendToAI.ts
import type { Thread } from "@/types/thread"; // We'll make this

const API_URL = "http://localhost:8787";

export async function sendToAI(thread: Thread): Promise<string> {
  const res = await fetch("http://localhost:8787/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thread), // send whole thread
  });

  if (!res.ok) throw new Error("Failed to fetch from AI");

  return await res.text();
}
