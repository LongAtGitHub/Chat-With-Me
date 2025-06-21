// src/api/sendToAI.ts
import type { Thread } from "@/types/thread"; // We'll make this

// const API_URL = "http://localhost:8787";

// export async function sendToAI(thread: Thread): Promise<string> {
//   const res = await fetch("http://localhost:8787/chat", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(thread), // send whole thread
//   });

//   if (!res.ok) throw new Error("Failed to fetch from AI");

//   return await res.text();
// }

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
const test = import.meta.env.VITE_TEST_VAR
console.log(apiKey)
console.log(test)
export async function sendToAI(thread: Thread): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: thread,
    }),
  });

  if (!res.ok) throw new Error("Failed to fetch from OpenRouter");

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "No response";
}
