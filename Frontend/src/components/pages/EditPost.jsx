import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getPostById, updatePost } from "../../api/posts.js";
import { useDispatch } from "react-redux";
import { updatePostInStore } from "../../store/postsSlice.js";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const [imagePreview, setImagePreview] = useState(null);
  const [allowCustomContact, setAllowCustomContact] = useState(false);
  const [status, setStatus] = useState("loading_data"); // Distinct loading for initial fetch

  const [formData, setFormData] = useState({
    title: "",
    type: "lost",
    category: "Other",
    location: "",
    description: "",
    phone: "",
    email: "",
    image: null, // New file if uploaded
    existingImageUrl: "", // URL from DB
  });

  const categories = [
    "Wallet",
    "Phone",
    "Laptop",
    "Jewellery",
    "Documents",
    "Keys",
    "Other",
  ];

  // 1. Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);

        const post = data?.post || data;

        setFormData({
          title: post.title,
          type: post.type,
          category: post.category,
          location: post.location,
          description: post.description,
          phone: post.contact.phone,
          email: post.contact.email,
          image: null,
          existingImageUrl: post.imageUrl,
        });

        if (post.imageUrl) setImagePreview(post.imageUrl);
        setStatus(null);
      } catch (err) {
        console.error("The exact error is:", err);
        toast.error("Failed to load post data");
        navigate("/my-posts");
      }
    };
    fetchPost();
  }, [id, navigate]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const uploadToCloudinary = async (file) => {
    const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
      {
        method: "POST",
        body: form,
      }
    );
    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.secure_url;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const MAX_SIZE = 2 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        toast.error("Image must be under 2MB");
        return;
      }
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, image: file });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > 150) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");

    try {
      let finalImageUrl = formData.existingImageUrl;

      // If user selected a new file, upload it
      if (formData.image) {
        finalImageUrl = await uploadToCloudinary(formData.image);
      } else if (!imagePreview) {
        // If user removed the image entirely
        finalImageUrl = "";
      }

      const payload = {
        title: formData.title,
        type: formData.type,
        category: formData.category,
        location: formData.location,
        description: formData.description,
        phone: formData.phone,
        email: formData.email,
        imageUrl: finalImageUrl,
      };

      const data = await updatePost(id, payload);
      const updatedPost = data?.post || data;

      // Dispatch to Redux
      dispatch(updatePostInStore(updatedPost));

      toast.success("Post updated successfully");
      setStatus("success");
      setTimeout(() => navigate("/my-posts"), 1500);
    } catch (err) {
      toast.error("Update failed");
      setStatus("error");
    }
  };

  if (status === "loading_data") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="ri-loader-4-line animate-spin text-4xl text-[#1f3c88]"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-[#f8fafc] pt-20 pb-10 px-0 md:px-6 mb-5 md:mb-0">
      <div className="max-w-xl mx-auto bg-white md:rounded-3xl md:shadow-sm md:border border-gray-100 overflow-hidden relative">
        <div className="bg-[#1f3c88] py-6 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Edit Post
            </h1>
            <p className="text-blue-200/80 text-[10px] uppercase tracking-widest font-medium">
              Update your item details
            </p>
          </div>
          <i className="ri-edit-2-line text-blue-200/30 text-3xl"></i>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          {/* Image Upload Box */}
          <div
            onClick={() => fileInputRef.current.click()}
            className="group relative border-2 border-dashed border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-100 hover:border-[#1f3c88]/30 transition-all cursor-pointer min-h-[140px]"
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-contain p-2"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                    setFormData((prev) => ({
                      ...prev,
                      image: null,
                      existingImageUrl: "",
                    }));
                  }}
                  className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-red-500 hover:text-white text-gray-600 rounded-full w-6 h-6 flex items-center justify-center shadow-sm"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </>
            ) : (
              <div className="text-center">
                <i className="ri-camera-lens-line text-xl text-gray-300 mb-1 block group-hover:scale-110"></i>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Change Photo
                </span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="w-full border-b border-gray-400 px-2 py-2 bg-gray-100 text-sm font-medium focus:outline-none focus:border-[#1f3c88]"
              required
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Location"
              className="w-full border-b bg-gray-100 px-2 border-gray-400 py-2 text-sm font-medium focus:outline-none focus:border-[#1f3c88]"
              required
            />
          </div>

          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description..."
            className="w-full bg-gray-100 rounded-xl p-4 text-xs font-medium focus:outline-none resize-none"
          ></textarea>

          <div className="pt-4 border-t border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Contact Details
              </h3>
              <label className="flex items-center gap-1 text-[9px] font-semibold text-gray-400 uppercase tracking-wide">
                <input
                  type="checkbox"
                  checked={allowCustomContact}
                  onChange={(e) => setAllowCustomContact(e.target.checked)}
                />
                Edit details
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                disabled={!allowCustomContact}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-xs font-medium outline-none disabled:opacity-50"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                disabled={!allowCustomContact}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-xs font-medium outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <button
            disabled={status === "submitting"}
            className={`w-full ${
              status === "submitting"
                ? "bg-gray-400"
                : "bg-[#1f3c88] hover:bg-[#162d66]"
            } text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-md active:scale-95 mt-4 flex justify-center items-center gap-2`}
          >
            {status === "submitting" ? (
              <>
                <i className="ri-loader-4-line animate-spin text-lg"></i>{" "}
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>

      {/* Floating Success Toast */}
      {status === "success" && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
          <i className="ri-checkbox-circle-fill text-xl"></i>
          <span className="text-xs font-bold uppercase tracking-widest">
            Changes Saved!
          </span>
        </div>
      )}
    </div>
  );
};

export default EditPost;
