import { asyncHandler } from "../middlewares/asyncHandler.js";
import Errorhandler, { errorMiddleware } from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary"


export const register = asyncHandler (async(req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new Errorhandler("User Avater Required", 400))
    }
    const{ avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"]
    if(!allowedFormats.includes(avatar.mimetype)){
        return next(new Errorhandler("Invalid file type; Please provide your avatar in png, jpg or webp format", 400))
    }


    const {name, email, password, phone, role, education} = req.body;

    if(!name || !email || !password || !phone || !role || !education || !avatar){
        return next(new Errorhandler(" Please Provide All Details ", 400))
    }
    
    let user = await User.findOne({email})
    if(user){
        return next(new Errorhandler("User already Exists",400))
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath
    )
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
          "Cloudinary error: ",
          cloudinaryResponse.error || "Unknown Cloudinary error"
        );
        return next(new Errorhandler("Error uploading avatar to Cloudinary", 500));
      }

    user = await User.create({
        name,
        email,
        password,
        phone,
        role,
        education,
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        }
    })
    sendToken(user, 200, "User registered successfully", res)

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

export const logout = asyncHandler(async(req, res, next) => {
    res.status(200).cookie("token", "",{
        expires: new Date(Date.now()),
        httpOnly: true
    })
    .json({
        success: true,
        message: "User Logged Out"
    })
})

export const getMyProfile = asyncHandler((req, res, next) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  });
  
export const getAllAuthors = asyncHandler(async (req, res, next) => {
    const authors = await User.find({ role: "Author" });
    res.status(200).json({
      success: true,
      authors,
    });
});

