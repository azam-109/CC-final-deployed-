import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // In models/Answer.js
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  voteCount: { type: Number, default: 0 }

});

export default mongoose.model("Answer", answerSchema);
