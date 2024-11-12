import { connect } from '@/dbconfig/dbconfig';
import { Review } from '@/models/model';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req) {
    await connect();

    const { searchParams } = new URL(req.url); // Use searchParams to extract query parameters
    const turfId = searchParams.get('turfId');

    if (!turfId) {
        return NextResponse.json({ error: 'turfId is required' }, { status: 400 });
    }

    try {
        // Fetch reviews based on the provided turfId
        const reviews = await Review.find({ turf: turfId }).populate('user', 'username');
        return NextResponse.json(reviews);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await connect(); // Connect to your MongoDB
    const reqbody = await req.json()
    const { user, turf, rating, comment } = reqbody;

    if (!user || !turf || rating == null || !comment) {
        return NextResponse.json({ message: "All fields are required." });
    }

    try {
        const newReview = new Review({
            user,
            turf,
            rating,
            comment,
        });

        const savedReview = await newReview.save();
        return NextResponse.json(savedReview);
    } catch (error) {
        console.error("Error saving the review:", error);
        return NextResponse.json({ message: "Server error." });
    }

}
