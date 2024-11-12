import { User } from '@/models/model'; // Updated import for schema
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {
      email
    } = reqBody;
    

    const user = await User.findOne({email:email});

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
