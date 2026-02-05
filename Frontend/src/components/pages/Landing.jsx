import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/lost-found-logo.png";
import bg from "../../assets/bg.png";

const Landing = () => {
  return (
    /* Changed min-h-screen to h-screen and added overflow-hidden to prevent any scrolling */
    <div
      className="relative h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

      {/* Logo Area - Adjusted padding for mobile */}
      <header className="absolute top-0 w-full p-4 md:p-6 flex justify-center md:justify-start z-30">
        <img
          src={logo}
          alt="logo"
          className="h-36 md:h-33 object-contain transition-transform hover:scale-105"
        />
      </header>

      {/* Main Content Card - Using flex-shrink to ensure it fits mobile */}
      <main className="relative z-10 w-full max-w-xl flex-shrink-1">
        <div className="bg-black/30 backdrop-blur-lg border border-white/20 p-6 md:p-10 rounded-2xl shadow-2xl mx-auto">
          
          <span className="inline-block px-3 py-0.5 rounded-full bg-black/30 text-[#f57c00] text-[10px] md:text-xs font-bold uppercase tracking-wider mb-3 border border-[#f57c00]/30">
            Community Portal
          </span>

          {/* Reduced text sizes slightly to save vertical space */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 md:mb-4 leading-tight">
            Lost it? <span className="text-[#f57c00]">Found</span> it? 
            <span className="block text-xl md:text-2xl font-light text-gray-200">Reclaim it.</span>
          </h1>

          <p className="text-sm md:text-base text-gray-200 mb-6 max-w-md leading-relaxed">
            Join the most trusted network for returning items. Fast, secure, and community-driven.
          </p>

          {/* Feature List - Hidden on very small screens or made more compact */}
          <ul className="grid grid-cols-2 gap-3 mb-8">
            {[
              { icon: "ri-search-eye-line", text: "Report Lost" },
              { icon: "ri-hand-heart-line", text: "Post Found" },
              { icon: "ri-shield-check-line", text: "Verified" },
              { icon: "ri-chat-3-line", text: "Messaging" },
            ].map((item, index) => (
              <li key={index} className="flex items-center text-white/90 gap-2">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#f57c00]">
                  <i className={`${item.icon} text-white text-[10px]`}></i>
                </div>
                <span className="text-xs md:text-sm font-medium">{item.text}</span>
              </li>
            ))}
          </ul>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/signup"
              className="group flex items-center justify-center gap-2 bg-[#1f3c88] hover:bg-[#2a4fb1] text-white px-6 py-3 rounded-xl font-bold text-base transition-all shadow-lg"
            >
              Get Started
              <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform"></i>
            </Link>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-xl font-bold text-base transition-all"
            >
              Log In
            </Link>
          </div>
        </div>
      </main>

      {/* Footer - Moved up slightly and tightened text */}
      <footer className="absolute bottom-4 z-10 text-black text-[10px] text-center px-4">
        <p>© 2026 Lost&Found Portal • Built for the community</p>
        <Link to="/connect" className="underline hover:text-blue-900 transition-colors" href="#">
          Connect with Developer
        </Link>
      </footer>
    </div>
  );
};

export default Landing;