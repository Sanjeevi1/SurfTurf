# SurfTurf - MERN Stack Turf Booking Platform

A comprehensive turf booking platform built with React, Node.js, Express.js, and MongoDB. This project provides a complete solution for booking sports turfs with AI-powered recommendations and chatbot assistance.

## Features

- **User Authentication**: Sign up, login, and user management
- **Turf Management**: Browse, search, and filter turfs
- **Booking System**: Real-time slot booking with date/time selection
- **AI Recommendations**: Machine learning-powered turf recommendations
- **Chatbot Assistant**: AI-powered customer support
- **Saved Turfs**: Save favorite turfs for quick access
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live booking status updates

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- PrimeReact for UI components
- Flowbite for additional components
- React Icons for icons
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcryptjs for password hashing
- CORS for cross-origin requests
- Google Gemini AI for chatbot

## Project Structure

```
surfturf/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── server.js         # Main server file
│   └── package.json
└── package.json           # Root package.json
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd surfturf
   ```

2. **Install all dependencies**
   ```bash
   npm run setup
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/surfturf
   TOKEN_SECRET=your-super-secret-jwt-key-here
   GEMINI_API_KEY=your-gemini-api-key-here
   PORT=5000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - React frontend on http://localhost:3000
   - Node.js backend on http://localhost:5000

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend
- `npm run build` - Build the frontend for production
- `npm run start` - Start the production server
- `npm run setup` - Install all dependencies

## API Endpoints

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/getuser` - Get user details
- `GET /api/users/logout` - User logout

### Turfs
- `GET /api/turf` - Get all turfs
- `GET /api/turf/:id` - Get turf by ID
- `POST /api/turf` - Filter turfs
- `DELETE /api/turf/delete` - Delete turf

### Bookings
- `POST /api/book` - Create booking
- `GET /api/book` - Get bookings for date/turf
- `GET /api/bookings` - Get user bookings

### Saved Turfs
- `POST /api/save` - Save turf
- `GET /api/save/use` - Get saved turfs

### AI Features
- `POST /api/chatbot` - Chatbot endpoint
- `GET /api/recommend/top-ranked-turfs` - Get AI recommendations
- `GET /api/recommend/similar-turfs/:id` - Get similar turfs

## Features in Detail

### 1. User Authentication
- Secure JWT-based authentication
- Password hashing with bcryptjs
- Protected routes and API endpoints
- User session management

### 2. Turf Management
- Comprehensive turf listings with filters
- Search functionality
- Category-based filtering
- Price range filtering
- Amenity-based filtering

### 3. Booking System
- Real-time slot availability
- Date and time selection
- Booking confirmation
- Payment integration ready

### 4. AI Features
- Machine learning recommendations
- AI-powered chatbot using Google Gemini
- Similar turf suggestions
- Personalized user experience

### 5. User Experience
- Responsive design for all devices
- Smooth animations and transitions
- Real-time notifications
- Intuitive navigation

## Database Schema

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  phone: String,
  role: String (user/admin/owner)
}
```

### Turf Model
```javascript
{
  name: String,
  description: String,
  pricePerHour: Number,
  city: String,
  dimensions: { length: Number, width: Number },
  locationCoordinates: { type: String, coordinates: [Number] },
  amenities: [String],
  turfCategory: String,
  images: [String],
  availableSlots: [{ date: Date, slots: [Object] }],
  owner: ObjectId
}
```

### Booking Model
```javascript
{
  user: ObjectId,
  turf: ObjectId,
  bookingDate: Date,
  timeSlot: { startTime: String, endTime: String },
  numberOfPlayers: Number,
  totalPrice: Number,
  status: String,
  paymentStatus: String
}
```

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `client/dist` folder

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables
2. Deploy the `server` folder
3. Ensure MongoDB connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.