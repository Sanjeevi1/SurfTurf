const express = require('express')
const Turf = require('../models/Turf')
const router = express.Router()

// GET all turfs or turfs by city
router.get('/', async (req, res) => {
  try {
    const { city } = req.query

    if (city === 'true') {
      // Return unique cities
      const turfs = await Turf.find({})
      const uniqueCities = Array.from(new Set(turfs.map(turf => turf.city)))
        .map(city => ({ name: city, code: city }))
      return res.json(uniqueCities)
    }

    // Return all turfs
    const turfs = await Turf.find({})
    return res.json(turfs)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, error: error.message })
  }
})

// GET turf by ID
router.get('/:id', async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id)
    if (!turf) {
      return res.status(404).json({ error: 'Turf not found' })
    }
    return res.json({ success: true, data: turf })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, error: error.message })
  }
})

// POST - Filter turfs by location, date, city, category
router.post('/', async (req, res) => {
  try {
    const { location, date, city, category } = req.body

    const query = {}

    if (city) {
      query.city = city
    }

    if (location) {
      query.location = location
    }

    if (date) {
      query.availableDates = { $in: [date] }
    }

    if (category) {
      query.turfCategory = category
    }

    const turfs = await Turf.find(query)
    return res.json(turfs)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, error: error.message })
  }
})

// DELETE turf
router.delete('/delete', async (req, res) => {
  try {
    const { id } = req.query
    const result = await Turf.findByIdAndDelete(id)
    
    if (!result) {
      return res.status(404).json({ error: 'Turf not found' })
    }
    
    return res.json({ message: 'Turf deleted successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
})

module.exports = router