import { configureStore } from "@reduxjs/toolkit";
import propertySlice from "./Property/property-slice.js";
import propertyDetailsSlice from "./PropertyDetails/propertyDetails-slice.js";
const store = configureStore({
    reducer:{
        properties:propertySlice.reducer,
        propertydetails:propertyDetailsSlice.reducer
    }
})

export default store;