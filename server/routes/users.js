const express = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password, email, phn } = req.body
    
    console.log('Received signup data:', { username, email, phn, hasPassword: !!password })

    // Check if user already exists
    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Validate required fields
    if (!username || !email || !password || !phn) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone: phn,
      role: 'user'
    })

    const savedUser = await newUser.save()

    return res.json({
      message: "User created successfully",
      success: true,
      savedUser
    })
  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ error: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "User doesn't exist" })
    }

    // Check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" })
    }

    // Create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email
    }

    // Create token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET || 'your-secret-key', { expiresIn: "1d" })

    const response = res.json({
      message: "Login successful",
      success: true,
      user
    })

    response.cookie("token", token, { httpOnly: true })
    return response
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

// Get user details
router.get('/getuser', async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET || 'your-secret-key')
    const user = await User.findById(decoded.id).select('-password')
    
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    return res.json({
      success: true,
      data: user
    })
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" })
  }
})

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token')
  return res.json({ message: "Logout successful" })
})

module.exports = router