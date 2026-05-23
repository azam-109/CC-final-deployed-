import express from "express";
import { createAnswer, getAnswersForQuestion,voteAnswer } from "../controllers/answerController.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";
import Answer from "../models/Answer.js";
// routes/answerRoutes.js

const router = express.Router();

router.post("/", restrictToLoggedInUserOnly, createAnswer);
router.get("/:questionId", getAnswersForQuestion);
router.get("/user/:id", async (req, res) => {
  const answers = await Answer.find({ answeredBy: req.params.id }).populate("question", "title");
  res.json(answers);
});
router.post("/:answerId/vote", restrictToLoggedInUserOnly, voteAnswer);

export default router;