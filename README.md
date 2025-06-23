# 🧠 Chat With Me (this is the front-end section)

**Chat With Me** is a minimalist, fully customizable AI chat app starter — ideal for anyone looking to fork and reuse a clean, modern interface powered by an AI backend.

---

## 🎯 Goal

To provide a **chat app template** that’s:
- Easy to **fork and customize**
- Flexible for **any use case**: customer support, writing assistant, dev helper, etc.
- Built on **modern tools** like `shadcn/ui`, `Cloudflare Workers`, and **OpenRouter AI APIs**

---

## 🧪 Usage

- **Backend**: swap context logic or switch to better models from OpenRouter for improved responses.
- **Frontend**: styled with `shadcn/ui` (built on Tailwind CSS), highly customizable via [v0.dev](https://v0.dev/) or by hand.

---

## 🛠️ Stack

| Part       | Tech                                  |
|------------|----------------------------------------|
| Frontend   | Vite + React + ShadCN + TypeScript     |
| Backend    | Cloudflare Worker (JavaScript)         |
| AI API     | OpenRouter (model-agnostic, easy swap) |
| Storage    | LocalStorage for threads               |

---

## ✅ Features Completed

- [x] Threaded chat with local persistence
- [x] Markdown rendering (with code support)
- [x] Typing animation for AI responses
- [x] Sidebar for managing threads
- [x] Prompt starter cards (one-click suggestions)
- [x] Simple backend POST request to call LLM via OpenRouter

---