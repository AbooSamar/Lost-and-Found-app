import React from "react";
import { useSelector } from "react-redux";
import Card from "./Card";
import SkeletonCard from "./SkeletonCard";

const Lost = () => {
  const allPosts = useSelector((state) => state.posts.all);

  // filter only lost posts that are active
  const lostPosts = allPosts.filter(
    (p) => p.type === "lost" && p.status === "active"
  );

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 mb-14 md:mb-0">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-[#143D6B]">All Lost Posts</h1>
          <p className="text-gray-500 mt-1">
            Check out all the Lost items reported in the community.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lostPosts.length === 0
            ? Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : lostPosts.map((item) => <Card key={item._id} data={item} />)}
        </div>
      </div>
    </div>
  );
};

export default Lost;
