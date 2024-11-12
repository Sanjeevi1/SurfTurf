import { Turf } from '@/models/model'; // Updated import for schema
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
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

    const newTurf = new Turf({
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
    });
    console.log(reqBody);
    const savedTurf = await newTurf.save();
    return NextResponse.json({
      message: "Turf created successfully",
      success: true,
      savedTurf,
    });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
