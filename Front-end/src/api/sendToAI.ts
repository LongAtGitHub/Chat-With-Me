import type { Thread } from "@/types/thread";

// edit url here
const API_URL = 
  import.meta.env.MODE === "development"
    ? "http://localhost:8787"
    : import.meta.env.VITE_AI_API_URL || "https://backend.quanglongtr2810.workers.dev";

console.log(API_URL);

export async function sendToAI(thread: Thread): Promise<string> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(thread),
  });

  if (!res.ok) throw new Error("Failed to fetch from AI");

  return await res.text();
}
