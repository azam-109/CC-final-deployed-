import express from "express";
import { suggestAnswer } from "../controllers/aiController.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/suggest", restrictToLoggedInUserOnly, suggestAnswer);

export default router;