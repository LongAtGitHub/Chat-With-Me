// src/api/sendToAI.ts

const API_URL = "http://localhost:8787";

export async function sendToAI(messages: { role: string; content: string }[]) {
  console.log("APi url is ", API_URL)
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch response from AI");
  }

  return await res.text(); // your backend returns plain text
}
