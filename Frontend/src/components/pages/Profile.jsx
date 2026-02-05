import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, logoutUser } from "../../api/auth.js";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err) {
        console.error("Profile fetch failed", err);
        navigate("/");
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error(e);
    }

    navigate("/", { replace: true });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex justify-center p-4 md:p-10 md:mt-10 mt-14">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Top Header Section */}
        <div className="p-4 md:p-8  flex items-center justify-between border-b border-gray-50">
          <button
            onClick={() => navigate(-1)}
            className="text-xs font-bold text-gray-500 hover:text-gray-800 uppercase tracking-widest transition-colors"
          >
            Back
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                {user?.fullname || "User"}
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                Account Profile
              </p>
            </div>
            <div className="w-14 h-14 bg-[#1f3c88] text-white rounded-full flex items-center justify-center text-2xl font-light shadow-inner">
              {user?.fullname?.charAt(0).toUpperCase() || "?"}
            </div>
          </div>
        </div>

        {/* Main Content Form */}
        <div className="p-6 md:p-8 space-y-2">
          <section>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-[px] bg-gray-200"></span>
              General Information
            </h2>

            <div className="grid gap-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <i className="ri-mail-line absolute left-4 text-gray-400"></i>
                  <input
                    type="email"
                    name="email"
                    defaultValue={user?.email}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <i className="ri-phone-line absolute left-4 text-gray-400"></i>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={user?.phone}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Read-only Member Since */}
              <div className="space-y-2 opacity-70">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Member Since
                </label>
                <div className="w-full bg-gray-100/50 border border-gray-50 rounded-2xl py-3.5 px-4 text-sm font-medium text-gray-500 cursor-not-allowed">
                  {new Date(user?.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Footer Buttons */}
          <div className="pt-5 border-t border-gray-50 flex items-center justify-between gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer text-[11px] font-bold text-red-500 uppercase tracking-widest hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
            >
              <i className="ri-logout-box-line"></i>
              Logout
            </button>

            <button
              onClick={() =>
                toast.success(
                  "Profile updates are currently disabled in demo mode due to api limits."
                )
              }
              className="bg-[#10b981] hover:bg-[#059669] cursor-pointer text-white text-[11px] font-bold uppercase tracking-widest px-8 py-3.5 rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
