import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';



export const sendEmail=async({email,emailType,userId}:any)=>{
  try {
    //create hashed token
    const hashedToken=await bcryptjs.hash(userId.toString(),10);
    console.log("done")
    //changing db
    if(emailType==="VERIFY"){
      await User.findByIdAndUpdate(userId,
        {verifyToken:hashedToken,
          verifyTokenExpiry:Date.now()+3600000
        })//1 hour = 60 minutes × 60 seconds × 1000 milliseconds)
    }else if(emailType==="RESET"){
      await User.findByIdAndUpdate(userId,
        {forgotPasswordToken:hashedToken,
          forgotPasswordTokenExpiry:Date.now()+3600000
        }
      )
    }
    //from mailtrap-email delivery platform
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        //can be added to .env file and used
        user: "92436e01fe79cd",
        pass: "d87bf951c93d09"
      }
    });
    let sendUrl=""
    if (emailType==="VERIFY"){
      sendUrl=`${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
    }else if(emailType==="RESET"){
      sendUrl=`${process.env.DOMAIN}/changePwd?token=${hashedToken}`
    }

    const mailOptions={
      from:'sangee@gmail.com',
      to:email,
      subject:emailType==="VERIFY"?"Verify your email":"Reset your password",
      html: `<p>Click <a href=${sendUrl}>here</a> to ${emailType==="VERIFY"?"Verify your email":"Reset your password"}</p>`
    }

    const mailResponse=await transport.sendMail(mailOptions)
    return mailResponse;
    
  } catch (error:any) {
    console.log(error.message)
    throw new Error(error.message)
    
  }

}
