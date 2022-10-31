const mongoose=require("mongoose")

const postSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
        unique:true
    },
    profile_image:{
        type:String,
        required:true

    },
    likes:{
        type:Array,
        default:[],

    },
    comments:{
        type:Array,
        default:[]
    },
   



})


module.exports=mongoose.model("post",postSchema)