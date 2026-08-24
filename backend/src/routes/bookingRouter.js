import express from "express"
const bookingRouter = express.Router()
import {getBookingDetails,getUserBookings,createOrder,verifyPayment} from "../controllers/bookingController.js"
import {protect} from "../controllers/authController.js"
//protect is middleware used to check wheter user is logged in before accessing apis
bookingRouter.get("/",protect,getUserBookings)
bookingRouter.get("/:bookingId",protect,getBookingDetails)
bookingRouter.post("/create-order",protect,createOrder)
bookingRouter.post("/verify-payment",protect,verifyPayment)


export{bookingRouter};
