import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig'; // Adjust the import based on your folder structure
import { User } from '@/models/model'; // Adjust the import based on your folder structure

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await connect();

        // Retrieve the review by ID
        const review = await User.findById(id);

        if (!review) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: review }, { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}