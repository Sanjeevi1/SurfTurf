// pages/api/saved-turf.js
import { SavedTurf } from '@/models/model';
import { connect } from '@/dbconfig/dbconfig';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest, res) {
    const user = await req.json();
    const { userId } = user
    await connect();

    // Check if the turf is already saved by this user
    const SavedTurfs = await SavedTurf.find({ userId });

    try {
        return NextResponse.json({ data: SavedTurfs, message: 'Turf fetched successfully.' });
    } catch (error) {
        NextResponse.json({ message: error });
    }
}
