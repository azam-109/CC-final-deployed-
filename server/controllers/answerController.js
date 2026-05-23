import Question from "../models/Question.js";
import User from "../models/User.js";
import Answer from "../models/Answer.js";

export const createAnswer = async (req, res) => {
  try {
    const { content, questionId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (user.role !== "mentor") {
      return res.status(403).json({ error: "Only mentors can answer questions" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (user.college !== question.college) {
      return res.status(403).json({ error: "Mentor not from the same college" });
    }

    const answer = await Answer.create({
      content,
      question: questionId,
      answeredBy: user._id,
    });

    res.status(201).json(answer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to post answer" });
  }
};


export const getAnswersForQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const answers = await Answer.find({ question: questionId }).populate("answeredBy", "name role college");

    res.json(answers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch answers" });
  }
};

// controllers/answerController.js
export const voteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const userId = req.user._id;

    const answer = await Answer.findById(answerId);
    if (!answer) return res.status(404).json({ error: "Answer not found" });

    const alreadyVoted = answer.votes.includes(userId);

    if (alreadyVoted) {
      // Remove vote
      answer.votes.pull(userId);
      answer.voteCount -= 1;
    } else {
      // Add vote
      answer.votes.push(userId);
      answer.voteCount += 1;
    }

    await answer.save();

    res.json({ voteCount: answer.voteCount, voted: !alreadyVoted });
  } catch (err) {
    res.status(500).json({ error: "Could not update vote" });
  }
};

