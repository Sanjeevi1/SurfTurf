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

        const turfBookings = await Booking.find({ user: id });

        // If no bookings were found, return a 404 response
        if (!turfBookings.length) {
            return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
        }

        // Return the bookings as a JSON response
        return NextResponse.json({ success: true, data: turfBookings }, { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
