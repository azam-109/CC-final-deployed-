import jwt from "jsonwebtoken";

const secret = "@placement"; // Secret key used to sign/verify the JWT

// 🔐 Function to create a JWT for a logged-in user
export const setUser = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    secret,
    {
      expiresIn: "2d", // Optional: add token expiry
    }
  );
};

// 🔍 Function to decode and validate a JWT from a cookie
export const getUser = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    return null;
  }
};
