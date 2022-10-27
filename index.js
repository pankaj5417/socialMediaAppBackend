const express=require("express")
const app=express()
const PORT=process.env.PORT||8000
 require("./configs/db")

 const authRoute=require("./src/routes/authRoute")

 app.use(express.json())
 app.use("/auth",authRoute)
 app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
 })
