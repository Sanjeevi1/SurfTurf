const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // New field
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // New field
});

module.exports = mongoose.model('Review', reviewSchema);
