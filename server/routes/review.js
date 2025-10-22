const express = require('express');
const Review = require('../models/Review');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create review
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { turfId, rating, comment } = req.body;

        const review = new Review({
            user: req.user.id,
            turf: turfId,
            rating,
            comment
        });

        await review.save();
        res.status(201).json({
            message: "Review created successfully",
            review
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get reviews for a turf
router.get('/:turfId', async (req, res) => {
    try {
        const reviews = await Review.find({ turf: req.params.turfId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Like/Dislike review
router.put('/:id/like', authenticateToken, async (req, res) => {
    try {
        const { action } = req.body; // 'like' or 'dislike'
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        const userId = req.user.id;

        if (action === 'like') {
            // Remove from dislikedBy if exists
            review.dislikedBy = review.dislikedBy.filter(id => !id.equals(userId));
            review.dislike = Math.max(0, review.dislike - 1);

            // Add to likedBy if not already there
            if (!review.likedBy.some(id => id.equals(userId))) {
                review.likedBy.push(userId);
                review.like += 1;
            }
        } else if (action === 'dislike') {
            // Remove from likedBy if exists
            review.likedBy = review.likedBy.filter(id => !id.equals(userId));
            review.like = Math.max(0, review.like - 1);

            // Add to dislikedBy if not already there
            if (!review.dislikedBy.some(id => id.equals(userId))) {
                review.dislikedBy.push(userId);
                review.dislike += 1;
            }
        }

        await review.save();
        res.json({
            message: "Review updated successfully",
            review
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
