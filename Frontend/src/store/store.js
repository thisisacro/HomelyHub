import { configureStore } from "@reduxjs/toolkit";
import propertySlice from "./Property/property-slice.js";
import propertyDetailsSlice from "./PropertyDetails/propertyDetails-slice.js";
import userSlice from "./user/user-slice.js";
import bookingSlice from "./Booking/booking-slice.js"

const store = configureStore({
    reducer:{
        properties:propertySlice.reducer,
        propertydetails:propertyDetailsSlice.reducer,
        user:userSlice.reducer,
        booking:bookingSlice.reducer
    }
})

export default store;