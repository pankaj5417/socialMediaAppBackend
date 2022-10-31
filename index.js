const express=require("express")
const app=express()
const PORT=process.env.PORT||8000
 require("./configs/db")

 const authRoute=require("./src/routes/authRoute")
 const postRoute=require("./src/routes/postRoute")


 app.use(express.json())
 app.use("/auth",authRoute)
 app.use("/post",postRoute)


 app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
 })
