const express=require("express")
const router=express.Router()
const mongoose=require("mongoose")
const User=require("../models/User.model")
const jwt=require("jsonwebtoken")
require("dotenv").config()


async function mailer(recievermail, code){

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS:true,
        auth: {
          user: process.env.NODEMAILER_EMAIL, // generated ethereal user
          pass: process.env.NODEMAILER_PASSWORD, // generated ethereal password
        },
      });

      let info = await transporter.sendMail({
        from: 'pk', // sender address
        to: recievermail, // list of receivers
        subject: "Email Verification", // Subject line
        text: `Your verificaton code is ${code}`, // plain text body
        html: `<b>Your verificaton code is ${code}</b>`, // html body
      });
    
       console.log("Message sent: %s", info.messageId);
    

}
router.post("/verify", async(req, res)=>{
    const {email}= req.body
    if(!email){
        return res.status(422).json({error:"Please provide a valid email address"})
    }else{
      const savedUser=await  User.findOne({email:email})
      
      if(savedUser){
        return res.status(422).json({error:"Invalid credentials"})
      }
      try {
        let verificationCode= Math.floor(100000+Math.random()*900000)
        await mailer(email, verificationCode)
        return res.status(200).json({message:"Email sent",email,verificationCode})

        
      } catch (error) {
        return res.status(400).json({error:error})
      }
    }

})


module.exports=router