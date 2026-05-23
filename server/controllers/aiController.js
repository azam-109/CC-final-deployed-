import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// // 1. Create the Gemini model
// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-1.5-flash",
//   apiKey: process.env.GOOGLE_API_KEY,
//   temperature: 0.7,
// });

// 2. Create the prompt template
const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an experienced college mentor helping students with questions 
about college life, academics, and admissions. 
Write helpful, detailed, honest answers.
Be specific, practical, friendly and encouraging.
Use paragraph format, not bullet points.
Keep the answer between 100-200 words.`,
  ],
  [
    "human",
    `A student asked this question:

Title: {title}
Details: {description}
College: {college}
Tags: {tags}

Please write a helpful answer.`,
  ],
]);

// 3. Build the chain: prompt → model → string output

export const suggestAnswer = async (req, res) => {
  try {
    const { title, description, college, tags } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Question title is required" });
    }

    // ✅ moved inside function so dotenv has already loaded by now
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.7,
    });

    const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

    // 4. Run the chain
    const suggestion = await chain.invoke({
      title,
      description: description || "No details provided",
      college: college || "Not specified",
      tags: tags?.join(", ") || "None",
    });

    return res.status(200).json({ suggestion });
  } catch (error) {
    console.error("LangChain Gemini error:", error.message);
    return res.status(500).json({ error: "Failed to generate suggestion" });
  }
};