import express from "express";
import { getPresignedUrl } from "../controllers/presignController.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/presign", restrictToLoggedInUserOnly, getPresignedUrl);

export default router;