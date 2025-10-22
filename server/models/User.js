const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    trim: true,
    maxLength: [30, "Username cannot be more than 30 characters"]
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [6, "Password must be at least 6 characters"]
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"]
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'owner'],
    default: 'user'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)