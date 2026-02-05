import React from "react";
import { Link } from "react-router-dom";

const Card = ({ data }) => {
  const isLost = data.type === "lost";

  const fullName = data.createdBy?.fullname || "Unknown";

  const displayName =
    fullName.length > 20 ? fullName.substring(0, 20) + "..." : fullName;

  const createdDate = new Date(data.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="relative h-48 w-full">
        <img
          src={data.imageUrl}
          onError={(e) => {
            e.target.src = "/no-img.png";
          }}
          alt={data.title}
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
            isLost ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {data.type}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 truncate">
          {data.title}
        </h3>

        <p className="text-gray-500 text-xs mb-1 line-clamp-1">
          <i className="ri-map-pin-2-fill text-gray-400 text-xs"></i>{" "}
          {data.location}
        </p>

        <p className="text-gray-500 text-xs">
          <i className="ri-calendar-event-fill text-gray-400 text-xs"></i>{" "}
          {createdDate}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#1f3c88] text-white rounded-full flex items-center justify-center text-[10px]">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <span className="text-[11px] font-medium text-gray-700">
              {displayName}
            </span>
          </div>

          <Link
            to={`/details/${data._id}`}
            className="text-[#1f3c88] text-sm font-bold"
          >
            Details <i className="ri-arrow-right-up-line"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
