import userModel from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import validator from "validator";
import generatedToken from "../utils/generateToken.js";

//REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (password.length < 8)
    return res.status(400).json({
      success: false,
      message: "Password must be atleast 8+ charcters",
    });

  if (!validator.isEmail(email))
    return res.status(400).json({ success: false, message: "Invalid email" });

  try {
    if (await userModel.findOne({ email })) {
      return res.status(400).json({
        success: false,
        message: "User Already exits. Please login instead",
      });
    }
    const hashVal = await bcrypt.hash(password, 10);

    let user = await userModel.create({
      name,
      email,
      password: hashVal,
    });
    const token = generatedToken(user);
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("Error occured", error);
    res.status(500).json({
      error: "server error",
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Fields Required",
    });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invaid Credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "User Not Found" });

    const token = generatedToken(user);
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "server error",
    });
  }
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    let user = await userModel.findById(req.user.id).select("name email");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "server error",
    });
  }
};

//UPDATE PROFILE
export const updateProfile = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email || !validator.isEmail(email))
    return res.status(400).json({
      success: false,
      message: "All Fields Required",
    });

  try {
    const exists = await userModel.findOne({
      email,
      _id: { $ne: req.user.id },
    });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Email Already in Use" });

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true, runValidators: true, select: "name email" }
    );
    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "server error",
    });
  }
};

//CHANGE PASSWORD
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword < 8)
    return res
      .status(400)
      .json({ success: false, message: "Password invalid or too short" });

  try {
    const user = userModel.findById(req.user.id).select("password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not Found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match)
      return res
        .status(400)
        .json({ success: false, message: "Current password doesn't match" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ success: true, message: "Password changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "server error",
    });
  }
};
