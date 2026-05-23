import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    college: { type: String, required: true },
    tags: [{ type: String }],
    images: [{ type: String }],   // ← NEW: array of Cloudinary URLs
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);