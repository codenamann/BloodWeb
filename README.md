# BloodWeb - MERN Stack Migration

This project has been migrated from vanilla HTML/CSS/JS to a modern MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

- `client/`: React Frontend (Vite + Tailwind CSS)
- `Server/`: Node.js Backend (Express + MongoDB)
- `Frontend/`: Legacy frontend code (kept for reference)

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (in `Server/.env`)

### 1. Setup Backend
```bash
cd Server
npm install
# Ensure .env has MONGO_URI
npm start
```
The server runs on `http://localhost:5000`.

### 2. Setup Frontend
```bash
cd client
npm install
npm run dev
```
The client runs on `http://localhost:5173`.

## Features
- **Authentication**: Login, Signup, Profile Completion.
- **Dashboard**: View profile, blood details, emergency contacts.
- **Blood Requests**: Create, View, Accept, and Delete requests.
- **Real-time**: Socket.IO integration for notifications and live updates.
- **Modern UI**: Dark mode aesthetic with Tailwind CSS and Framer Motion.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Axios, Socket.IO Client.
- **Backend**: Node.js, Express, MongoDB, Socket.IO.
