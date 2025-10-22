const express = require('express')
const jwt = require('jsonwebtoken')
const SavedTurf = require('../models/SavedTurf')
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

// POST - Save turf
router.post('/', verifyToken, async (req, res) => {
  try {
    const { userId, turfId } = req.body

    // Check if already saved
    const existingSavedTurf = await SavedTurf.findOne({
      user: userId,
      turf: turfId
    })

    if (existingSavedTurf) {
      return res.status(400).json({ message: 'Turf already saved.' })
    }

    // Create new saved turf
    const savedTurf = new SavedTurf({
      user: userId,
      turf: turfId
    })

    await savedTurf.save()

    return res.json({ message: 'Turf saved successfully' })
  } catch (error) {
    console.error('Error saving turf:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// GET - Get user's saved turfs
router.get('/use', verifyToken, async (req, res) => {
  try {
    const savedTurfs = await SavedTurf.find({ user: req.user.id })
      .populate('turf')
      .sort({ createdAt: -1 })

    return res.json(savedTurfs)
  } catch (error) {
    console.error('Error fetching saved turfs:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router