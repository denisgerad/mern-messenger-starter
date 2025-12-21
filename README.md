# 💬 MERN Messenger

A real-time messaging application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a modern WhatsApp-inspired UI design.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=flat&logo=socket.io&badgeColor=010101)

## ✨ Features

### Real-Time Messaging
- **Instant messaging** with Socket.IO
- **Online/offline status** indicators
- **Message timestamps**
- **Conversation management**

### WhatsApp-Inspired UI
- **Dark theme** with modern color scheme
- **Colorful avatars** with user initials (10 distinct colors)
- **Message bubbles** with sent/received distinction
- **Smooth animations** for messages
- **Responsive design** for mobile and desktop
- **Online indicators** (green dots)

### User Features
- User registration and authentication
- JWT-based authorization
- Multiple conversations
- Delete conversations
- Real-time user presence

## 🎨 UI Enhancements

- **Avatars**: Colorful, initials-based avatars for all users
- **First Names**: Displayed with received messages
- **Message Layout**: Clear distinction between sent and received messages
- **Chat Header**: Shows recipient info and online status
- **Modern Input**: Enhanced message input with send button icon
- **Professional Styling**: WhatsApp-inspired dark theme

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Socket.IO Client** - Real-time communication
- **React Router** - Navigation
- **Axios** - HTTP requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/denisgerad/mern-messenger-starter.git
cd mern-messenger-starter
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` directory (optional):
```env
VITE_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## 🎯 Usage

1. **Register**: Create a new account with a username and password
2. **Login**: Sign in with your credentials
3. **Start Chatting**: 
   - View online users in the sidebar
   - Click on a user to start a conversation
   - Send messages in real-time
   - See online status indicators
4. **Delete Conversations**: Use the delete button in the chat header

## 📁 Project Structure

```
mern-messenger-starter/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API routes
│   │   ├── middlewares/       # Auth middleware
│   │   ├── socket.js          # Socket.IO setup
│   │   ├── config.js          # Configuration
│   │   └── index.js           # Entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/               # API client
│   │   ├── components/        # React components
│   │   │   ├── Avatar.jsx
│   │   │   ├── ChatList.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   └── MessageInput.jsx
│   │   ├── context/           # React context
│   │   ├── pages/             # Page components
│   │   │   ├── Chat.jsx
│   │   │   └── Login.jsx
│   │   ├── utils/             # Utility functions
│   │   │   └── avatar.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Messages
- `GET /messages/:conversationId` - Get messages for a conversation
- `DELETE /messages/conversation/:conversationId` - Delete a conversation

### Socket Events
- `user:online` - User connects
- `send:message` - Send a message
- `receive:message` - Receive a message
- `online:users` - Get online users list
- `conversation:deleted` - Delete conversation
- `message:deleted` - Delete message

## 🎨 Color Palette

- **Background**: `#111b21`
- **Headers/Chat**: `#202c33`
- **Elements**: `#2a3942`
- **Accent**: `#00a884` (WhatsApp green)
- **Sent Messages**: `#005c4b`
- **Received Messages**: `#202c33`
- **Text**: `#e9edef`
- **Secondary Text**: `#667781`

## 🛠️ Development

### Run Backend in Development Mode
```bash
cd backend
npm run dev
```

### Run Frontend in Development Mode
```bash
cd frontend
npm run dev
```

### Build Frontend for Production
```bash
cd frontend
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Dennis Gerard**
- GitHub: [@denisgerad](https://github.com/denisgerad)

## 🙏 Acknowledgments

- Inspired by WhatsApp's UI design
- Built with the MERN stack
- Socket.IO for real-time communication

---

⭐ Star this repo if you find it helpful!
