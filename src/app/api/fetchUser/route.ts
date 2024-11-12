import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/model";
import { connect } from "@/dbconfig/dbconfig";
import mongoose from "mongoose";

connect();

export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();  // Extract userID from request body
        console.log("Received ID:", id);

        // Check if the `id` is valid as a MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid user ID format");
        }

        // Convert the `id` to an ObjectId and query the database
        const user = await User.findOne({ _id: id })
        console.log("User data:", user);

        if (!user) {
            throw new Error("User not found");
        }

        return NextResponse.json({
            message: "User found",
            data: user
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
