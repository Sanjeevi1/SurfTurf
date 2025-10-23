import { User } from '@/models/model'; // Updated import for schema
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { connect } from '@/dbconfig/dbconfig';

connect();

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const userId = getDataFromToken(request);
    const currentUser = await User.findById(userId);
    
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: "Access denied. Admin role required." }, { status: 403 });
    }

    const reqBody = await request.json();
    const {
      email
    } = reqBody;
    

    const user = await User.findOne({email:email});

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.role='owner';
    await user.save();
    
    return NextResponse.json({
      message: "Turf Owner created successfully",
      success: true,
      
    });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
