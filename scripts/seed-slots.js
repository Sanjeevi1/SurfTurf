const mongoose = require('mongoose');
const path = require('path');

// Set up the database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/surfturf';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Define the Turf schema inline
const turfSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String, required: true },
    pricePerHour: { type: Number, required: true },
    turfCategory: { type: String, required: true },
    amenities: [{ type: String }],
    dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true }
    },
    locationCoordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }
    },
    images: [{ type: String }],
    availableSlots: [{
        date: { type: Date, required: true },
        slots: [{
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            maxPlayers: { type: Number, default: 10 },
            isBooked: { type: Boolean, default: false }
        }]
    }],
    bookingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
});

const Turf = mongoose.model('Turf', turfSchema);

// Function to generate time slots (10 slots of 1 hour each)
const generateTimeSlots = () => {
    const slots = [];
    const startHour = 6; // Starting from 6 AM
    const endHour = 16; // Ending at 4 PM (10 slots)
    
    for (let hour = startHour; hour < endHour; hour++) {
        const startTime = `${hour.toString().padStart(2, '0')}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
        
        slots.push({
            startTime,
            endTime,
            maxPlayers: 10,
            isBooked: false
        });
    }
    
    return slots;
};

// Function to generate dates for next 7 days
const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        date.setHours(0, 0, 0, 0); // Reset time to start of day
        
        dates.push(date);
    }
    
    return dates;
};

// Main seeding function
const seedSlots = async () => {
    try {
        console.log('🚀 Starting slot seeding process...');
        
        // Connect to database
        await connectDB();
        console.log('✅ Connected to database');
        
        // Get all turfs
        const turfs = await Turf.find({});
        console.log(`📊 Found ${turfs.length} turfs`);
        
        if (turfs.length === 0) {
            console.log('❌ No turfs found in database');
            return;
        }
        
        // Generate dates and slots
        const dates = generateDates();
        const timeSlots = generateTimeSlots();
        
        console.log(`📅 Generated ${dates.length} dates`);
        console.log(`⏰ Generated ${timeSlots.length} time slots per day`);
        
        // Update each turf
        for (const turf of turfs) {
            console.log(`🔄 Processing turf: ${turf.name}`);
            
            // Create available slots for each date
            const availableSlots = dates.map(date => ({
                date: date,
                slots: timeSlots
            }));
            
            // Update the turf with new slots
            await Turf.findByIdAndUpdate(
                turf._id,
                { 
                    $set: { 
                        availableSlots: availableSlots 
                    } 
                },
                { new: true }
            );
            
            console.log(`✅ Updated slots for turf: ${turf.name}`);
        }
        
        console.log('🎉 Slot seeding completed successfully!');
        console.log(`📈 Updated ${turfs.length} turfs with ${dates.length} days × ${timeSlots.length} slots = ${dates.length * timeSlots.length} total slots per turf`);
        
    } catch (error) {
        console.error('❌ Error during slot seeding:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
};

// Run the seeding function
seedSlots();
