import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/lost-found-logo.png";
import bg from "../../assets/bg.png";
import { registerUser } from "../../api/auth";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [fullName, setFullName] = useState("");
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

    // ✅ Check all required fields first
    if (!fullName) {
      setError("Full Name is required");
      return;
    }
    if (!value) {
      setError("Email or Phone is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // ✅ Build payload only after validations
    let payload = {
      fullname: fullName,
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
      const res = await registerUser(payload);
      console.log("registered: ", res);
      navigate("/login");
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
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      {/* Logo Area - */}
      <header className="absolute top-0 w-full p-4 md:p-6 flex justify-center md:justify-start z-30">
        <img
          src={logo}
          alt="logo"
          className="h-36 md:h-33 object-contain transition-transform hover:scale-105"
        />
      </header>

      <div className="w-full z-20 max-w-[400px] bg-white rounded-lg p-5 md:p-7 shadow-2xl flex flex-col items-center backdrop-blur-lg border border-white/20">
        <div className="text-center mb-6">
          <h2 className="text-[#1f3c88] font-semibold text-2xl mb-1">
            Create your account
          </h2>
          <p className="text-gray-400 text-[11px] uppercase tracking-widest">
            Join the community
          </p>
          <div className="min-h-[20px]">
            {error && (
              <p key={error} className="text-red-500 text-sm animate-shake">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* 3. inputs and buttons form */}
        <div className="w-full space-y-4">
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Full Name"
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f3c88]/10 transition-all"
          />

          <input
            type="text"
            placeholder="Email or Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f3c88]/10 transition-all"
            required
          />

          <div className="relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1f3c88]/10 transition-all"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-4.5 text-gray-400 hover:text-gray-600"
            >
              <i className={show ? "ri-eye-off-line" : "ri-eye-line"}></i>
            </button>
          </div>

          <button
            onClick={handleSubmit}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-[#1f3c88] text-white py-4 rounded-lg text-[12px] uppercase font-bold hover:bg-[#162d66] transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-400"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="flex justify-center items-center pt-2">
            <p className="text-[12px] text-gray-500 uppercase">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#f57c00] hover:text-[#ff9122] font-bold ml-1"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
