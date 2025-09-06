SynergySphere – Team Collaboration Platform (MVP)

SynergySphere is a modern, mobile-first, responsive team collaboration platform. It helps teams stay organized, communicate effectively, manage tasks and projects, and receive notifications — all in a single intelligent platform.

This repository contains both the frontend and backend for SynergySphere.

🚀 Features

User authentication (signup/login/logout)

Project creation & management

Task assignment with due dates and statuses (To-Do / In Progress / Done)

Project-specific threaded discussions

Notifications for important updates

Mobile-first responsive design with desktop support

🔹 Frontend
Technologies Used

Next.js (React framework)

TypeScript

Tailwind CSS / Sonner for notifications

Getting Started
Prerequisites

Node.js v14 or higher

pnpm package manager

Installation

cd frontend
pnpm install

Environment Variables

Create a .env file in frontend/:
NEXT_PUBLIC_API_URL=http://localhost:5001/api

Running the Application
# Make sure backend is running
pnpm dev

Open your browser at http://localhost:3000

Features

Connects to backend API via lib/api.ts

Handles authentication, projects, tasks, discussions, and notifications

Uses toast notifications to display success/error messages

🔹 Backend
Technologies Used

Node.js & Express.js

MongoDB with Mongoose

JWT authentication

Bcrypt for password hashing

Getting Started
Prerequisites

Node.js v14 or higher

MongoDB (local or cloud instance)

Installation

cd backend
npm install

Environment Variables

Create .env in backend/:

NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://admin:password@localhost:27017/synergysphere?authSource=admin
JWT_SECRET=your_jwt_secret_key_here_change_it_in_production
JWT_EXPIRE=7d

Running the Application

# Development
npm run dev

# Production
npm start

Seeding Data

# Seed sample data
npm run seed

# Delete all data
npm run seed -d

API Endpoints

Authentication

POST /api/auth/signup – Register a new user

POST /api/auth/login – Login

Projects

GET /api/projects – Get all projects for logged in user

POST /api/projects – Create a new project

PUT /api/projects/:id – Update project

DELETE /api/projects/:id – Delete project

PUT /api/projects/:id/members – Add member

Tasks

GET /api/tasks?projectId=ID – Get project tasks

POST /api/tasks – Create a task

PUT /api/tasks/:id – Update task

DELETE /api/tasks/:id – Delete task

Discussions

GET /api/discussions?projectId=ID – Get project messages

POST /api/discussions – Create message

Notifications

GET /api/notifications – Get unread notifications

PUT /api/notifications/:id/read – Mark read

PUT /api/notifications/read-all – Mark all read

Profile

GET /api/profile – Get user info

PUT /api/profile – Update user info

DELETE /api/profile – Delete account

⚡ Running Both Frontend & Backend

Start MongoDB

Run backend: cd backend && npm run dev

Run frontend: cd frontend && pnpm dev

Open browser at http://localhost:3000