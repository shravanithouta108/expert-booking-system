# 🎯 ExpertConnect — Real-Time Expert Session Booking System

A full-stack web application for booking 1-on-1 expert sessions in real-time, built with React, Node.js, Express, MongoDB, and Socket.io.

---

## ✨ Features

| Feature | Details |
|---|---|
| Expert Listing | Search by name, filter by category, paginated results, loading & error states |
| Expert Detail | Profile view, time slots grouped by date, **real-time slot updates via Socket.io** |
| Booking | Full form validation, success confirmation, disabled booked slots |
| My Bookings | Lookup by email, status badges (Pending / Confirmed / Completed), cancel action |
| Double Booking Prevention | MongoDB unique compound index + pre-check + race condition handled atomically |
| Real-time Updates | Socket.io rooms — all viewers of an expert see slot changes instantly |

---

## 🛠 Tech Stack

**Frontend** — React 18, Vite, Tailwind CSS, React Router v6, React Hook Form, Socket.io-client, Axios, react-hot-toast

**Backend** — Node.js, Express, MongoDB (Mongoose), Socket.io, express-validator, Helmet, Morgan

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/expert-booking-system.git
cd expert-booking-system
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set your MONGODB_URI
npm run seed        # Populate 10 demo experts
npm run dev         # Starts on http://localhost:5000
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev         # Starts on http://localhost:5173
```

---

## 📁 Folder Structure

```
expert-booking-system/
├── backend/
│   ├── server.js                  # HTTP server + Socket.io + DB connect
│   └── src/
│       ├── app.js                 # Express app, middleware, routes
│       ├── controllers/
│       │   ├── expertController.js
│       │   └── bookingController.js
│       ├── models/
│       │   ├── Expert.js
│       │   └── Booking.js         # Unique index prevents double booking
│       ├── routes/
│       │   ├── expertRoutes.js
│       │   └── bookingRoutes.js
│       ├── middleware/
│       │   ├── errorHandler.js
│       │   └── validate.js
│       ├── socket/
│       │   └── socketHandler.js   # Socket.io rooms per expert
│       └── utils/
│           └── seedData.js
└── frontend/
    └── src/
        ├── pages/
        │   ├── ExpertListingPage.jsx
        │   ├── ExpertDetailPage.jsx   # Real-time slot updates
        │   ├── BookingPage.jsx
        │   └── MyBookingsPage.jsx
        ├── components/
        │   ├── common/  (Navbar, Spinner, Error, Pagination)
        │   └── experts/ (ExpertCard, TimeSlot)
        ├── context/SocketContext.jsx
        ├── services/api.js
        └── utils/helpers.js
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/experts` | List experts (pagination + search + filter) |
| `GET` | `/api/experts/:id` | Expert detail + available slots for 14 days |
| `POST` | `/api/bookings` | Create a booking |
| `GET` | `/api/bookings?email=` | Fetch bookings by email |
| `PATCH` | `/api/bookings/:id/status` | Update booking status |

### Query Parameters — GET /api/experts
| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 6, max: 20) |
| `category` | string | Filter by category |
| `search` | string | Full-text search |

---

## ⚡ Real-Time Architecture

```
Client A (viewing Expert X)          Client B (books Expert X slot)
       │                                      │
       │ socket.emit("join-expert", expertId) │
       │─────────────────────────────────────>│ Socket Server: room = expert-{id}
       │                                      │
       │                         POST /api/bookings
       │                                      │──────> DB write (atomic)
       │                                      │
       │<── socket.on("slot-booked") ─────────│ io.to(room).emit("slot-booked")
       │                                      │
  Slot turns grey instantly
```

---

## 🔒 Double Booking Prevention

Two-layer protection:

1. **Pre-flight check** — `bookingController.js` queries for existing booking before insert and returns HTTP 409.
2. **Atomic DB guard** — `Booking` schema has a **unique compound index** on `{ expertId, date, timeSlot }`. Even if two requests pass the pre-flight simultaneously, MongoDB rejects the second write with code `11000`, which is caught and returned as a user-friendly 409 response.

---

## 🌍 Environment Variables

**Backend `.env`**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expert-booking
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Frontend `.env`**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📦 Deployment

| Service | Purpose |
|---------|---------|
| [Render](https://render.com) / [Railway](https://railway.app) | Backend + MongoDB |
| [Vercel](https://vercel.com) | Frontend |
| [MongoDB Atlas](https://cloud.mongodb.com) | Managed MongoDB |

Set the corresponding environment variables on your hosting platform.

---

## 👨‍💻 Author

Built as part of an internship application challenge, demonstrating full-stack engineering with real-time capabilities.

> "The system is designed so that even under concurrent load, no two users can ever book the same expert slot — the database is the source of truth.""# expert-booking-system" 
