import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./utils/db.js"
import {router} from "./routes/userRoute.js"
import { propertyRouter } from "./routes/propertyRouter.js"
import { bookingRouter } from "./routes/bookingRouter.js"

const app=express();

//middelwares

app.use(express.json({limit:"100mb"}))

app.use(express.urlencoded({limit:"100mb",extended:true}))

dotenv.config();


const PORT=process.env.PORT;

//pne route test
app.get("/",(req,res)=>{
    res.send("HomelyHub server is running")
})

app.use("/api/v1/rent/user",router)
app.use("/api/v1/rent/listing",propertyRouter)

app.use("/api/v1/rent/user/booking",bookingRouter)
connectDB();


app.listen(PORT,()=>{
    console.log(`App running on port: ${PORT}`);
})