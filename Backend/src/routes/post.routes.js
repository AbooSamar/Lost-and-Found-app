import express from "express";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
  resolvePost,
  getResolvedPosts,
  getPostById,
} from "../controllers/post.controllers.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Static routes
router.get("/my-posts", authMiddleware, getMyPosts);
router.get("/get-resolved", authMiddleware, getResolvedPosts);

// Collection routes
router.get("/", authMiddleware, getAllPosts);
router.post("/", authMiddleware, createPost);

// Dynamic routes
router.get("/:id", authMiddleware, getPostById);
router.put("/:id", authMiddleware, updatePost);
router.patch("/:id/resolve", authMiddleware, resolvePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
