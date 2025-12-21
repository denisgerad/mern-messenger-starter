# MERN Messenger – Real-Time Chat Application

A **real-time messaging application** built with the MERN stack
(MongoDB, Express.js, React, Node.js), focusing on **secure authentication,
real-time communication, and responsive UI design**.

The project explores how modern web applications handle **live messaging,
user presence, and session-based authentication**, with a UI inspired by
WhatsApp’s dark theme.

---

## ✨ Core Features

### Real-Time Messaging
- Bi-directional messaging using **Socket.IO**
- Live online/offline user presence
- Message timestamps and conversation management
- Real-time updates without page refresh

### Authentication & Security
- User registration and login
- **JWT-based authentication**
- Password hashing with **bcrypt**
- Secure API access via auth middleware
- Designed with **session security and CORS handling** in mind

### User Experience
- Multiple one-to-one conversations
- Delete conversations
- Online status indicators
- Responsive layout for desktop and mobile

---

## 🎨 UI & Interaction Design

- WhatsApp-inspired **dark theme**
- Initials-based avatars with 10 distinct colors
- Clear sent/received message separation
- Chat header showing recipient info and online status
- Smooth message animations
- Clean, distraction-free message input

---

## 🚀 Tech Stack

### Frontend
- **React** – UI development
- **Vite** – Fast build tooling
- **Socket.IO Client** – Real-time updates
- **React Router** – Navigation
- **Axios** – API communication

### Backend
- **Node.js** – Runtime
- **Express.js** – REST API framework
- **MongoDB** – Database
- **Mongoose** – ODM
- **Socket.IO** – WebSocket server
- **JWT** – Authentication tokens
- **bcrypt** – Password hashing

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

---

### Clone the Repository
```bash
git clone https://github.com/denisgerad/mern-messenger-starter.git
cd mern-messenger-starter

Backend Setup
cd backend
npm install

Create a .env file:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

Start backend:
npm run dev
Backend runs at: http://localhost:5000

Frontend Setup
cd frontend
npm install

Optional .env:
VITE_SOCKET_URL=http://localhost:5000

Start frontend:
npm run dev
Frontend runs at: http://localhost:5173

🎯 Usage Flow
Register a new account
Log in with credentials
View online users in the sidebar
Start a real-time conversation
Send and receive messages instantly
Delete conversations as needed

📁 Project Structure

mern-messenger-starter/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middlewares/
│       ├── socket.js
│       ├── config.js
│       └── index.js
│
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
└── README.md

🔐 API Endpoints
Authentication
POST /auth/register – Register user
POST /auth/login – Login user

Messages
GET /messages/:conversationId – Fetch messages
DELETE /messages/conversation/:conversationId – Delete conversation

Socket Events
user:online
send:message
receive:message
online:users
conversation:deleted

🧠 Design Notes
This project focuses on:
Real-time state synchronization
Secure authentication flows
Clean separation of frontend and backend concerns
Practical Socket.IO usage in a MERN environment
It is intended as a full-stack learning and portfolio project, not a
production messaging platform.

🤝 Contributing
Contributions are welcome via pull requests or issues.

📄 License
MIT License

👤 Author
Dennis Gerard
GitHub: https://github.com/denisgerad

🙏 Acknowledgments
Inspired by WhatsApp UI patterns
Socket.IO for real-time communication
MERN ecosystem