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

## 📂 Project Structure
The codebase follows a clean, modular architecture to ensure maintainability and separation of concerns:

```text
secure-connect-platform/
├── src/
│   ├── config/          # Database and environment configurations
│   ├── controllers/     # Request handling logic
│   ├── events/          # EventEmitter bus and listeners
│   ├── middleware/      # Auth, RBAC, CORS, and Error handling
│   ├── models/          # MongoDB collection schemas/logic
│   ├── routes/          # Express API routes
│   ├── services/        # Business logic (Password, Token)
│   ├── sockets/         # Socket.IO event handlers
│   ├── utils/           # Helper functions and custom classes
│   ├── app.js           # Express app initialization
│   └── server.js        # Server entry point
├── public/              # Frontend demo files
├── scripts/             # Database seeding scripts
├── .env.example         # Environment variable template
└── package.json         # Dependencies and scripts
```

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
```

## API Endpoints
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT
- `GET /api/notes` - Get user notes (Protected)
- `POST /api/notes` - Create a note (Protected)
- `GET /api/users` - Get all users (Admin only)


<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/ec2078ed-fabd-4318-864c-f0aa0bf7dfd3" />

<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/24934499-8ef3-4cdb-973a-56e5a02b6913" />

<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/d09a17b9-c3ad-4eab-b927-8f4ac1ee7501" />

<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/1bf9aaf9-34f0-40e5-8bee-76dbaa4b5568" />

<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/36594c95-afaa-4780-b1b3-83bf470b06fa" />

<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/6e8d7465-c3a5-4461-ac3a-97bebf10f84a" />

