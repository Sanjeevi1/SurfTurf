const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/surfturf', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Routes
app.use('/api/users', require('./routes/users'))
app.use('/api/turf', require('./routes/turf'))
app.use('/api/book', require('./routes/booking'))
app.use('/api/bookings', require('./routes/bookings'))
app.use('/api/save', require('./routes/save'))
app.use('/api/chatbot', require('./routes/chatbot'))
app.use('/api/recommend', require('./routes/recommend'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})