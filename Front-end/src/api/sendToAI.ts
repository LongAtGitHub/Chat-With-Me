// src/api/sendToAI.ts
import type { Thread } from "@/types/thread"; // We'll make this

const API_URL = "http://localhost:8787";

export async function sendToAI(thread: Thread): Promise<string> {
  const userMessages = thread.messages.map((msg) => ({
    role: msg.role === "ai" ? "assistant" : "user",
    content: msg.content,
  }));

  const payload = [
    // {
    //   role: "system",
    //   content:
    //     "You are Joker, leader of the Phantom Thieves. Stay in character. You help John. Respond accordingly.",
    // },
    ...userMessages,
  ];

  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: payload }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch response from AI");
  }

  return await res.text();
}
