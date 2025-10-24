import { SavedTurf } from '@/models/model';
import { connect } from '@/dbconfig/dbconfig';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { userId, turfId } = await req.json();
        
        if (!userId || !turfId) {
            return NextResponse.json({ 
                message: 'User ID and Turf ID are required' 
            }, { status: 400 });
        }

        await connect();

        // Find and delete the saved turf entry
        const deletedSave = await SavedTurf.findOneAndDelete({ 
            userId, 
            turfId 
        });

        if (!deletedSave) {
            return NextResponse.json({ 
                message: 'Saved turf not found' 
            }, { status: 404 });
        }

        return NextResponse.json({ 
            message: 'Turf removed from saved successfully' 
        });

    } catch (error: any) {
        console.error('Error unsaving turf:', error);
        return NextResponse.json({ 
            message: 'Error removing turf from saved' 
        }, { status: 500 });
    }
}
