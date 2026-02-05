import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["lost", "found"],
    },

    status: {
      type: String,
      default: "active",
      enum: ["active", "resolved"],
    },

    category: {
      type: String,
      enum: [
        "Wallet",
        "Phone",
        "Laptop",
        "Jewellery",
        "Documents",
        "Keys",
        "Other",
      ],
      default: "Other",
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    contact: {
      email: { type: String, trim: true, lowercase: true },
      phone: { type: String, trim: true },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
