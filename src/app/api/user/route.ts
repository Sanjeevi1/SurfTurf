import { connect, seedData } from '@/dbconfig/dbconfig';
import { User } from '@/models/model';
import { NextResponse } from 'next/server';
export async function GET(req, { params }) {
    const { id } = params;

    try {
        await connect();
        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user }, { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
