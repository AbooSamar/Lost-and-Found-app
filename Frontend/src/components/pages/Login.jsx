import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/lost-found-logo.png";
import bg from "../../assets/bg.png";
import { loginUser } from "../../api/auth";

const Login = () => {
  const [show, setShow] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isPhone = (value) => {
    // Remove spaces
    value = value.replace(/\s+/g, "");

    // Remove +91 prefix if present
    value = value.replace(/^(\+91)/, "");

    // Now check if it's exactly 10 digits
    return /^\d{10}$/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = identifier.trim();

    if (!value) {
      setError("Email or Phone is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }
    let payload = {
      password,
    };

    if (isEmail(value)) {
      payload.email = value;
    } else if (isPhone(value)) {
      payload.phone = value;
    } else {
      setError("Enter a valid email or phone number");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const res = await loginUser(payload);
      localStorage.setItem("accessToken", res.accessToken);
      navigate("/all-posts");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center relative px-4 overflow-hidden"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      {/* Logo Area -*/}
      <header className="absolute top-0 w-full p-4 md:p-6 flex justify-center md:justify-start z-30">
        <img
          src={logo}
          alt="logo"
          className="h-36 md:h-33 object-contain transition-transform hover:scale-105"
        />
      </header>

      {/* Main Card Container */}
      <div className="w-full z-20 max-w-[380px] bg-white rounded-lg p-5 md:p-7 shadow-2xl flex flex-col items-center">
        <h2 className="text-[#1f3c88] font-semibold text-2xl mb-4">
          Welcome Back
        </h2>

        <div className="min-h-[20px] mb-4">
          {error && (
            <p key={error} className="text-red-500 text-sm animate-shake">
              {error}
            </p>
          )}
        </div>

        {/* 2. Form Area */}
        <div className="w-full space-y-4">
          <input
            type="text"
            placeholder="Email or Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f3c88]/10 transition-all"
          />

          <div className="relative">
            <input
              required
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f3c88]/10 transition-all"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-4.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className={show ? "ri-eye-off-line" : "ri-eye-line"}></i>
            </button>
          </div>

          {/* 3. Sign In Button */}
          <button
            onClick={handleSubmit}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-[#1f3c88] text-white py-4 mt-2 rounded-lg text-[12px] font-bold uppercase hover:bg-[#162d66] transition-all shadow-lg active:scale-[0.98]"
          >
            {loading ? (
              <i className="ri-loader-4-line animate-spin"></i>
            ) : (
              "Sign In"
            )}
          </button>

          {/* 4. Footer Links inside the card */}
          <div className="flex justify-between items-center px-1 pt-2">
            <button className="text-[12px] text-[#f57c00] hover:text-[#ff9122] uppercase transition-colors">
              Forgot Password?
            </button>
            <Link
              to="/signup"
              className="text-[12px]  text-[#f57c00] hover:text-[#ff9122] uppercase transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
