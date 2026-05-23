import User from "../models/User.js";
import { setUser } from "../service/auth.js";
import jwt from "jsonwebtoken";

// 🔐 User Signup
export const handleUserSignup = async (req, res) => {
  try {
    console.log("Signup request body:", req.body); // Debug log
    
    const { name, email, password, role, college } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (role === "mentor" && !college) {
      return res.status(400).json({ error: "College is required for mentors" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    await User.create({ name, email, password, role, college: role === "mentor" ? college : undefined });

    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};


// 🔐 User Login
export const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    const token = setUser(user);

    // Set JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // Set to true in production (with HTTPS)
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Login successful", user: { name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

