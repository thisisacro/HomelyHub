//logic to get all properties or one property based on id

import { Property} from "../models/propertyModel.js";
import { APIFeatures } from "../utils/APIFeatures.js";
import imagekit  from "../utils/ImagekitIO.js";

//get all properties

const getProperties= async(req,res)=>{
    try{
        const features= new APIFeatures(Property.find(),req.query)
        .filter()
        .search()
        .paginate();

        const AllProperties = await Property.find();

        const doc=await features.query

        res.status(200).json({
            status:"success",
            no_of_responses:doc.length,
            data:doc
        })
    }
    // catch(error){
    //     console.error("Error in searching properties")
    //     res.status(500).json({error:"Internal Server Error"})
    // }
    catch(error){
    console.error("Error in searching properties:", error);

    res.status(500).json({
        error: error.message
    });
}
}

//get properties by id
//http://localhost:8080/api/v1/rent/listing/:id

const getProperty = async(req,res)=>{
    try{
        const property = await Property.findById(req.params.id)

        res.status(200).json({
            status:"success",
            data: property
        })
    }
    catch(error){
        res.status(404).json({
            status:"failed",
            message: error.message
        })
    }
}

export {getProperties,getProperty}