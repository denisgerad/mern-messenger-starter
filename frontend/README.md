# MERN Messenger — Frontend

Summary
- Single-page React application (Vite) that provides the UI for the MERN Messenger project.
- Deployed to Vercel. Communicates with the backend over HTTPS and secure WebSocket (wss).

Tech stack
- React (Vite) — client SPA
- Axios — HTTP API requests
- socket.io-client — realtime messaging (WebSocket)
- CSS — simple styles

Main components & responsibilities
- `src/pages/Login.jsx` — Login / Register UI; calls `/api/auth` endpoints and stores JWT + user in `localStorage`.
- `src/context/AuthContext.jsx` — Auth state provider; exposes `login`, `register`, `logout` and keeps `token` in `localStorage`.
- `src/pages/Chat.jsx` — Chat page: connects to the socket server, tracks `online` users and current conversation.
- `src/components/ChatList.jsx` — Shows online users and conversation list (demo fallback).
- `src/components/ChatWindow.jsx` — Conversation view, loads messages and provides message send/delete functionality.
- `src/api/api.js` — Axios instance configured with `VITE_API_BASE` and JWT header injection.

Data & security notes
- User authentication uses JWT (stored in `localStorage`) and requests include `Authorization: Bearer <token>`.
- Messages are stored in MongoDB on the backend and are not encrypted at rest in this starter project.
- WebSocket transport uses `socket.io` — when deployed over HTTPS the connection uses `wss`.

Environment variables (Vercel / local)
- `VITE_API_BASE` — e.g. `https://your-backend.onrender.com/api` (frontend HTTP API base)
- `VITE_SOCKET_URL` — e.g. `https://your-backend.onrender.com` (socket.io server URL)

Run locally
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open `http://localhost:5173` (or the port displayed by Vite)

Build & deploy (Vercel)
- Build command: `npm run build`
- Output directory: `dist` (Vite)
- Set the `VITE_API_BASE` and `VITE_SOCKET_URL` environment variables in the Vercel project settings.

Notes for portfolio
- Mention that this is a starter MERN messenger demonstrating JWT auth, socket-based realtime messaging, and deployment to Vercel/Render. Include screenshots of the app and a short demo link.
