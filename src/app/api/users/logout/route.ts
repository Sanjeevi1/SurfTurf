

import { NextResponse } from 'next/server'




//just clearing the token
export async function GET(){
  try{
    const response=NextResponse.json({
      message:"Logout successful",
      success:true,
    })
    //this response can interact with cookies
    //setting token empty//expiring it right now
    response.cookies.set("token","",{httpOnly:true,expires:new Date(0)})
    return response
  }catch(error:any){
    return NextResponse.json({error:error.message},{status:500})
  }
}