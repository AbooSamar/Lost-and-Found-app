import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-lg shadow p-3 animate-pulse flex flex-col space-y-3 w-full max-w-sm">
      <div className="w-full h-40 bg-gray-200 rounded"></div>

      {/* Text placeholders */}
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>

      {/* Footer row */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
