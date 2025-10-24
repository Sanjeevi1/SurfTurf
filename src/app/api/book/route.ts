import { connect } from "@/dbconfig/dbconfig";

import { Booking, Turf, User } from "@/models/model"; // Adjust path as needed
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const a = await req.json();
    const { user, turfId, selectedDate, selectedSlot, totalCost, numberOfPlayers } = a;

    try {
        await connect();
        
        // For testing purposes, create a test user if user is a string
        let userId = user;
        if (typeof user === 'string') {
            // Try to find existing user or create a test user
            const existingUser = await User.findOne({ username: user });
            if (existingUser) {
                userId = existingUser._id;
            } else {
                // Create a test user for API testing
                const testUser = new User({
                    username: user,
                    email: `${user}@test.com`,
                    password: 'test123',
                    phone: '1234567890',
                    role: 'user'
                });
                await testUser.save();
                userId = testUser._id;
            }
        }
        const startOfDay = new Date(selectedDate);
        startOfDay.setUTCHours(0, 0, 0, 0); // Ensure we're comparing just the selectedDate
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Check if the booking already exists

        const existingBooking = await Booking.findOne({
            turf: turfId,
            bookingDate: { $gte: startOfDay, $lt: endOfDay },
            "timeSlot.startTime": selectedSlot.split("-")[0],
            "timeSlot.endTime": selectedSlot.split("-")[1],
        });
        const turf = await Turf.findOne({ _id: turfId });


        if (existingBooking) {
            return NextResponse.json({ message: "Booking already exists", booking: existingBooking });
        }

        // Create a new booking if it doesn't exist
        const newBooking = new Booking({
            user: userId, // Use the processed user ID
            turf: turfId,
            bookingDate: selectedDate,
            timeSlot: {
                startTime: selectedSlot.split("-")[0],
                endTime: selectedSlot.split("-")[1],
            },
            numberOfPlayers: numberOfPlayers,
            totalPrice: totalCost,
            status: "completed", // Set the status as 'completed'
            locked: false, // Release lock after successful booking
            paymentStatus: "completed", // Assuming payment is successful
        });

        await newBooking.save();

        // Get the turf document for direct manipulation if needed
        const turfToUpdate = await Turf.findById(turfId);
        if (!turfToUpdate) {
            console.error("Turf not found:", turfId);
            return NextResponse.json({ message: "Turf not found" }, { status: 404 });
        }

        console.log("Booking update - Looking for turf:", turfId);
        console.log("Booking update - Looking for date:", new Date(startOfDay));
        console.log("Booking update - Looking for slot:", selectedSlot.split("-")[0].trim(), "to", selectedSlot.split("-")[1].trim());

        // Try with both date formats
        let updateResult = await Turf.updateOne(
            {
                _id: turfId,
                "availableSlots.date": new Date(startOfDay), // Match the specific date
            },
            {
                $set: {
                    "availableSlots.$.slots.$[slot].isBooked": true,
                    "availableSlots.$.slots.$[slot].status": "locked",
                },
            },
            {
                arrayFilters: [
                    {
                        "slot.startTime": selectedSlot.split("-")[0].trim(), // Match the start time of the slot
                        "slot.endTime": selectedSlot.split("-")[1].trim(),   // Match the end time of the slot
                    },
                ],
            }
        );

        // If no slots were modified, try with startOfDay format
        if (updateResult.modifiedCount === 0) {
            console.log("Trying with startOfDay format...");
            updateResult = await Turf.updateOne(
                {
                    _id: turfId,
                    "availableSlots.date": startOfDay,
                },
                {
                    $set: {
                        "availableSlots.$.slots.$[slot].isBooked": true,
                        "availableSlots.$.slots.$[slot].status": "locked",
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
            );
        }

        console.log("Booking update result:", updateResult);
        
        // If all update attempts failed, try direct document manipulation
        if (updateResult.modifiedCount === 0) {
            console.log("Trying direct document manipulation...");
            
            const startTime = selectedSlot.split("-")[0].trim();
            const endTime = selectedSlot.split("-")[1].trim();
            
            // Find the correct date slot
            const dateSlot = turfToUpdate.availableSlots.find((slot: any) => {
                const slotDate = new Date(slot.date);
                const targetDate = new Date(selectedDate);
                slotDate.setUTCHours(0, 0, 0, 0);
                targetDate.setUTCHours(0, 0, 0, 0);
                return slotDate.getTime() === targetDate.getTime();
            });
            
            if (dateSlot) {
                // Find the correct time slot
                const timeSlot = dateSlot.slots.find((slot: any) => 
                    slot.startTime === startTime && slot.endTime === endTime
                );
                
                if (timeSlot) {
                    timeSlot.isBooked = true;
                    timeSlot.status = "locked";
                    
                    // Mark the document as modified and save
                    turfToUpdate.markModified('availableSlots');
                    await turfToUpdate.save();
                    
                    console.log("Slot updated successfully via direct manipulation");
                    updateResult = { 
                        modifiedCount: 1, 
                        acknowledged: true, 
                        matchedCount: 1, 
                        upsertedCount: 0, 
                        upsertedId: null 
                    };
                } else {
                    console.error("Time slot not found:", { startTime, endTime });
                }
            } else {
                console.error("Date slot not found for date:", selectedDate);
            }
        }
        
        if (updateResult.modifiedCount === 0) {
            console.error("Slot update failed: No slots were modified.");
            return NextResponse.json({ 
                message: "Failed to update slot status", 
                error: "Slot not found or already booked" 
            }, { status: 400 });
        }

        return NextResponse.json({ message: "Booking created successfully", booking: newBooking });
    } catch (error: any) {
        console.error("Error confirming booking:", error);
        console.error("Error details:", error.message);
        return NextResponse.json({ 
            error: "Internal server error",
            details: error.message 
        });
    }
}

export async function GET(req: Request) {
    const a = await req.json();
    const { turfId, date } = a
    try {
        await connect();
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0); // Ensure we're comparing just the selectedDate
        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Find bookings for the selected date and turf
        const bookings = await Booking.find({
            turf: turfId,
            bookingDate: { $gte: startOfDay, $lt: endOfDay },
        });
        console.log(bookings);
        // Extract booked time slots from bookings
        const bookedSlots = bookings.map(
            (booking) => `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}`
        );

        return NextResponse.json({ bookedSlots });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({ error: "Internal server error" });
    }
}