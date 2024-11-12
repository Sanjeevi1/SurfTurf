// pages/api/customer/turf/route.ts

import { connect, addDatesAndSlotsToAllTurfs } from "@/dbconfig/dbconfig";
import { Turf } from '@/models/model';
import { NextResponse } from "next/server";
import mongoose from 'mongoose';



// Run the update script if needed (you can comment this out if not using it)
// updateTurfCities();

// GET handler for fetching turfs based on location and date
export async function GET(req: Request) {
    await connect();

    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    console.log(location);
    const city = location
    try {
        if (city) {

            const turfs = await Turf.find({});
            const uniqueCities = Array.from(new Set(turfs.map(turf => turf.city)))
                .map(city => ({ name: city, code: city }));

            // Fetch turfs based on the query
            return NextResponse.json(uniqueCities);
        }
        const turfs = await Turf.find({});

        // Fetch turfs based on the query
        return NextResponse.json(turfs);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Internal Server Error" });
    }
}

export async function POST(req: Request) {
    await connect();

    try {
        const { location, date, city, category } = await req.json();

        const query: any = {};

        if (city) {
            query.city = city;
        }

        if (location) {
            query.location = location;
        }

        if (date) {
            query.availableDates = { $in: [date] };
        }
        if (category) {
            query.availableDates = category;
        }

        const turfs = await Turf.find(query);

        return NextResponse.json(turfs);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Internal Server Error" });
    }
}
