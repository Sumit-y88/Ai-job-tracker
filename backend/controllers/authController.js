import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";


// Generate JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};


// Register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check existing user
  const existingUser = await User.findOne({ email }).lean();

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "Email already registered",
    });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  // Generate token
  const token = generateToken(user._id);

  // Response
  return res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        resumeText: user.resumeText,
        createdAt: user.createdAt,
      },
    },
  });
});


// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Get user with passwordHash
  const user = await User.findOne({ email }).select(
    "+passwordHash"
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Compare password
  const isMatch = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Generate token
  const token = generateToken(user._id);

  return res.status(200).json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        resumeText: user.resumeText,
        createdAt: user.createdAt,
      },
    },
  });
});


// Current User
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId)
    .select("-passwordHash")
    .lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateResume = asyncHandler(
  async (req, res) => {
    const { name, resumeText } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (resumeText !== undefined) updateFields.resumeText = resumeText;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-passwordHash")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  }
);

// Upload & Parse PDF Resume
export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  try {
    const parser = new pdf.PDFParse({ data: req.file.buffer });
    const result = await parser.getText();
    const text = result.text || "";

    return res.status(200).json({
      success: true,
      data: {
        text: text.trim(),
      },
    });
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to parse PDF file",
      error: error.message,
    });
  }
});