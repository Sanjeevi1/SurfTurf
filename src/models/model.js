const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'owner', 'admin'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const turfSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    city: { type: String, required: true },

    // Modify the structure for available slots
    availableSlots: [{
        date: { type: Date, required: true }, // Store date only
        slots: [{  // Define the slots for the specific date
            startTime: { type: String, required: true }, // e.g., "08:00"
            endTime: { type: String, required: true },   // e.g., "09:00"
            maxPlayers: { type: Number, required: true },
            isBooked: { type: Boolean, default: false },
            status: { type: String, enum: ["locked", "unlocked"], default: "unlocked" }
        }]
    }],

    images: { type: [String], required: true },
    amenities: { type: [String], required: true },
    turfCategory: { type: String, required: true },

    dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true }
    },

    locationCoordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    },

    bookingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


const Turf = mongoose.models.Turf || mongoose.model('Turf', turfSchema);
const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    bookingDate: { type: Date, required: true }, // Specific booking date

    timeSlot: {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true }
    },

    numberOfPlayers: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    // Status: initiated means booking process started but not completed
    status: { type: String, enum: ['initiated', 'pending', 'completed', 'failed'], default: 'initiated' },

    // Prevent double booking
    locked: { type: Boolean, default: false }, // Used to lock the slot when a user starts booking

    paymentStatus: { type: String, enum: ['completed', 'pending'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // New field
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // New fiel
});
// models/SavedTurf.js


const savedTurfSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true,
    },
    turfId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Turf', // Assuming you have a Turf model
        required: true,
    },
    savedAt: {
        type: Date,
        default: Date.now,
    }
});

const SavedTurf = mongoose.models.SavedTurf || mongoose.model('SavedTurf', savedTurfSchema);

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
const paymentSchema = new mongoose.Schema({
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, enum: ['success', 'pending'], required: true },
    transactionId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

export { Payment, Review, User, Booking, Turf, SavedTurf }
