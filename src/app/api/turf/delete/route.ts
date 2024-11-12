import { connect } from '@/dbconfig/dbconfig';
import {Turf} from '@/models/model';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Turf ID is required" }, { status: 400 });
    }

    const deletedTurf = await Turf.findByIdAndDelete(id);

    if (!deletedTurf) {
      return NextResponse.json({ error: "Turf not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Turf deleted successfully",
      success: true,
      deletedTurf
    });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
