import jwt from "jsonwebtoken";
import userModel from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  // GRAB THE BEARER TOKEN FROM THE AUTHORIZATION HEADER
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(400).json({
      success: false,
      message: "Not Authorized, Token missing",
    });   

  const token = authHeader.split(" ")[1];

  // VERIFY AND ATTACH USER OBJECT

  try {
    const playLoad = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(playLoad.id).select("-password");
    if (!user)
      return res.status(401).json({
        success: false,
        message: "User not found",
      });

    req.user = user;
    next();
  } catch (error) {
    console.log("JWT authorization failed", error.message);
    res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
};
