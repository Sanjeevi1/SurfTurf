const mongoose = require('mongoose')

const savedTurfSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  turf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turf',
    required: true
  }
}, {
  timestamps: true
})

// Ensure unique combination of user and turf
savedTurfSchema.index({ user: 1, turf: 1 }, { unique: true })

module.exports = mongoose.model('SavedTurf', savedTurfSchema)