import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removePost, updatePostStatus } from "../../store/postsSlice.js";
import { getMyPosts, resolvePost, deletePost } from "../../api/posts.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const data = await getMyPosts();
        const formattedPosts = data.map((post) => ({
          ...post,
          createdAt: new Date(post.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        }));
        setPosts(formattedPosts);
      } catch (err) {
        console.error("Failed to fetch my posts", err);
      }
    };

    fetchMyPosts();
  }, []);

  const handleResolve = async (id) => {
    try {
      const resolvedPost = await resolvePost(id);
      if (resolvedPost) {
        toast.success("Post resolved successfully");
      } else {
        toast.error("Failed to resolve post");
      }

      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "resolved" } : p))
      );

      // Redux update ONLY
      dispatch(
        updatePostStatus({
          id,
          status: resolvedPost.status,
        })
      );
    } catch (err) {
      console.error("Resolve failed", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deletePost(id);

      if (response) {
        toast.success("Post deleted successfully");

        // update local state
        setPosts((prev) => prev.filter((p) => p._id !== id));

        // remove from redux
        dispatch(removePost(id));
      } else {
        toast.error("Failed to delete post");
      }
    } catch (err) {
      toast.error("Something went wrong while deleting the post");
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-24 pb-12 px-4 md:px-10 mb-14 md:mb-0">
      <div className="max-w-5xl mx-auto">
        {/* Header Area */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold text-[#143D6B]">
            Manage Your All Posts
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage, edit, or resolve your reported items below.
          </p>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className={`bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4 transition-all ${
                post.status === "resolved"
                  ? "opacity-60 grayscale-[0.3]"
                  : "hover:shadow-md"
              }`}
            >
              {/* 1. Small Image Thumbnail */}
              <div className="w-full md:w-28 h-24 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                <img
                  src={post.imageUrl}
                  onError={(e) => {
                    e.target.src = "/no-img.png";
                  }}
                  alt={post.title}
                  className="w-full h-full object-contain p-1"
                />
              </div>

              {/* 2. Status & Date (Mobile Friendly) */}
              <div className="flex md:flex-col items-center justify-between w-full md:w-20 gap-1 flex-shrink-0">
                <span
                  className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${
                    post.status === "resolved"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {post.status}
                </span>
                <p className="text-[10px] text-gray-400 font-bold">
                  {post.createdAt}
                </p>
              </div>

              {/* 3. Content Info */}
              <div className="flex-grow w-full min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      post.type === "lost" ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></span>
                  <h3 className="text-base font-extrabold text-gray-800 truncate">
                    {post.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-3 text-[9px] font-bold text-gray-400 uppercase">
                  <span className="flex items-center gap-1">
                    <i className="ri-grid-fill"></i> {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="ri-map-pin-2-fill"></i> {post.location}
                  </span>
                </div>
              </div>

              {/* 4. Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0">
                {post.status !== "resolved" && (
                  <button
                    onClick={() => handleResolve(post._id)}
                    title="Mark as Resolved"
                    className="flex items-center justify-center w-10 h-10 cursor-pointer bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"
                  >
                    <i className="ri-checkbox-circle-line text-xl"></i>
                  </button>
                )}

                {post.status !== "resolved" && (
                  <Link
                    to={`/edit-post/${post._id}`}
                    title="Edit Post"
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-[#1f3c88] transition-all"
                  >
                    <i className="ri-edit-box-line text-xl"></i>
                  </Link>
                )}

                <button
                  onClick={() => handleDelete(post._id)}
                  title="Delete Post"
                  className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <i className="ri-delete-bin-6-line text-xl"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <i className="ri-folder-open-line text-5xl text-gray-200"></i>
            <p className="text-gray-400 mt-4 font-bold">
              You haven't posted anything yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
