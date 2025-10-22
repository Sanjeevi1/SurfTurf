const express = require('express')
const Booking = require('../models/Booking')
const Turf = require('../models/Turf')
const router = express.Router()

// POST - Create booking
router.post('/', async (req, res) => {
  try {
    const { user, turfId, selectedDate, selectedSlot, totalCost, numberOfPlayers } = req.body

    const startOfDay = new Date(selectedDate)
    startOfDay.setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(startOfDay)
    endOfDay.setUTCHours(23, 59, 59, 999)

    // Check if booking already exists
    const existingBooking = await Booking.findOne({
      turf: turfId,
      bookingDate: { $gte: startOfDay, $lt: endOfDay },
      "timeSlot.startTime": selectedSlot.split("-")[0],
      "timeSlot.endTime": selectedSlot.split("-")[1],
    })

    if (existingBooking) {
      return res.json({ message: "Booking already exists", booking: existingBooking })
    }

    // Create new booking
    const newBooking = new Booking({
      user: user,
      turf: turfId,
      bookingDate: selectedDate,
      timeSlot: {
        startTime: selectedSlot.split("-")[0],
        endTime: selectedSlot.split("-")[1],
      },
      numberOfPlayers: numberOfPlayers,
      totalPrice: totalCost,
      status: "completed",
      locked: false,
      paymentStatus: "completed",
    })

    await newBooking.save()

    // Update turf slot status
    const updateResult = await Turf.updateOne(
      {
        _id: turfId,
        "availableSlots.date": new Date(startOfDay),
      },
      {
        $set: {
          "availableSlots.$.slots.$[slot].isBooked": true,
        },
      },
      {
        arrayFilters: [
          {
            "slot.startTime": selectedSlot.split("-")[0].trim(),
            "slot.endTime": selectedSlot.split("-")[1].trim(),
          },
        ],
      }
    )

    if (updateResult.modifiedCount === 0) {
      console.error("Slot update failed: No slots were modified.")
    }

    return res.json({ message: "Booking created successfully", booking: newBooking })
  } catch (error) {
    console.error("Error confirming booking:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

// GET - Get bookings for a specific date and turf
router.get('/', async (req, res) => {
  try {
    const { turfId, date } = req.query

    const startOfDay = new Date(date)
    startOfDay.setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(startOfDay)
    endOfDay.setUTCHours(23, 59, 59, 999)

    // Find bookings for the selected date and turf
    const bookings = await Booking.find({
      turf: turfId,
      bookingDate: { $gte: startOfDay, $lt: endOfDay },
    })

    // Extract booked time slots from bookings
    const bookedSlots = bookings.map(
      (booking) => `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}`
    )

    return res.json({ bookedSlots })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router