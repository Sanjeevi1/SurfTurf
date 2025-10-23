import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbconfig'; // Adjust the import based on your folder structure
import { Review } from '@/models/model'; // Adjust the import based on your folder structure

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        await connect();

        // Retrieve the review by ID
        const review = await Review.findById(id);

        if (!review) {
            return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: review }, { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        await connect();

        // Retrieve the review by ID
        const review = await Review.findById(id);

        if (!review) {
            return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
        }

        // Determine the action to take (like or dislike)
        const { action } = await req.json(); // Expect { action: "like" } or { action: "dislike" }

        if (action === 'like') {
            review.like += 1; // Increment likes
        } else if (action === 'dislike') {
            review.dislike += 1; // Increment dislikes
        } else {
            return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        }

        await review.save(); // Save the updated review
        return NextResponse.json({ success: true, data: review }, { status: 200 });
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
