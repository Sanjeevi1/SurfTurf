import { NextResponse } from "next/server";
import { connect } from '@/dbconfig/dbconfig';
import { Booking, Turf } from '@/models/model';

export async function POST(req) {
    try {
        // Parse the request body to get the 'id'
        const { id } = await req.json();
        
        // Connect to the database
        await connect();

        // Find turfs based on the provided owner id
        const turfs = await Turf.find({ owner: id });
        console.log(turfs);

        let bookings = [];

        // For each turf, find the associated bookings
        for (const turf of turfs) {
            const turfBookings = await Booking.find({ turf: turf._id });
            bookings.push(...turfBookings); // Add all bookings for this turf to the bookings array
        }

        // If no bookings were found, return a 404 response
        if (!bookings.length) {
            return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
        }

        // Return the bookings as a JSON response
        return NextResponse.json({ success: true, data: bookings }, { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
