import { connect } from '@/dbconfig/dbconfig'
import { User } from '@/models/model'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from "bcryptjs"
import { error } from 'console'

connect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { username, password, email,phn } = reqBody
    console.log(reqBody)

    //check if user already exists
    const user = await User.findOne({ email })
    if (user) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    //hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    //creating new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone:phn,
      role:'user'
    })

    const savedUser = await newUser.save();
    console.log(savedUser)

    //send verification email
    // await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser
    })
  } catch (error: any) {
    console.log(error.message)
    return NextResponse.json({ error: error.message },
      { status: 500 }
    )

  }
}