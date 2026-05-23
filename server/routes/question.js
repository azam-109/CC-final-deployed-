import express from "express";
import { createQuestion, getAllQuestions, getQuestionById, getMyQuestions } from "../controllers/questionController.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";
import Question from "../models/Question.js";
const router = express.Router();

router.get("/", getAllQuestions);
router.get("/:id", getQuestionById); 
router.post("/", restrictToLoggedInUserOnly, createQuestion);
router.get("/user/:id", async (req, res) => {
  const questions = await Question.find({ askedBy: req.params.id });
  res.json(questions);
});


export default router;