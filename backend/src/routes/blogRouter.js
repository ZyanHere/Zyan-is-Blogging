import express from "express"
import { blogPost, deleteBlog, getAllBlogs, getSingleBlog } from "../controllers/blogController.js"
import { isAuthorized, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post",isAuthenticated, isAuthorized("Author"), blogPost);
router.delete("/delete/:id",isAuthenticated, isAuthorized("Author"), deleteBlog);
router.get("/all", getAllBlogs)
router.get("/singleblog/:id", isAuthenticated, getSingleBlog);

export default router