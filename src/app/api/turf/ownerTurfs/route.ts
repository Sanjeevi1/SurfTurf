// pages/api/customer/turf/route.ts

import { connect } from "@/dbconfig/dbconfig";
import { Turf, User } from '@/models/model';
import { NextResponse } from "next/server";

// POST handler for fetching turfs by different criteria for a specific user
export async function POST(req: Request) {
    await connect();

    try {
        const { id, location, date, city, category } = await req.json();
        console.log(id)
        // Fetch the user by ID
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" });
        }

        // Base query to fetch turfs owned by the user
        const query: any = { owner: user._id };

        // Apply additional filters
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
            query.category = category;
        }

        // Fetch turfs based on the combined query
        const turfs = await Turf.find(query);

        // If `city` parameter is provided, return only unique cities as response
        if (city) {
            const uniqueCities = Array.from(new Set(turfs.map(turf => turf.city)))
                .map(cityName => ({ name: cityName, code: cityName }));
            return NextResponse.json(uniqueCities);
        }

        // Return the filtered turfs
        return NextResponse.json(turfs);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Internal Server Error" });
    }
}
