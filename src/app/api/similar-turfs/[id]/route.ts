import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { Turf } from "@/models/model";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> | null }) {
    try {
        await connect();
        
        if (!params) {
            return NextResponse.json({ 
                message: "Turf ID is required",
                success: false 
            }, { status: 400 });
        }
        
        const { id } = await params;

        // First, get the current turf to find its city and category
        const currentTurf = await Turf.findById(id);
        
        if (!currentTurf) {
            return NextResponse.json({ 
                message: "Turf not found",
                success: false 
            }, { status: 404 });
        }

        // Find similar turfs based on city and category
        let similarTurfs = [];
        try {
            similarTurfs = await Turf.find({
                _id: { $ne: id }, // Exclude the current turf
                $or: [
                    { city: currentTurf.city }, // Same city
                    { turfCategory: currentTurf.turfCategory }, // Same category
                ]
            }).limit(6); // Limit to 6 similar turfs
        } catch (error) {
            console.error("Error finding similar turfs:", error);
        }

        // If no similar turfs found, get any other turfs
        let fallbackTurfs = [];
        if (similarTurfs.length === 0) {
            try {
                fallbackTurfs = await Turf.find({
                    _id: { $ne: id }
                }).limit(6);
            } catch (error) {
                console.error("Error finding fallback turfs:", error);
            }
        }

        const finalTurfs = similarTurfs.length > 0 ? similarTurfs : fallbackTurfs;

        // Format the response to match what the frontend expects
        const formattedTurfs = finalTurfs.map(turf => ({
            _id: turf._id,
            id: turf._id,
            name: turf.name,
            city: turf.city,
            category: turf.turfCategory,
            turfCategory: turf.turfCategory,
            price: turf.pricePerHour,
            pricePerHour: turf.pricePerHour,
            image: turf.images?.[0] || null,
            images: turf.images || [],
            dimensions: turf.dimensions || { length: 0, width: 0 },
            amenities: turf.amenities || [],
            description: turf.description || '',
            availableSlots: turf.availableSlots || []
        }));

        return NextResponse.json({
            message: "Similar turfs fetched successfully",
            success: true,
            data: formattedTurfs
        });

    } catch (error: any) {
        console.error("Error fetching similar turfs:", error);
        return NextResponse.json({ 
            message: "Internal server error",
            success: false,
            error: error.message 
        }, { status: 500 });
    }
}
