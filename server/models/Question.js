import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  tags: {
    type: [String],
    enum: [
      "hostel",
      "placement",
      "admission",
      "ragging",
      "life",
      "curriculum",
      "clubs",
      "mess",
      "facilities",
      "faculty",
      "internship",
      "fees",
      "other",
    ],
    default: [],
  },
  college: {
    type: String,
    required: true,
    trim: true,
  },
  askedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Question", questionSchema);
