import { asyncHandler } from "../middlewares/asyncHandler.js";
import Errorhandler, { errorMiddleware } from "../middlewares/error.js";
import {Blog} from "../models/blogSchema.js"
import cloudinary from "cloudinary"

export const blogPost = asyncHandler(async (req,res,next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new Errorhandler("Blog Main Image is Mandatory",400))
    }

    const {mainImage, paraOneImage, paraTwoImage, paraThreeImage} = req.files
    if(!mainImage){
        return next(new Errorhandler("Blog Main Image is Mandatory",400))
    }

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"]
    if(!allowedFormats.includes(mainImage.mimetype) 
    || (paraOneImage && !allowedFormats.includes(paraOneImage.mimetype)) 
    || (paraTwoImage && !allowedFormats.includes(paraTwoImage.mimetype)) 
    || (paraThreeImage && !allowedFormats.includes(paraThreeImage.mimetype))
    ){
        return next(new Errorhandler("invalid file type",400))
    }

    const {title, intro, paraOneDescription, paraOneTitle, paraTwoDescription, paraTwoTitle,  paraThreeDescription, paraThreeTitle, category} = req.body
    const createdBy = req.user._id
    const authorName = req.user.name
    const authorAvatar = req.user.avatar.url

    if(!title || !category || !intro){
        return next(new Errorhandler("Title, Intro and category are required fields", 400))
    }

    const uploadPromises = [
        cloudinary.uploader.upload(mainImage.tempFilePath), 
        paraOneImage ? cloudinary.uploader.upload(paraOneImage.tempFilePath) : Promise.resolve(null),
        paraTwoImage ? cloudinary.uploader.upload(paraTwoImage.tempFilePath) : Promise.resolve(null),
        paraThreeImage ? cloudinary.uploader.upload(paraThreeImage.tempFilePath) : Promise.resolve(null),
    ]

    const [mainImageRes, paraOneImageRes, paraTwoImageRes, paraThreeImageRes] = await Promise.all(uploadPromises)
    if(!mainImageRes || mainImageRes.error 
        || (paraOneImage && (!paraOneImageRes || paraOneImageRes.error))
        || (paraTwoImage && (!paraTwoImageRes || paraTwoImageRes.error))
        || (paraThreeImage && (!paraThreeImageRes || paraOneImageRes.error))
        ){
            return next(new Errorhandler("Error occured while uploading images",500))
    }
    const blogData = {
        title, 
        intro, 
        paraOneDescription, 
        paraOneTitle, 
        paraTwoDescription, 
        paraTwoTitle,  
        paraThreeDescription, 
        paraThreeTitle, 
        category,createdBy, 
        authorName, 
        authorAvatar,
        mainImage: {
            public_id: mainImageRes.public_id,
            url: mainImageRes.secure_url
        }
    }
    if(paraOneImageRes){
        blogData.paraOneImage = {
            public_id: paraOneImageRes.public_id,
            url: paraOneImageRes.secure_url
        }
    }
    if(paraTwoImageRes){
        blogData.paraTwoImage = {
            public_id: paraTwoImageRes.public_id,
            url: paraTwoImageRes.secure_url
        }
    }
    if(paraThreeImageRes){
        blogData.paraThreeImage = {
            public_id: paraThreeImageRes.public_id,
            url: paraThreeImageRes.secure_url
        }
    }

    const blog = await Blog.create(blogData)
    res.status(200)
    .json({
        success: true,
        message: "Blog uploaded Successfully",
        blog
    })
})

export const deleteBlog = asyncHandler(async(req, res, next) => {
    const { id } = req.params;
    const blog = await Blog.findById(id)
    if(!blog){
        return next(new Errorhandler("Blog not Found", 404))
    }
    await blog.deleteOne();
    res.status(200)
    .json({
        success: true,
        message: "Blog deleted!"
    })
})

export const getAllBlogs = asyncHandler(async (req, res, next) => {
    const allBlogs = await Blog.find({ published: true });
    res.status(200).json({
      success: true,
      allBlogs,
    });
});

export const getSingleBlog = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return next(new ErrorHandler("Blog not found!", 404));
    }
    res.status(200).json({
      success: true,
      blog,
    });
});