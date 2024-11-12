import { connect } from '@/dbconfig/dbconfig'
import { User } from '@/models/model'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { error } from 'console'

connect()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { email, password } = reqBody
    console.log(reqBody)

    //check if user exists
    const user = await User.findOne({ email })
    console.log(user._id)
    if (!user) {
      return NextResponse.json({ error: "User doesn't exist" }, { status: 400 })
    }

    //check if password is correct
    // const validPassword = await bcryptjs.compare(password, user.password)

    // if (!validPassword) {
    //   return NextResponse.json({ error: "Invalid password" }, { status: 400 })
    // }


    //create token data(in local storage the token can be manipulated)
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email
    }
    //token data-payload
    //create token//signature created
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" })

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      user
    })

    response.cookies.set("token", token, { httpOnly: true })//cookie cannot be accessed or modified through client-side JavaScript (e.g., using document.cookie).

    return response;




  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}