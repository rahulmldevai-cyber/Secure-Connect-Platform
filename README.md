# 🔒 Secure Connect and Communication Platform

A secure, real-time backend application built to demonstrates core backend security, RESTful API design, and event-driven real-time communication, built entirely from scratch without pre-built authentication boilerplates.

## ✨ Features

- **Secure Authentication:** User signup and login with `bcrypt` password hashing.
- **Stateless Sessions:** `JWT` (JSON Web Tokens) for secure, stateless user sessions.
- **Role-Based Access Control (RBAC):** Middleware-enforced access for `user` and `admin` roles.
- **Secure Notes API:** Full CRUD operations ensuring users can only access their own notes.
- **Real-Time Chat:** Bidirectional communication powered by `Socket.IO`.
- **Event-Driven Architecture:** Custom `Node.js EventEmitter` for decoupled audit logging.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Native Driver)
- **Security:** `bcrypt`, `jsonwebtoken`
- **Real-Time:** `Socket.IO`
- **Config:** `dotenv`

### 1. Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas)

### 2. Installation

**Clone the repository and install dependencies:**
```bash
git clone <your-repository-url>
cd secure-connect-platform
npm install

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