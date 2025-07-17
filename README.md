# 🧩 WebSocket Frontend Chat App

This is the **frontend** part of a mini real-time chat application built with **React** and **`Socket.IO`**. It connects to a backend server via WebSocket and allows users to exchange messages, see who is typing, and track the number of active users in real time.

👉 The **backend** part is hosted separately and handles all WebSocket communication: [Chat-via-Websocket-back](https://github.com/KaninGleb/Chat-via-Websocket-back)

## 🚀 Features

* Real-time messaging via `socket.io-client`
* Typing indicators
* Live user count
* Automatic reconnection
* Client name and timezone detection
* Redux-powered state management

## 🛠️ Tech Stack

* **React 19** + **Redux Toolkit**
* **TypeScript**
* **CSS Modules**
* **Vite** (with SWC for fast builds)
* **Socket.IO**
* **Vitest** (for testing)
* **ESLint / Prettier** (for code quality)

## 📦 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/chat-via-websocket-front.git
cd chat-via-websocket-front

# Install dependencies
pnpm install

# Run in development mode
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

> ⚠️ **Important:** The app requires a running backend WebSocket server. The default backend is [https://chat-on-websocket-back.onrender.com](https://chat-on-websocket-back.onrender.com), but you can host your own.

## 📁 Project Structure

```
├── app/              # App root logic (entry point, main component, store)
├── assets/           # Static assets (e.g., images, fonts, icons)
├── common/           # Reusable code shared across features
│   ├── hooks/        # Custom React hooks
│   ├── types/        # Global TypeScript types and interfaces
│   └── utils/        # Utility functions and helpers
├── features/
│   └── chat/              # Chat feature module (logic, UI, API)
│       ├── api/           # WebSocket API setup and integration
│       ├── components/    # Presentational and container components
│       └── model/         # Chat-related Redux slices and reducers

```

## 📡 WebSocket Events

* `init-messages-published` — initial message history
* `new-message-sent` — new incoming message
* `user-typing`, `user-stopped-typing` — typing indicators
* `users-count-updated` — number of connected users
* `connect`, `disconnect` — connection status events

## ⚖️ License

MIT — free to use, modify, and distribute.
