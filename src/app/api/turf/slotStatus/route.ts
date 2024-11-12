import { connect } from '@/dbconfig/dbconfig';
import { Turf } from '@/models/model';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { id, startTime, endTime, date } = reqBody;
    console.log("Request body:", reqBody);

    // Find the turf by its ID
    const turf = await Turf.findById(id);

    if (!turf) {
      return NextResponse.json({
        message: "Turf not found",
        success: false,
      }, { status: 404 });
    }

    let slotUpdated = false;

    // Loop through availableSlots to find the correct date
    for (let slotDate of turf.availableSlots) {
      if (slotDate.date.toISOString().split("T")[0] === date) {
        // Loop through slots within the matched date
        for (let slot of slotDate.slots) {
          if (slot.startTime === startTime && slot.endTime === endTime) {
            // Toggle the status of the slot
            console.log(slot.status)
            slot.status = slot.status === "locked" ? "unlocked" : "locked";
            slotUpdated = true;

            break;
          }
        }
      }
      if (slotUpdated) break;
    }

    console.log(turf)
    // If no slot was updated, return an error response
    console.log(slotUpdated)
    if (!slotUpdated) {
      return NextResponse.json({
        message: "Slot not found",
        success: false,
      });
    }

    // Mark the modified field for Mongoose to save changes
    turf.markModified('availableSlots');
    await turf.save();

    return NextResponse.json({
      message: "Slot status changed successfully",
      success: true,
      data: turf.availableSlots,
    });

  } catch (error: any) {
    console.log("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
