import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

/* ===================== REGISTER ===================== */
export const register = async (req, res) => {
  try {
    const { fullname, email, phone, password } = req.body;

    // basic sanity check
    if (!fullname || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!email && !phone) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    // check existing user
    const conditions = [];
    if (email) conditions.push({ email });
    if (phone) conditions.push({ phone });

    const existingUser = await User.findOne({ $or: conditions });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      fullname,
      email,
      phone,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        role: user.role,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

/* ===================== LOGIN (email OR phone) ===================== */
export const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let query = {};
    if (email) query.email = email;
    if (phone) query.phone = phone;

    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Saves hashed refresh token to DB
    user.refreshToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await user.save({ validateBeforeSave: false });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        accessToken,
        user: {
          id: user._id,
          fullname: user.fullname,
          role: user.role,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

/* ===================== LOGOUT ===================== */
export const logout = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
    });

    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};

/* ===================== GET PROFILE ===================== */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -refreshToken"
    );

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

/* ===================== REFRESH ACCESS TOKEN ===================== */
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }
    // Hash incoming token to compare
    const hashedIncomingToken = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // Compare with hashed DB token
    if (user.refreshToken !== hashedIncomingToken) {
      return res.status(401).json({ message: " Unauthorized" });
    }
    // Generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // Hash new refresh token and save in db
    user.refreshToken = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    await user.save({ validateBeforeSave: false });

    // Send new tokens
    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: "Token refresh failed" });
  }
};
