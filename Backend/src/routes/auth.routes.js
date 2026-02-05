import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  refreshAccessToken,
} from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ===================== PUBLIC ROUTES ===================== */

// Register
router.post("/register", register);

// Login (email OR phone)
router.post("/login", login);

// Refresh access token
router.post("/refresh-token", refreshAccessToken);

/* ===================== PROTECTED ROUTES ===================== */

// Get logged-in user profile
router.get("/profile", authMiddleware, getProfile);

// Logout
router.post("/logout", authMiddleware, logout);

export default router;
