import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const TOKEN_EXPIRE = "24h";

export const generatedToken = (user) => {
  const secret = process.env.JWT_SECRET_KEY || "muntazeem";
  if (!secret) throw new Error("JWT_SECRET_KEY IS NOT DEFINED");

  return jwt.sign({ email: user.email, id: user._id }, secret, {
    expiresIn: TOKEN_EXPIRE,
  });
};
