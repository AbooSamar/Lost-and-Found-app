import React from "react";
const ResolvedCard = ({ data }) => {
  return (
    <div className="w-full bg-white/60 rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all opacity-90">
      {/* Compact Image with "Returned" Overlay */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={data.imageUrl}
          onError={(e) => {
            e.target.src = "/no-img.png";
          }}
          alt={data.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
          <div className="border-2 border-white/80 text-white px-3 py-1 rounded-md rotate-[-12deg] font-black uppercase tracking-widest text-[10px] backdrop-blur-sm">
            Resolved
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm font-bold text-gray-700 truncate w-3/4">
            {data.title}
          </h3>
          <span className="text-[8px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase font-bold">
            {data.type}
          </span>
        </div>

        <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-0.5">
          <i className="ri-map-pin-line"></i>
          <span className="truncate">{data.location}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-[10px]">
          <i className="ri-calendar-event-fill text-gray-400 "></i>
          <span className="truncate">24th Oct 2025</span>
        </div>

        {/* Footer with Submitter Info */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-[9px] font-bold">
              {data.createdBy.fullname.charAt(0).toUpperCase()}
            </div>
            <span className="text-[10px] font-medium text-gray-400 italic">
              {data.createdBy.fullname}
            </span>
          </div>
          <i className="ri-checkbox-circle-fill text-green-400 text-lg"></i>
        </div>
      </div>
    </div>
  );
};

export default ResolvedCard;
