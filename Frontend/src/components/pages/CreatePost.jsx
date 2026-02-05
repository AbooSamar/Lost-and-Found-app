import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import toast from "react-hot-toast";
import { createPost } from "../../api/posts.js";
import api from "../../api/axios.js";
import { useDispatch } from "react-redux";
import { addPost } from "../../store/postsSlice.js";

const CreatePost = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [allowCustomContact, setAllowCustomContact] = useState(false);
  const [status, setStatus] = useState(null);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    type: "lost",
    category: "Other",
    location: "",
    description: "",
    phone: "",
    email: "",
    image: null,
  });

  const [autoFilled, setAutoFilled] = useState({ phone: false, email: false });
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/v1/auth/profile");
        setFormData((prev) => ({
          ...prev,
          phone: data.user.phone || "",
          email: data.user.email || "",
        }));
        setAutoFilled({ phone: !!data.user.phone, email: !!data.user.email });
      } catch {
        // silent fail
      }
    };

    fetchProfile();
  }, []);

  let isPhoneDisabled = autoFilled.phone && !allowCustomContact;
  let isEmailDisabled = autoFilled.email && !allowCustomContact;

  const categories = [
    "Wallet",
    "Phone",
    "Laptop",
    "Jewellery",
    "Documents",
    "Keys",
    "Other",
  ];

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
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

    if (!res.ok) {
      throw new Error("Image upload failed");
    }

    const data = await res.json();
    const imageUrl = data.secure_url;

    return imageUrl;
  };

  const handleBoxClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      const ALLOWED_TYPES = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (file.size > MAX_SIZE) {
        toast.error("Image must be under 2MB");
        e.target.value = "";
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error("Only JPG, PNG, WEBP images allowed");
        e.target.value = "";
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
    if (status === "loading") return;

    e.preventDefault();
    setStatus("loading");

    try {
      let imageUrl = "";

      if (formData.image) {
        imageUrl = await uploadToCloudinary(formData.image);
      }

      const payload = {
        title: formData.title,
        type: formData.type,
        category: formData.category,
        location: formData.location,
        description: formData.description,
        phone: formData.phone,
        email: formData.email,
        imageUrl,
      };

      const res = await createPost(payload);
      dispatch(addPost(res.post));

      toast.success("Post created successfully");
      setStatus("success");
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, image: null }));
      navigate("/all-posts");
    } catch (err) {
      toast.error("Failed to create post");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white md:bg-[#f8fafc] pt-20 pb-10 px-0 md:px-6 mb-5 md:mb-0">
      <div className="max-w-xl mx-auto bg-white md:rounded-3xl md:shadow-sm md:border border-gray-100 overflow-hidden relative">
        <div className="bg-[#1f3c88] py-6 px-8 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Report Item
            </h1>
            <p className="text-blue-200/80 text-[10px] uppercase tracking-widest font-medium">
              Community Service
            </p>
          </div>
          <i className="ri-edit-box-line text-blue-200/30 text-3xl"></i>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          {/* Compact Image Upload */}
          <div
            onClick={handleBoxClick}
            className="group relative border-2 border-dashed border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center bg-gray-100 hover:border-[#1f3c88]/30 transition-all cursor-pointer min-h-[140px]"
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-contain p-2"
                />
                {/* Remove Image Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                    setFormData((prev) => ({ ...prev, image: null }));
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-red-500 hover:text-white text-gray-600 rounded-full w-6 h-6 flex items-center justify-center shadow-sm transition-colors"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </>
            ) : (
              <div className="text-center">
                <i className="ri-camera-lens-line text-xl text-gray-300 mb-1 block group-hover:scale-110 transition-transform"></i>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  Add Photo
                </span>
                <p className="text-[9px] text-gray-400 mt-1 italic">Max 2MB</p>
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
                required
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
              >
                <option value="lost">Lost (I lost something)</option>
                <option value="found">Found (I found something)</option>
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
              placeholder="What did you lose/find? (e.g. Phone)"
              className="w-full border-b border-gray-400 px-2 py-2 bg-gray-100 text-sm font-medium focus:outline-none focus:border-[#1f3c88] transition-colors"
              required
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Where? (e.g. Cafeteria)"
              className="w-full border-b bg-gray-100 px-2 border-gray-400 py-2 text-sm font-medium focus:outline-none focus:border-[#1f3c88] transition-colors"
              required
            />
          </div>

          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description (Optional details...)"
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
                Use custom email / phone
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
                placeholder="Phone Number"
                disabled={isPhoneDisabled}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-xs font-medium outline-none"
                required={true}
              />
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                placeholder="Email (Optional)"
                disabled={isEmailDisabled}
                className="w-full bg-gray-100 rounded-xl px-4 py-3 text-xs font-medium outline-none"
              />
            </div>
          </div>

          {/* Submit Button with Loading State */}
          <button
            disabled={status === "loading"}
            className={`w-full ${
              status === "loading"
                ? "bg-gray-400"
                : "bg-[#1f3c88] hover:bg-[#162d66]"
            } text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-md active:scale-95 mt-4 flex justify-center items-center gap-2`}
          >
            {status === "loading" ? (
              <>
                <i className="ri-loader-4-line animate-spin text-lg"></i>{" "}
                Processing...
              </>
            ) : (
              "Publish Post"
            )}
          </button>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-2 rounded-r-xl">
            <div className="flex items-center gap-2 ">
              <i className="ri-file-warning-fill text-amber-600 font-bold"></i>
              <span className="text-amber-800 text-xs font-bold uppercase tracking-wide">
                Note
              </span>
            </div>
            <p className="text-amber-700 text-sm italic md:font-semibold leading-tight">
              Note: Your given contact details will be visible to users to
              facilitate communication. Once resolved, your info will be
              permanently hidden.
            </p>
          </div>
        </form>
      </div>

      {/* Floating Success Toast */}
      {status === "success" && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
          <i className="ri-checkbox-circle-fill text-xl"></i>
          <span className="text-xs font-bold uppercase tracking-widest">
            Post Published! Redirecting...
          </span>
        </div>
      )}

      {/* Floating Error Toast */}
      {status === "error" && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
          <i className="ri-error-warning-fill text-xl"></i>
          <span className="text-xs font-bold uppercase tracking-widest">
            Submission Failed. Try again.
          </span>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
