import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import {
  register,
  login,
  getMe,
  updateResume,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import validateMiddleware from "../middleware/validateMiddleware.js";

import {
  registerValidator,
  loginValidator,
} from "../validators/authValidators.js";

const router = express.Router();


// Register
router.post(
  "/register",
  registerValidator,
  validateMiddleware,
  register
);


// Login
router.post(
  "/login",
  loginValidator,
  validateMiddleware,
  login
);


// Get Current User
router.get(
  "/me",
  authMiddleware,
  getMe
);

router.patch(
  "/resume",
  authMiddleware,
  updateResume
);

// Google OAuth
router.get(
  "/google",
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  }),
  (req, res) => {
    // On success
    const user = req.user;
    
    // Generate JWT exactly like the existing login route
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      authProvider: user.authProvider,
      resumeText: user.resumeText,
    };

    res.redirect(
      `${process.env.CLIENT_URL}/oauth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(safeUser)
      )}`
    );
  }
);

router.get("/google/failure", (req, res) => {
  res.json({ success: false, message: 'Google authentication failed' });
});

export default router;