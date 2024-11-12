// pages/api/saved-turf.js
import { SavedTurf } from '@/models/model';
import { connect } from '@/dbconfig/dbconfig';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res) {
    const save = await req.json()
    const { userId, turfId } = save;
    console.log(save)

    await connect();

    // Check if the turf is already saved by this user
    const existingSave = await SavedTurf.findOne({ userId, turfId });
    if (existingSave) {
        return NextResponse.json({ message: 'Turf already saved.' });
    }

    try {
        const newSave = new SavedTurf({
            userId,
            turfId,
        });
        await newSave.save();
        return NextResponse.json({ message: 'Turf saved successfully.' });
    } catch (error) {
        return NextResponse.json({ message: 'Error saving turf.' });
    }
}


