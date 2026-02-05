import React from "react";
import { useSelector } from "react-redux";
import Card from "./Card";

const Found = () => {
  const allPosts = useSelector((state) => state.posts.all);

  // filter only found posts that are active
  const foundPosts = allPosts.filter(
    (p) => p.type === "found" && p.status === "active"
  );

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 mb-14 md:mb-0">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-[#143D6B]">All Found Posts</h1>
          <p className="text-gray-500 mt-1">
            Check out all the Found items reported in the community.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {foundPosts.map((item) => (
            <Card key={item._id} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Found;
