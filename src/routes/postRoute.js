const express=require("express")
const router=express.Router()
const mongoose=require("mongoose")
const Post=require("../models/Post.model")
const jwt=require("jsonwebtoken")
const User=require("../models/User.model")


require("dotenv").config()






// router.post("/createPost", async( req, res)=>{
//     try {
//         const post=await Post.create(req.body)
//         return res.status(200).json({message:"Post created successfully"})
        
//     } catch (error) {
//         return res.status(400).json({message:error})
        
//     }
// })



router.post('/setprofilepic', (req, res) => {
    const { email, profilepic } = req.body;


    // console.log("email: ", email);
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Credentials" })
            }
            savedUser.profilepic = profilepic;
            savedUser.save()
                .then(user => {
                    res.json({ message: "Profile picture updated successfully" })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
})

router.post('/addpost', (req, res) => {
    const { email, post, postdescription } = req.body;

    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(400).json({ error: "Invalid Credentials" })
            }
            savedUser.posts.push({ post, postdescription, likes: [], comments: [] });
            savedUser.save()
                .then(user => {
                    res.json({ message: "Post added successfully" })
                })
                .catch(err => {
                    res.json({ error: "Error adding post" })
                })
        })
        .catch(err => {
            console.log(err);
        })
})


router.get("/getAllPosts", async( req, res)=>{
  const {username}=req.body 

   const savedPosts=await Post.find({username})

  if(!savedPosts){

    return res.status(400).json({error:"You have not create any post yet"})

  }else{
    console.log("savedPosts",savedPosts)

    res.status(200).json({message:"Posts Fetched Successfully",post:savedPosts})

  }


})

module.exports=router