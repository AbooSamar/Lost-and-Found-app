import React, { useEffect } from "react";
import Card from "./Card";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../store/postsSlice.js";
import { getAllPosts } from "../../api/posts.js";
import SkeletonCard from "./SkeletonCard.jsx";
const AllPosts = () => {
  const dispatch = useDispatch();

  // get posts from redux
  const posts = useSelector((state) => state.posts.all);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        // backend should return ONLY active posts
        dispatch(setPosts(data));
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };

    fetchPosts();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 mb-14 md:mb-0">
      <div className="max-w-7xl mx-auto">
        <div className="mb-5">
          <h1 className="md:text-3xl text-2xl font-bold text-[#143D6B]">
            All Lost & Found Posts
          </h1>
          <p className="text-gray-500 mt-1">
            Check out all the items reported in the community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.length === 0
            ? Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : posts.map((item) => <Card key={item._id} data={item} />)}
        </div>
      </div>
    </div>
  );
};

export default AllPosts;
