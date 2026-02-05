import React, { useState, useEffect } from "react";
import ResolvedCard from "./ResolvedCard";
import { getResolvedPosts } from "../../api/posts";

const Resolved = () => {
  const [resolvedPosts, setResolvedPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResolvedPosts = async () => {
      try {
        setLoading(true);
        const data = await getResolvedPosts();
        setResolvedPosts(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch resolved posts", err);
      }
    };

    fetchResolvedPosts();
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-20 pb-12 px-6 mb-14 md:mb-0">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-50 text-green-500 rounded-2xl mb-1 shadow-sm">
            <i className="ri-verified-badge-line text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-[#143D6B] tracking-tight">
            Resolved Cases
          </h1>
          <p className="text-gray-400 mt-2 max-w-sm mx-auto text-sm font-medium">
            Items that have been successfully returned to their owners.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resolvedPosts.map((post) => (
            <ResolvedCard key={post._id} data={post} />
          ))}
        </div>

        {/* Empty State */}
        {resolvedPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <i className="ri-shake-hands-line text-7xl"></i>
            <p className="font-bold mt-4">No stories to show yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resolved;
