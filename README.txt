README — MERN Messenger (Frontend + Backend)

Modern real-time chat application built with MongoDB, Express, React, Next.js, Node.js, and WebSockets.
Frontend deployed on Vercel and Backend running on Render.

📦 1. Project Overview

This is a real-time messaging platform similar to WhatsApp Web.
It supports:

User registration and login

Real-time bi-directional messaging with WebSockets

Online users tracking

Persistent chat storage in MongoDB

Multiple browser sessions

Clean and responsive UI

This project is built to demonstrate MERN stack + WebSocket communication + full deployment pipeline.

🏗️ 2. Tech Stack
Frontend (Vercel)

Next.js (React Framework)

React Hooks for state management

Axios for API communication

Socket.IO Client for real-time messaging

TailwindCSS (optional styling)

Hosted on Vercel

Backend (Render)

Node.js + Express.js

Socket.IO for WebSocket-based messaging

MongoDB Atlas database

JWT Authentication

CORS configured for Vercel frontend

Hosted on Render

🎯 3. Features
✔ User Authentication

Register and Login pages

Password hashing with bcrypt

JWT token-based session

Authentication routes:

POST /api/auth/register

POST /api/auth/login

✔ Real-Time Chat

Socket.IO handles WebSocket transport

Messages are transmitted securely over WebSockets

Online users displayed dynamically

Chat updates instantly for both users

✔ Message Storage (MongoDB)

Each message stores:

{
  "senderId": "user_id",
  "receiverId": "user_id",
  "message": "Hello!",
  "timestamp": "ISO_DATE"
}


Messages are NOT encrypted, stored as plain text for simplicity.

✔ Deployed & Production-Ready

Frontend → Vercel

Backend → Render

Database → MongoDB Atlas

CORS + Environment variables setup

💾 4. System Architecture
Browser <—> Vercel (Frontend)
       <— REST API —> Render (Backend)
       <— WebSockets —> Socket.IO  
                  <—> MongoDB Atlas


REST API Handles:

Login

Registration

Fetching users

WebSockets Handle:

Send message

Receive message

Mark user online/offline

🖥️ 5. Backend README

(backend/README.md)

🚀 Backend — MERN Messenger API
📌 Overview

This is the Express.js backend for the real-time messenger app.
It provides:

User registration/login

WebSocket messaging

MongoDB communication

CORS configuration

JWT authentication

🧰 Tech Stack

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Socket.IO

bcryptjs

dotenv

Hosted on Render

📁 Project Structure
backend/
 ├── src/
 │   ├── controllers/
 │   │   └── authController.js
 │   ├── models/
 │   │   ├── User.js
 │   │   └── Message.js
 │   ├── routes/
 │   │   ├── authRoutes.js
 │   │   └── messageRoutes.js
 │   ├── socket/
 │   │   └── index.js
 │   ├── config/
 │   │   └── db.js
 │   └── index.js
 ├── package.json
 └── README.md

🔐 Authentication Flow

User registers → password hashed with bcrypt

User logs in → receives JWT token

Token stored in browser (frontend)

Socket connects using authenticated user ID

🔌 WebSocket Flow (Socket.IO)

When a user connects:

socket.emit("send-message", { senderId, receiverId, message });


Backend receives and:

Saves message to MongoDB

Forwards message to the receiver’s socket ID

Updates active users list

🔥 API Routes
Method	Endpoint	Description
POST	/api/auth/register	Create new user
POST	/api/auth/login	Login user
GET	/api/users	Fetch all users
GET	/api/messages/:id	Fetch conversation
🌐 Deployment on Render

Render automatically runs:

npm install
npm start


Backend URL example:

https://mern-messenger-backend.onrender.com

🖥️ 6. Frontend README

(frontend/README.md)

💬 MERN Messenger — Frontend
📌 Overview

A real-time chat interface built using React + Next.js, connected to a Node.js backend via REST API + WebSockets.

🧰 Tech Stack

Next.js (React)

Axios

Socket.IO Client

TailwindCSS

React Hooks

Hosted on Vercel

📁 Project Structure
frontend/
 ├── components/
 │   ├── ChatWindow.jsx
 │   ├── Sidebar.jsx
 │   ├── UserList.jsx
 ├── pages/
 │   ├── index.js   (Login)
 │   ├── register.js
 │   ├── chat.js    (Main chat UI)
 ├── utils/
 │   ├── api.js
 │   └── socket.js
 ├── styles/
 ├── package.json
 └── README.md

🔗 API Connection

Configured in:

/utils/api.js


Example:

export const API_URL = "https://mern-messenger-backend.onrender.com";

🔌 WebSocket Connection
/utils/socket.js

const socket = io(API_URL, {
  transports: ["websocket"],
});


Messages are encrypted during transport using WebSocket/TLS (wss://)
(This is NOT end-to-end encryption.)

🚀 Deployment on Vercel

Just run:

npm install
npm run build


Push to GitHub → Deploy to Vercel.

Set environment variable:

NEXT_PUBLIC_API_URL = https://mern-messenger-backend.onrender.com

📝 7. Security Notes
✔ Transport Layer Security

All messages travel through:

https:// (REST)
wss:// (WebSocket)


Both are encrypted (TLS).

✔ Data stored in MongoDB

Passwords → hashed with bcrypt

Messages → plain text (not encrypted at rest)

You can add optional E2EE later if needed.

🎉 8. Conclusion

This project demonstrates your skill in:

MERN Fullstack Development

WebSocket communication

Authentication

Real-time UI state syncing

Deployment on Vercel + Render

MongoDB Atlas integration

A great portfolio project to show employers your ability to build full production-ready real-time applications.