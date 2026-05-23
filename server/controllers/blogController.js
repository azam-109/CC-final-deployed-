import Blog from "../models/Blog.js";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const createBlog = async (req, res) => {
  try {
    if (req.user.role !== "mentor") {
      return res.status(403).json({ error: "Only mentors can post blogs." });
    }

    const { title, content, tags, images } = req.body;
    // images = array of S3 URLs already uploaded by frontend

    const blog = await Blog.create({
      title,
      content,
      author: req.user._id,
      college: req.user.college,
      tags: tags || [],
      images: images || [],   // plain S3 URLs, no multer needed
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ error: "Failed to create blog." });
  }
};



// ✅ Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author", "name email role college")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({ error: "Error fetching blogs." });
  }
};

// ✅ Get blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name email role college");
    res.json(blog);
  } catch (error) {
    console.error("Get blog error:", error);
    res.status(500).json({ error: "Error fetching blog." });
  }
};

// ✅ AI draft generator
export const generateBlogDraft = async (req, res) => {
  try {
    if (req.user.role !== "mentor") {
      return res.status(403).json({ error: "Only mentors can use AI draft." });
    }

    const { title, tags, college } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required to generate draft." });
    }

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.8,
    });

    const promptTemplate = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a college mentor writing an engaging blog post for students.
Write in a friendly, informative, and inspiring tone.
Use paragraph format. No bullet points.
Length: 200-300 words.`,
      ],
      [
        "human",
        `Write a blog post for:
Title: {title}
College: {college}
Tags/Topic: {tags}

Write the full blog content only, no title line at the top.`,
      ],
    ]);

    const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

    const content = await chain.invoke({
      title,
      college: college || "our college",
      tags: tags?.join(", ") || "general",
    });

    return res.status(200).json({ content });
  } catch (error) {
    console.error("AI blog draft error:", error.message);
    res.status(500).json({ error: "Failed to generate draft." });
  }
};