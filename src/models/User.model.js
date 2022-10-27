const mongoose=require("mongoose")
const bcrypt= require("bcrypt")
const saltRounds=10;
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true

    },
    profilepic:{
        type:String,
        default:"",

    },
    posts:{
        type:Array,
        default:[]
    }

})

userSchema.pre("save", async function(next){
    const user=this;
    if(!user.isModified("password")){
        console.log("just before hashing password",user.password);
        return next()
    }

    user.password=await bcrypt.hash(user.password, saltRounds)
    console.log("just after hashing password", user.password)
    next()

})
module.exports=mongoose.model("user",userSchema)