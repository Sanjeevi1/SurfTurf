const express = require('express')
const axios = require('axios')
const Turf = require('../models/Turf')
const router = express.Router()

// Function to query Google Gemini API for AI-based responses
const queryAI = async (turfDetails, userQuery) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCXuwolwy95jyvHcjUXQxoOMjmIEbNvbUA'
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

  const combinedInput = `${turfDetails}\nUser Query: ${userQuery}`

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [
              { text: combinedInput }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          key: GEMINI_API_KEY
        }
      }
    )
    console.log("AI Response:", response.data)
    return response.data
  } catch (error) {
    console.error("Error querying AI:", error)
    return null
  }
}

// POST - Chatbot endpoint
router.post('/', async (req, res) => {
  try {
    const { message } = req.body

    // Initialize a default response
    let responseMessage = 'I am sorry, I didn\'t understand that.'

    // Check if the message relates to turfs
    if (message.toLowerCase().includes('')) {
      try {
        // Fetch turf details from the database
        const turfs = await Turf.find({})
        const turfDetails = turfs.map((turf) => {
          return `
🌍 **Turf Name**: ${turf.name}
📍 **Location**: ${turf.city}
🏷️ **Category**: ${turf.turfCategory}
💵 **Price per Hour**: ₹${turf.pricePerHour}
🛠️ **Amenities**: ${turf.amenities.join(", ")}
📏 **Dimensions**: Length: ${turf.dimensions.length}m, Width: ${turf.dimensions.width}m
🗺️ **Location Coordinates**: Latitude: ${turf.locationCoordinates.coordinates[0]}, Longitude: ${turf.locationCoordinates.coordinates[1]}

⏰ **Available Slots**: 
${turf.availableSlots.map((slot) => {
            return slot.slots.map((slotDetail) => {
              return `📅 Date: ${slot.date}, 🕓 Slot: ${slotDetail.startTime} - ${slotDetail.endTime}, 🏅 Max Players: ${slotDetail.maxPlayers}, Status: ${slotDetail.isBooked ? 'Booked' : 'Available'}`
            }).join("\n")
          }).join("\n")}

🖼️ **Images**: ${turf.images.join(", ")}
📜 **Booking History**: ${turf.bookingHistory.length} bookings
          `
        }).join("\n\n")

        // Now, send the combined turf details and user query to AI
        const aiResponse = await queryAI(turfDetails, message)
        if (aiResponse && aiResponse.candidates && aiResponse.candidates.length > 0) {
          // Accessing the correct part of the response
          const content = aiResponse.candidates[0]?.content?.parts[0]?.text
          if (content) {
            responseMessage = content
          } else {
            console.log("AI Response content is missing.")
            responseMessage = 'Sorry, I could not find an answer for you.'
          }
        } else {
          console.log("AI Response candidates are empty or malformed")
          responseMessage = 'Sorry, I could not find an answer for you.'
        }
      } catch (error) {
        console.error("Error fetching turfs:", error)
        responseMessage = 'There was an error fetching turf information.'
      }
    } else {
      // If not a turf-related query, simply pass the user message to AI
      const aiResponse = await queryAI('', message)
      if (aiResponse && aiResponse.candidates && aiResponse.candidates.length > 0) {
        // Accessing the correct part of the response
        const content = aiResponse.candidates[0]?.content?.parts[0]?.text
        if (content) {
          responseMessage = content
        } else {
          console.log("AI Response content is missing.")
          responseMessage = 'Sorry, I could not find an answer for you.'
        }
      } else {
        console.log("AI Response candidates are empty or malformed")
        responseMessage = 'Sorry, I could not find an answer for you.'
      }
    }

    // Return the AI response
    return res.json({ response: responseMessage })
  } catch (error) {
    console.error("Error in chatbot:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router