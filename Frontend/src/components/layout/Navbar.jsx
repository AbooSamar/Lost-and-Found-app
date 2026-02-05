import { useEffect, useState } from "react";
import logo from "../../assets/lost-found-logo.png";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { getProfile, logoutUser } from "../../api/auth.js";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getProfile();
        setUser(user);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchUser();
  }, []);

  // Checking if current path is exactly "/create" to hide the + ui element
  const isCreatePage = location.pathname === "/create";

  // Active Link Styling
  const navStyles = ({ isActive }) =>
    `transition-colors duration-200 hover:text-[#f57c00] font-bold ${
      isActive ? "text-[#f57c00]" : "text-[#143D6B]"
    }`;

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error(e);
    }

    navigate("/", { replace: true });

    localStorage.removeItem("accessToken");
  };

  return (
    <div className="relative">
      {/* ================= DESKTOP NAVBAR ================= */}
      <nav className="hidden md:flex w-full h-16 bg-white/90 backdrop-blur-md shadow-sm px-10 items-center justify-between fixed top-0 z-50 border-b border-gray-100">
        <div className="flex items-center gap-10">
          <NavLink to="/all-posts">
            <img src={logo} alt="logo" className="h-32 w-auto object-contain" />
          </NavLink>

          <div className="flex gap-8 text-sm uppercase tracking-wide font-semibold">
            <NavLink to="/all-posts" className={navStyles}>
              All
            </NavLink>
            <NavLink to="/lost" className={navStyles}>
              Lost
            </NavLink>
            <NavLink to="/found" className={navStyles}>
              Found
            </NavLink>
            <NavLink to="/resolved" className={navStyles}>
              Resolved
            </NavLink>

            {/* Spacer */}
            <div className="w-[1px] h-5 bg-gray-200 mx-2"></div>

            {/* Slim Create Post Button */}
            <NavLink
              to="/create"
              className="flex items-center gap-1.5 bg-[#f57c00] text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-[#e67600] transition-all shadow-sm active:scale-95"
            >
              <i className="ri-add-line text-sm"></i>
              <span>Create Post</span>
            </NavLink>
          </div>
        </div>

        <div className="relative group flex items-center gap-3">
          {/* User Full Name Display */}
          <span className="text-md font-normal text-[#1f3c88] tracking-tight">
            {user?.fullname}
          </span>

          <button className="w-12 h-12 text-2xl rounded-full bg-[#1f3c88] text-white flex items-center justify-center transition-transform active:scale-95 shadow-md">
            {user?.fullname.charAt(0).toUpperCase()}
          </button>

          {/* Desktop Dropdown */}
          <div className="absolute right-0 top-full mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right group-hover:translate-y-0 translate-y-2 p-1">
            <NavLink
              to="/create"
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-[#143D6B]"
            >
              <i className="ri-add-box-line"></i> Create Post
            </NavLink>
            <NavLink
              to="/my-posts"
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-[#143D6B]"
            >
              <i className="ri-stack-line"></i> My Posts
            </NavLink>
            <NavLink
              to="/profile"
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 rounded-lg text-sm text-[#143D6B]"
            >
              <i className="ri-settings-4-line"></i> Profile
            </NavLink>
            <hr className="my-1 border-gray-100" />
            <NavLink
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
            >
              <i className="ri-logout-box-r-line"></i> Logout
            </NavLink>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white shadow-sm flex items-center justify-between px-5 z-50">
        <img src={logo} alt="logo" className="h-36 w-auto object-contain" />

        <button
          onClick={() => {
            setMenuOpen(!menuOpen);
            setProfileOpen(false);
          }}
          className="p-2 active:bg-gray-100 rounded-full transition-colors"
        >
          <i
            className={`${
              menuOpen ? "ri-close-line" : "ri-menu-3-fill"
            } text-3xl text-[#143D6B]`}
          ></i>
        </button>

        {/* Categories Mobile Menu */}
        {menuOpen && (
          <div className="absolute right-4 top-16 w-48 bg-white/95 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200">
            {["all-posts", "lost", "found", "resolved"].map((path) => (
              <NavLink
                key={path}
                to={`/${path}`}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 text-[#143D6B] font-medium capitalize border-b border-gray-50 last:border-none active:bg-gray-50"
              >
                {path
                  .replace("-", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* ================= MOBILE BOTTOM BAR ================= */}
      <div className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-100 flex items-center justify-between px-10 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] ">
        {/* Placeholder for left side to balance the UI */}
        <NavLink
          to="/all-posts"
          className={({ isActive }) =>
            `flex flex-col items-center ${
              isActive ? "text-[#f57c00]" : "text-[#143D6B]/60"
            }`
          }
        >
          <i className="ri-home-4-line text-2xl"></i>
          <span className="text-[10px] font-bold">Home</span>
        </NavLink>

        {/* Floating ADD POST */}
        {!isCreatePage && (
          <div className="absolute left-1/2 -translate-x-1/2 -top-6">
            <NavLink
              to="/create"
              onClick={() => setProfileOpen(false)}
              className="w-14 h-14 bg-[#f57c00] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#f57c00]/40 border-4 border-white active:scale-90 transition-transform"
            >
              <i className="ri-add-fill text-4xl"></i>
            </NavLink>
          </div>
        )}

        {/* PROFILE TOGGLE */}
        <button
          className="flex flex-col items-center text-[#1f3c88]"
          onClick={() => {
            setProfileOpen(!profileOpen);
            setMenuOpen(false);
          }}
        >
          <p
            className={`text-2xl text-white bg-blue-900 w-9 h-9 rounded-full ${
              profileOpen ? "text-[#f57c00]" : ""
            }`}
          >
            {user?.fullname.charAt(0).toUpperCase()}
          </p>
          <span className="text-[10px] font-bold">Account</span>
        </button>

        {/* Profile Mobile Dropdown */}
        {profileOpen && (
          <div className="absolute right-4 bottom-20 w-48 bg-white/95 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-2xl p-2 animate-in slide-in-from-bottom-4 duration-200">
            <NavLink
              to="/create"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-gray-50"
            >
              <i className="ri-edit-line"></i> Create Post
            </NavLink>
            <NavLink
              to="/my-posts"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-gray-50"
            >
              <i className="ri-history-line"></i> My Posts
            </NavLink>
            <NavLink
              to="/profile"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-gray-50"
            >
              <i className="ri-settings-4-line"></i> Profile
            </NavLink>
            <NavLink
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500"
            >
              <i className="ri-log-out-circle-line"></i> Logout
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
