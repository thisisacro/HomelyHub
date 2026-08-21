//security guard of the app
import JWT from "jsonwebtoken"
import {User} from "../Models/userModel.js"
import jwt from "jsonwebtoken"
import crypto from "node:crypto"
import imagekit from "../utils/ImagekitIO.js"
import { sendMail, forgotPasswordMailGenContent } from "../utils/mail.js"
import { signinToken, createSendToken, defaultAvatarUrl, filterObj } from "../utils/token.js"
import { request } from "node:http"
import { error } from "node:console"

//signup:account creation

const signup= async(req,res)=>{
    try{
        const newUser=await User.create({
            name:req.body.name,
            email:req.body.email,
            phoneNumber:req.body.phoneNumber,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
            avatar:{url:req.body.avatar || defaultAvatarUrl(req.body.name)}
        })
        createSendToken(newUser,201,res)
    }catch(error){
        // const duplicateFeild= Object.keys(error.keyPattern||{})[0]
        // const message= duplicateFeild ? `An account wuth that ${duplicateFeild} already exists`:error.message
        res.status(400).json({message:error.message})
    };
    
}

//login: check email password, then give token

const login= async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password){
            throw new Error("Please provide email or password")
        }
         const user = await User.findOne({email}).select("+password")
        if(!user||(await user.correctPassword(password,user.password))===false){
            throw new Error("Incorrect email or password")
        }
        createSendToken(user,200,res)
    }catch(error){
        res.status(401).json({status:"fail",message:error.message})
    }
   
}


//protect
const protect= async(req,res,next)=>{
    try{
        let token
        //token present in request header
        if(
            req.headers.authorization && req.headers.authorization.startsWith("Bearer")
        ){
            token = req.headers.authorization.split(" ")[1]
        }
        //token is in cookies
        else if(req.cookies.jwt && req.cookies.jwt !== "loggedout"){
            token= req.cookies.jwt
        }

        //step 2: no token so stop here
        if(!token){
            throw new Error("You are not logged it! Please login to access")
        }

        //step 3:Check if token is real?
        const decoded= jwt.verify(token,process.env.JWT_SECRET)

        //step 4: token is real but does the suer still exist
        const currentUser = await User.findById(decoded.id)
        if(!currentUser){
            throw new Error("User belonging to token does not exist")
        }
        //step 5: Stolen token case
        //if token is chagned before password change then it must be invalid

        if(currentUser.changedPasswordAfter(decoded.iat)){//iat= issued at
            throw new Error("user recently changed the password. Please login again")
        }

        //Step 6: all checks passed
        req.user=currentUser
        next()
    }catch(error){
        res.status(401).json({
            status:"fail",
            message: "error.message"
        })
    }
}
export {signup,login,protect}
