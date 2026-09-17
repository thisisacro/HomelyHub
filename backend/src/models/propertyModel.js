import slugify from "slugify"
import mongoose from "mongoose"

const propertySchema = new mongoose.Schema({
    propertyName:{
        type:String,
        required:[true,"Please enter your property name"]
    },
    description:{
        type:String,
        required:[true,"Please add infromation about your property"]
    },

    extraInfo:{
        type:String,
        default:"Standard checkin and checkout time applicable"
    },
    propertyType:{
        type:String,
        enum:["House","Flat","Guest House","Hotel"],
        default: "House"
    },
    roomType:{
        type:String,
        enum:["AnyType","Room","Entire Home"],
        default: "AnyType"
    },
    maximumGuest:{
        type:Number,
        required:[true,"Please give the maximum no. of guests that can occupy"]
    },
    amenities:[
        {
            name:{
                type:String,
                required:true,
                enum:["Wifi","Kitchen","AC","Washing Machine","TV","Pool","Free parking"]                
            },
            icon:{
                type:String,
                required:true
            }
        }
    ],
    images:{
        type:[
            {
                public_id:{
                    type:String
                },
                url:{
                    type:String,
                    required:true
                }
            }
        ],
        //disable listing with less than 6 pics
        validate:{
            validator:function(arr){
                return arr.length >= 6;
            },
            message: "Must contain atleast 6 images"
        }
    },
    price:{
            type:Number,
            required:[true,"Please enter the price per night"],
            default:1500
        },
        address:{
            area:String,
            city:String,
            state:String,
            pincode:Number
        },
        currentBookings:[
            {
                bookingId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Booking"
                },
                fromdate:{
                    type:Date
                },
                toDate:{
                    type:Date
                },
                userId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User"
                }
            }
        ],

        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },

        slug:String,

        checkInTime:{
            type:String,
            default:"11:00"
        },
        checkOutTime:{
            type:String,
            default:"13:00"
        }
})

//create slug automatically 
propertySchema.pre("save",function(){
    this.slug= slugify( this.propertyName,{lower:true})
})

propertySchema.pre("save",function(){
    this.address.city = this.address.city.toLowerCase().replaceAll(" ","")
    
})

const Property= mongoose.models.Property|| mongoose.model("Property",propertySchema)
export{Property}