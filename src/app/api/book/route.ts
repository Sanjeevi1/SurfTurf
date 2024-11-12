import { connect } from "@/dbconfig/dbconfig";

import { Booking, Turf } from "@/models/model"; // Adjust path as needed
import { NextResponse } from "next/server";

export async function POST(req, res) {
    const a = await req.json();
    const { user, turfId, selectedDate, selectedSlot, totalCost, numberOfPlayers } = a;

    try {
        await connect();
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
            user: user, // Assuming you have user info from session/auth
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

        const updateResult = await Turf.updateOne(
            {
                _id: turfId,
                "availableSlots.date": new Date(startOfDay), // Match the specific date
            },
            {
                $set: {
                    "availableSlots.$.slots.$[slot].isBooked": true,
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


        console.log(updateResult);
        if (updateResult.modifiedCount === 0) {
            console.error("Slot update failed: No slots were modified.");
        }

        return NextResponse.json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error("Error confirming booking:", error);
        NextResponse.json({ error: "Internal server error" });
    }
}

export async function GET(req, res) {
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
        console.log(bookings)
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
