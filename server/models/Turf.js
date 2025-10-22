const mongoose = require('mongoose')

const turfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a turf name"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Please provide a description"]
  },
  pricePerHour: {
    type: Number,
    required: [true, "Please provide a price per hour"]
  },
  city: {
    type: String,
    required: [true, "Please provide a city"]
  },
  dimensions: {
    length: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    }
  },
  locationCoordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  amenities: [{
    type: String
  }],
  turfCategory: {
    type: String,
    required: [true, "Please provide a turf category"]
  },
  images: [{
    type: String
  }],
  availableSlots: [{
    date: {
      type: Date,
      required: true
    },
    slots: [{
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      maxPlayers: {
        type: Number,
        default: 10
      },
      isBooked: {
        type: Boolean,
        default: false
      }
    }]
  }],
  bookingHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Turf', turfSchema)