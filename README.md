# Secure Connect and Communication Platform

A secure backend platform built for Web Dev III Lab 4, featuring JWT authentication, role-based access control (RBAC), secure Notes API, and real-time chat.

## Tech Stack
- Node.js & Express.js
- MongoDB (Native Driver)
- JWT & bcrypt
- Socket.IO
- Node.js EventEmitter

## Setup Instructions
1. Clone the repository: `git clone <your-repo-url>`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and add your `JWT_SECRET` and `MONGO_URI`.
4. Seed the admin user: `npm run seed:admin`
5. Start the server: `npm run dev`

## API Endpoints
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT
- `GET /api/notes` - Get user notes (Protected)
- `POST /api/notes` - Create a note (Protected)
- `GET /api/users` - Get all users (Admin only)