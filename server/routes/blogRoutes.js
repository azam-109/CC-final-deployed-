import express from "express";
const router = express.Router();
import * as blogController from "../controllers/blogController.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";

// no multer here anymore — images arrive as plain URLs in req.body
router.post("/", restrictToLoggedInUserOnly, blogController.createBlog);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.post("/ai/draft", restrictToLoggedInUserOnly, blogController.generateBlogDraft);

export default router;