# MERN Messenger — Backend

Summary
- Express-based backend for the MERN Messenger starter project. Handles user authentication (JWT), message persistence in MongoDB, and realtime messaging via `socket.io`.
- Deployed on Render.

Tech stack
- Node.js / Express — HTTP API and socket integration
- MongoDB (Atlas) — data store for users and messages
- Mongoose — ODM for MongoDB
- socket.io — realtime bidirectional messaging

Main components & responsibilities
- `src/routes/auth.js` + `src/controllers/authController.js` — Registration and login endpoints; passwords hashed with `bcryptjs`; responses include a JWT and user object.
- `src/routes/messages.js` + `src/controllers/messageController.js` — Message APIs:
  - `GET /api/messages/:conversationId` — fetch messages for a conversation
  - `POST /api/messages/send` — (via protected API) create and persist a new message
  - `DELETE /api/messages/:id` — delete a single message (only sender allowed)
  - `DELETE /api/messages/conversation/:conversationId` — delete entire conversation (participants only)
- `src/socket.js` — socket.io server setup and handlers (`user:online`, `send:message`, `delete:message`, `conversation:deleted`). Maintains an in-memory map of online users to socket ids for routing.
- `src/middlewares/authMiddleware.js` — verifies JWT and attaches `req.user` for protected routes.

Data model notes
- `User` documents store `username`, `passwordHash`, optional `walletAddress`.
- `Message` documents store `conversationId` (string), `sender` (ObjectId), `receiver` (ObjectId), `text`, `mediaUrl`, `createdAt`.
- Messages in this starter are not encrypted at rest.

Environment variables (Render / local)
- `PORT` — port for the app (Render sets this automatically)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWTs
- `CLIENT_ORIGIN` — allowed CORS origin, e.g. `https://your-frontend.vercel.app`

Run locally
1. Install dependencies: `npm install`
2. Provide a `.env.local` (or `.env`) with the env vars above.
3. Start the server in dev: `npm run dev` (uses `nodemon`)

Deployment (Render)
- Create a Web Service on Render linked to the repository.
- Add environment variables in Render's dashboard (`MONGO_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`).
- Ensure your `CLIENT_ORIGIN` includes the Vercel domain for the frontend so CORS and socket.io connections work.

Security & production notes
- JWTs are stored in `localStorage` by default in the frontend. For production, consider storing tokens in an HttpOnly cookie to reduce XSS risk.
- The app uses an in-memory map to track online users; for multi-instance production, use a shared adapter (Redis) for socket.io so user presence is synchronized across instances.
- Consider adding rate limiting, validation and stricter input sanitization before production.

How to showcase in portfolio
- Describe the architecture (React SPA → Vercel, Express API & socket → Render, MongoDB Atlas).
- Include sequence diagrams or a short GIF showing realtime messaging and message deletion (two devices).
- Mention trade-offs: simple message store (not encrypted), in-memory presence, and areas for improvement.
