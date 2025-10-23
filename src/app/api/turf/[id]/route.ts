import { connect } from '@/dbconfig/dbconfig';
import { Turf } from '@/models/model';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        await connect();
        
        
        const turf = await Turf.findById(id);

        if (!turf) {
            return NextResponse.json({ success: false, error: 'Turf not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: turf }, { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
