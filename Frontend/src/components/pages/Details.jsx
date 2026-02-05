import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById } from "../../api/posts.js";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getPostById(id);
        setData(res);
      } catch (err) {
        console.error("Failed to fetch post details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const createdDate = data?.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Post not found</div>;

  //for ui color change
  const isLost = data.type === "lost";

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-20 pb-10 px-4 md:px-6 mb-20">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-800 transition-colors border border-gray-100 px-2 py-1 rounded-lg mb-2"
        >
          <i
            onClick={() => navigate(-1)}
            className="ri-arrow-left-line text-[10px]"
          ></i>
          <span>Back to Feed</span>
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          {/* IMAGE SECTION */}
          <div className="md:w-5/12 h-[300px] md:h-auto relative">
            <img
              src={data.imageUrl}
              alt={data.title}
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute top-4 left-4 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md ${
                isLost ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
            >
              {data.type}
            </div>
          </div>

          {/* CONTENT SECTION */}
          <div className="md:w-7/12 p-6 md:p-10">
            {/* Category & Status */}
            <div className="flex gap-2 mb-3">
              <span className="bg-orange-50 text-[#f57c00] text-[10px] font-bold px-3 py-1 rounded-lg uppercase">
                {data.category}
              </span>
              <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-lg uppercase">
                {data.status}
              </span>
            </div>

            <h1 className="text-3xl font-black text-[#143D6B] mb-6 leading-tight">
              {data.title}
            </h1>

            {/* Verification Note (Requested) */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-r-xl">
              <div className="flex items-center gap-2 mb-1">
                <i className="ri-lightbulb-flash-line text-amber-600 font-bold"></i>
                <span className="text-amber-800 text-xs font-bold uppercase tracking-wide">
                  Verification Tip
                </span>
              </div>
              <p className="text-amber-700 text-sm italic">
                To ensure this item is yours, please be ready to describe a
                unique mark, the exact contents, or show a matching ID/Photo.
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <i className="ri-map-pin-2-fill text-gray-400 text-xl"></i>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {data.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <i className="ri-calendar-event-fill text-gray-400 text-xl"></i>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    Posted On
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {createdDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Full Description Section */}
            <div className="mb-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                About this item
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {data.description}
              </p>
            </div>

            <hr className="mb-8 border-gray-100" />

            {/* User & Contact */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1f3c88] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-900/20">
                  {data.createdBy.fullname.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-800 leading-none">
                    {data.createdBy.fullname}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    @{data.createdBy.fullname}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`mailto:${data.contact.email}`}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1f3c88] text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95"
                >
                  <i className="ri-mail-send-line"></i> Email
                </a>
                <a
                  href={`tel:${data.contact.phone}`}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 border-2 border-[#1f3c88] text-[#1f3c88] px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-all"
                >
                  <i className="ri-phone-line"></i> Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
