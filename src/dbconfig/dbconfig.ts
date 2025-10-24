import mongoose from "mongoose";

async function connect() {
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log('MongoDB already connected');
            return;
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI!);
        
        const connection = mongoose.connection;
        
        // Set max listeners to prevent warnings
        connection.setMaxListeners(15);
        
        // Event listeners (only add if not already added)
        if (connection.listenerCount('connected') === 0) {
            connection.on('connected', () => {
                console.log('MongoDB connected successfully');
            });
        }
        
        if (connection.listenerCount('error') === 0) {
            connection.on('error', (err) => {
                console.log('MongoDB connection error. Please make sure MongoDB is running ' + err);
                process.exit();
            });
        }
        
        if (connection.listenerCount('disconnected') === 0) {
            connection.on('disconnected', () => {
                console.log('MongoDB disconnected');
            });
        }
        
    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
    }
}


import { Payment, Review, User, Booking, Turf, SavedTurf } from '@/models/model'; // Adjust the path as necessary

// Predefined slots
const predefinedSlots = [
    { startTime: "08:00", endTime: "09:00", maxPlayers: 10, isBooked: false },
    { startTime: "09:00", endTime: "10:00", maxPlayers: 10, isBooked: false },
    { startTime: "10:00", endTime: "11:00", maxPlayers: 10, isBooked: false },
    { startTime: "11:00", endTime: "12:00", maxPlayers: 10, isBooked: false },
    { startTime: "12:00", endTime: "13:00", maxPlayers: 10, isBooked: false }
];

// Function to add multiple dates and slots to all turfs
async function addDatesAndSlotsToAllTurfs(startDate) {
    const datesToAdd = [];

    // Generate 5 dates starting from the given startDate
    for (let i = 0; i < 5; i++) {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + i); // Increment the date
        datesToAdd.push({
            date: newDate,
            slots: predefinedSlots
        });
    }

    try {
        // Update all turfs to add the new dates and their corresponding slots
        const result = await Turf.updateMany(
            {},
            {
                $addToSet: {
                    availableSlots: { $each: datesToAdd }
                }
            }
        );

        console.log(`${result.modifiedCount} turfs updated with new dates and slots.`);
    } catch (error) {
        console.error('Error adding dates and slots to turfs:', error);
    }
}

// Example usage: Call this function with the desired start date


// Run the migration script


// Main function to seed the database


function getRandomRating() {
    return Math.floor(Math.random() * 5) + 1; // Generates a random rating between 1 and 5
}

async function seedData() {
    await mongoose.connection.dropDatabase();

    // Step 1: Create Users
    const roles = ['user', 'owner', 'admin'];
    const users = await User.insertMany(
        Array.from({ length: 10 }).map((_, i) => ({
            username: `user${i + 1}`,
            password: 'password123',
            email: `user${i + 1}@example.com`,
            phone: `98765432${i + 10}`,
            role: i < 3 ? 'owner' : 'user', // First 3 are owners
        }))
    );

    // Step 2: Create Turfs
    const turfDescriptions = [
        "Spacious ground with greenery",
        "Ideal for football and cricket",
        "Equipped with night lights",
        "Well-maintained turf",
        "Synthetic grass, suitable for all sports",
        "Professional-grade surface",
        "Near city center",
        "Family-friendly turf",
        "Available for tournaments",
        "Affordable rates for groups"
    ];
    const turfAmenities = [
        ["Parking", "Restroom", "Changing Room"],
        ["Cafeteria", "First Aid", "Floodlights"],
        ["Seating Area", "Water Dispenser", "Locker Room"],
        ["Washroom", "Free WiFi", "Cafe"],
        ["Medical Assistance", "CCTV Security", "Reception"],
    ];
    const cities = ["Chennai", "Coimbatore", "Madurai", "Salem", "Tirunelveli"];

    const turfs = await Turf.insertMany(
        Array.from({ length: 10 }).map((_, i) => ({
            name: `Turf ${i + 1}`,
            owner: users[i % 3]._id,
            description: turfDescriptions[i],
            pricePerHour: 500 + i * 50,
            city: cities[i % cities.length],
            availableSlots: Array.from({ length: 10 }).map((_, j) => ({
                date: new Date(Date.now() + j * 86400000), // Next 10 days
                slots: Array.from({ length: 10 }).map((_, k) => ({
                    startTime: `${8 + k}:00`, // 08:00 to 17:00
                    endTime: `${9 + k}:00`,
                    maxPlayers: 10,
                    isBooked: false,
                    status: "unlocked"
                }))
            })),
            images: [`image${i + 1}.jpg`, `image${i + 2}.jpg`],
            amenities: turfAmenities[i % turfAmenities.length],
            turfCategory: "Sports",
            dimensions: { length: 100, width: 50 },
            locationCoordinates: { type: 'Point', coordinates: [78.9629 + i * 0.01, 11.0168 + i * 0.01] },
        }))
    );

    // Step 3: Create Unique Reviews with Random Ratings
    const positiveReviews = [
        "Fantastic turf, perfect for team games!",
        "Loved the facilities, very clean and well-maintained.",
        "The lighting setup was great for evening matches.",
        "The staff was helpful, had an amazing experience!",
        "Great value for the price, highly recommend!",
    ];
    const negativeReviews = [
        "The turf was a bit overpriced for what it offered.",
        "Could improve on cleanliness in common areas.",
        "Staff was unhelpful when asked for assistance.",
        "Had issues with the booking system, not satisfied.",
        "Not enough parking space, inconvenient for groups."
    ];

    const reviews = [];
    for (let turf of turfs) {
        for (let i = 0; i < 5; i++) {
            reviews.push({
                user: users[i]._id,
                turf: turf._id,
                rating: getRandomRating(), // Random rating between 1 and 5
                comment: i % 2 === 0 ? positiveReviews[i % positiveReviews.length] : negativeReviews[i % negativeReviews.length],
                like: i + 2,
                dislike: i % 2,
                likedBy: [users[0]._id, users[1]._id],
                dislikedBy: [users[2]._id]
            });
        }
    }
    await Review.insertMany(reviews);

    // Step 4: Create Bookings
    const bookings = [];
    for (let user of users) {
        for (let i = 0; i < 5; i++) {
            bookings.push({
                user: user._id,
                turf: turfs[i % turfs.length]._id,
                bookingDate: new Date(Date.now() + i * 86400000), // Different dates
                timeSlot: { startTime: "08:00", endTime: "09:00" },
                numberOfPlayers: 10,
                totalPrice: 500,
                status: 'completed',
                paymentStatus: 'completed',
                locked: false,
            });
        }
    }
    await Booking.insertMany(bookings);

    // Step 5: Create Saved Turfs
    const savedTurfs = [];
    for (let user of users) {
        for (let i = 0; i < 3; i++) {
            savedTurfs.push({
                userId: user._id,
                turfId: turfs[(i + 1) % turfs.length]._id,
                savedAt: new Date(),
            });
        }
    }
    await SavedTurf.insertMany(savedTurfs);

    console.log('Seed data created successfully');
    mongoose.connection.close();
}


// Function to close connection gracefully
async function disconnect() {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
        }
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}

export { connect, disconnect, addDatesAndSlotsToAllTurfs }