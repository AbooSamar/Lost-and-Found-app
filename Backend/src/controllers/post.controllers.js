import { Post } from "../models/post.models.js";

//create post
export const createPost = async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      location,
      description,
      phone,
      email,
      imageUrl,
    } = req.body;

    if (!title || !type || !location || !phone) {
      return res.status(400).json({
        message: "Title, type, location and phone are required",
      });
    }

    const post = await Post.create({
      title,
      type,
      category,
      location,
      description,
      imageUrl: imageUrl || "",
      contact: {
        phone,
        email: email || "",
      },
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    res.status(500).json({ message: "Post creation failed" });
  }
};

//fetch all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "active" })
      .populate("createdBy", "fullname email phone")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

//get post by id
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate(
      "createdBy",
      "fullname email phone username"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch post", error: err.message });
  }
};

//fetch all resolved posts
export const getResolvedPosts = async (req, res) => {

  try {
    const posts = await Post.find({ status: "resolved" })
      .populate("createdBy", "fullname email phone")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch resolved posts" });
  }
};

//mark post as resolved
export const resolvePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    post.status = "resolved";
    await post.save();

    res.status(200).json({ message: "Post marked as resolved", post });
  } catch (err) {
    res.status(500).json({ message: "Failed to resolve post" });
  }
};

//delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Allow if user is creator OR admin
    const isCreator = post.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isCreator && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted permanently" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};

//update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const allowedFields = [
      "title",
      "category",
      "location",
      "description",
      "type",
      "imageUrl",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        post[field] = req.body[field];
      }
    });

    // 👇 handle nested contact properly
    if (req.body.phone !== undefined) {
      if (!req.body.phone) {
        return res.status(400).json({ message: "Phone cannot be empty" });
      }
      post.contact.phone = req.body.phone;
    }

    if (req.body.email !== undefined) {
      post.contact.email = req.body.email; // empty allowed
    }

    await post.save();

    res.status(200).json({ message: "Post updated", post });
  } catch (err) {
    res.status(500).json({ message: "Failed to update post" });
  }
};

//this is to fetch my posts (user specific)
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your posts" });
  }
};
