const express=require("express")
const router=express.Router()
const mongoose=require("mongoose")
const User=require("../models/User.model")
const jwt=require("jsonwebtoken")
const nodemailer=require("nodemailer")
const bcrypt= require("bcrypt")

require("dotenv").config()


async function mailer(recievermail, code){

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS:true,
        auth: {
          user: process.env.NODEMAILER_EMAIL, // generated ethereal user
          pass: process.env.NODEMAILER_PASSWORD, // generated ethereal password
        },
      });

      let info = await transporter.sendMail({
        from: 'pk@gmail.com', // sender address
        to: recievermail, // list of receivers
        subject: "Email Verification", // Subject line
        text: `Your verificaton code is ${code}`, // plain text body
        html: `<b>Your verificaton code is ${code}</b>`, // html body
      });
    
       console.log("Message sent: %s", info.messageId);
       console.log("Preview URL:%s",nodemailer.getTestMessageUrl(info))
    

}
router.post("/verify", async(req, res)=>{
    const {email}= req.body
    if(!email){
        return res.status(422).json({error:"Please provide a valid email address"})
    }else{
      const savedUser=await  User.findOne({email:email})
      console.log("saveduser",savedUser)
      
      if(savedUser){
        return res.status(422).json({error:"Invalid Credentials"})
      }
      try {
        let verificationCode= Math.floor(100000+Math.random()*900000)
        await mailer(email, verificationCode)
        return res.status(200).json({message:"Verification Code sent to your email",email,verificationCode})

        
      } catch (error) {
        return res.status(400).json({error:error})
      }
    }

})


router.post("/changeUsername", async( req, res)=>{
    const {email,username}=req.body
    const savedUser=await User.find({username})

    if(savedUser.length>0){
        return res.status(400).json({error:"Username already exists"})
    }else{
        return res.status(200).json({message:"Username available",username,email})
    }
})

router.post("/signup",async( req, res)=>{
    const {username,password,email}=req.body 
    if(!username||!email||!password){
        return res.status(400).json({error:"Please add all the fields"})
    }else{
        const user=new User({
            username,
            email,
            password
        })
        try {
           await user.save()
           const token= jwt.sign({_id:user._id},process.env.JWT_SECRET)
           return res.status(200).json({message:"User Registered successfully",token})
            
        } catch (error) {
            console.log("error",error)
            return res.status(400).json({message:"User not Registered"})

        }
    }
     
})

// forgot password

router.post("/verifyfp", async(req, res)=>{
    const {email}= req.body
    if(!email){
        return res.status(422).json({error:"Please provide a valid email address"})
    }else{
      const savedUser=await  User.findOne({email:email})
      console.log("saveduser",savedUser)
      
      if(savedUser){
        try {
            let verificationCode= Math.floor(100000+Math.random()*900000)
            await mailer(email, verificationCode)
            return res.status(200).json({message:"Verification Code sent to your email",email,verificationCode})
    
            
        } catch (error) {
            console.log(error) 
            
        }
       
      }else{
        return res.status(422).json({error:"Invalid Credentials"})

      }
     
    }

})

router.post("/resetpassword", async(req, res)=>{
    const {email,password}=req.body 
if(!email||!password){
    return res.status(400).json({error:"Please add all the fields"})

}else{
    const savedUser=await User.findOne({email:email})
    if(savedUser){
        savedUser.password=password 
      const user=await  savedUser.save()
      console.log("user",user)
      return res.status(200).json({message:"Password changed successfully"})
    }else{
        return res.status(400).json({error:"Invalid Credentials"})
    }
}

     
})


// login

router.post("/signin", async(req, res)=>{
    const {email,password}=req.body 
if(!email||!password){
    return res.status(400).json({error:"Please add all the fields"})

}else{
    const savedUser=await User.findOne({email:email})
    if(!savedUser){
        return res.status(400).json({error:"Invalid Credentials"})

      
    }else{
      const match= await bcrypt.compare(password,savedUser.password)
      if(match){
     const token= jwt.sign({_id:savedUser._id},process.env.JWT_SECRET)
       const {_id,email,username}=savedUser
       return res.status(200).json({message:"Signed in successfully",token,user:{_id,username,email}})
      }else{
        return res.status(400).json({error:"Invalid Credentials"})
      }
    }

}   
})

// userdata

// router.post("/userdata", async( req, res)=>{
//   const {email}=req.body 
//   const savedUser=await User.findOne({email:email})
//   if(!savedUser){
//     return res.status(400).json({error:"Invalid credentials"})
//   }else{
//     console.log("savedUser",savedUser)

//     res.status(200).json({message:"User Data Fetched Successfully",user:savedUser})
//   }


// })

router.post("/userdata", async( req, res)=>{
  const {authorization}=req.headers;

  if(!authorization){
    return res.status(401).json({error:"You must be logged in, token not given"})
  }
  const token= authorization.split(" ")[1]
  console.log("token", token);

  jwt.verify(token,process.env.JWT_SECRET,async( err, payload)=>{
    if(err){
      return res.status(401).json({error:"You must be logged in,token invalid"})

    }

    const {_id}=payload

  const userdata=await  User.findById(_id)
  return res.status(200).json({message:"User Data Fetched Successfully",user:userdata})

  })
  
})

module.exports=router