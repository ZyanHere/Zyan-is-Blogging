import express from "express"
import { blogPost } from "../controllers/blogController.js"
import { isAuthorized, isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post",isAuthenticated, isAuthorized("Author"), blogPost);

export default router