import { asyncHandler } from "../middlewares/asyncHandler.js";
import Errorhandler, { errorMiddleware } from "../middlewares/error.js";
import { User } from "../models/userSchema.js";


export const register = asyncHandler (async(req, res, next) => {
    const {name, email, passworrd, phone, role, education} = req.body;

    if(!name || !email || !passworrd || !phone || !role || !education){
        return next(new Errorhandler(" Please Provide All Details ", 400))
    }
    
    const user = await User.findOne({email})
    if(user){
        return next(new Errorhandler("User already Exists",400))
    }
    await User.create({
        name,
        email,
        password,
        phone,
        role,
        education,
    })
    res.status(200)
    .json({
        success: true,
        message: "User Registered"
    })

})

export const login = asyncHandler (async(req, res, next) => {
    const {email, password, role} = req.body;
    if(!email || !password || !role){
        return next(new Errorhandler("Please fill the form", 400))
    }
    
    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new Errorhandler("Invalid email or password", 400))
    }
    
    const isPasswordMatched = await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new Errorhandler("Invalid email or password", 400))
    }

    if(user.role !== role){
        return next(new Errorhandler("role not found",400))
    }

    sendToken(user, 200, "User logged in successfully", res);
})