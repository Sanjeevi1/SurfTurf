const express = require('express')
const jwt = require('jsonwebtoken')
const Booking = require('../models/Booking')
const router = express.Router()

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET || 'your-secret-key')
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" })
  }
}

// GET user's bookings
router.get('/', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('turf', 'name city images')
      .sort({ createdAt: -1 })

    return res.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router
