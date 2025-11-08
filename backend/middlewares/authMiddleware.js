import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ✅ make sure this exists

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🧩 No token found
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 🧩 Extract token
    const token = authHeader.split(" ")[1];

    // 🧩 Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧩 Optional: Fetch user from DB (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Attach user to request object for protected routes
    req.user = user;

    next(); // Continue to next middleware/controller
  } catch (error) {
    console.error("❌ JWT Verification Failed:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
