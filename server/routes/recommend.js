const express = require('express')
const router = express.Router()

// GET - Get top-ranked turfs (placeholder for AI recommendation)
router.get('/top-ranked-turfs', async (req, res) => {
  try {
    // This would typically connect to your AI model
    // For now, returning a mock response
    const topRankedTurfs = [
      { id: '1', predicted_score: 0.95 },
      { id: '2', predicted_score: 0.90 },
      { id: '3', predicted_score: 0.85 }
    ]

    return res.json(topRankedTurfs)
  } catch (error) {
    console.error('Error fetching top-ranked turfs:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// GET - Get similar turfs
router.get('/similar-turfs/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // This would typically use your AI model to find similar turfs
    // For now, returning a mock response
    const similarTurfs = [
      { id: '2', similarity_score: 0.85 },
      { id: '3', similarity_score: 0.80 },
      { id: '4', similarity_score: 0.75 }
    ]

    return res.json(similarTurfs)
  } catch (error) {
    console.error('Error fetching similar turfs:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router