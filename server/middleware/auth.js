import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getUser } from "../service/auth.js";

export const restrictToLoggedInUserOnly = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Please login." });
  }

  try {
    const decoded = getUser(token); // contains _id
    const user = await User.findById(decoded._id).select("name email role college");
    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    req.user = user; // attach full user
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Invalid token. Please login." });
  }
};
