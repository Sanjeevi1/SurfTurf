# SurfTurf Backend API

This is the Node.js backend API for the SurfTurf application.

## Features

- User authentication and authorization
- Turf management (CRUD operations)
- Booking system
- Review system
- Save/unsave turfs
- Admin panel functionality
- Chatbot integration

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/surfturf
TOKEN_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
OPENAI_API_KEY=your_openai_api_key
CLIENT_URL=http://localhost:3000
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/signup` - User registration
- `GET /api/users/getuser` - Get user details
- `GET /api/users/logout` - User logout

### Turfs
- `GET /api/turf` - Get all turfs
- `GET /api/turf/:id` - Get turf by ID
- `POST /api/turf` - Filter turfs
- `GET /api/turf/ownerTurfs/:ownerId` - Get turfs by owner
- `DELETE /api/turf/delete/:id` - Delete turf
- `PUT /api/turf/slotStatus/:id` - Update slot status

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/ownerBooking/:ownerId` - Get owner bookings
- `PUT /api/bookings/:id` - Update booking status

### Reviews
- `POST /api/review` - Create review
- `GET /api/review/:turfId` - Get reviews for turf
- `PUT /api/review/:id/like` - Like/dislike review

### Save Turfs
- `POST /api/save` - Save turf
- `GET /api/save` - Get saved turfs
- `DELETE /api/save/:turfId` - Remove saved turf

### Admin
- `POST /api/admin/add` - Add new turf
- `POST /api/admin/addOwner` - Add new owner
- `PUT /api/admin/edit/:id` - Edit turf

### Chatbot
- `POST /api/chatbot` - Chat with AI assistant

## Database Models

- **User**: User accounts with roles (user, owner, admin)
- **Turf**: Turf listings with availability slots
- **Booking**: User bookings
- **Review**: User reviews and ratings
- **SavedTurf**: User's saved turfs
- **Payment**: Payment records

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```
