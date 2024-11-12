import { Turf } from '@/models/model'; // Updated import for schema
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      id,
      name,
      owner,
      description,
      pricePerHour,
      city,
      availableSlots,
      images,
      amenities,
      turfCategory,
      dimensions,
      locationCoordinates,
    } = reqBody;

    // Check if any field is missing
    // if (!id || !name || !owner || !description || !pricePerHour || !city || !availableSlots || !images || !amenities || !turfCategory || !dimensions || !locationCoordinates) {
    //   console.log("field missing")
    //   return NextResponse.json(
    //     { error: "All fields are required." },
    //     { status: 400 }
    //   );
    // }

    const turf = await Turf.findById(id);
    if (!turf) {
      console.log("Turf not found")
      return NextResponse.json(
        { error: "Turf not found." },
        { status: 404 }
      );
    }

    turf.name = name;
    turf.owner = owner;
    turf.description = description;
    turf.pricePerHour = pricePerHour;
    turf.city = city;
    turf.availableSlots = availableSlots;
    turf.images = images;
    turf.amenities = amenities;
    turf.turfCategory = turfCategory;
    turf.dimensions = dimensions;
    turf.locationCoordinates = locationCoordinates;

    const savedTurf = await turf.save();
    return NextResponse.json({
      message: "Turf edited successfully",
      success: true,
      savedTurf,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
