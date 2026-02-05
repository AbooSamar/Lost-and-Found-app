import React from "react";
import { useNavigate } from "react-router-dom";

const Connect = () => {
  const navigate = useNavigate();

  // Hardcoded data
  const developerName = "Samar";
  const emailAddress = "samwork9065@gmail.com";
  const messageTitle = "Hi! What's up?";
  const messageBody =
    "I'm Samar, the developer behind this project. I'm always open to hearing your thoughts, feedback, or any suggestions you might have. If you're interested in collaborating or just want to say hi, feel free to reach out!";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {" "}
        {/* Reduced width from lg to md */}
        {/* Header Icon - Smaller */}
        <div className="mb-4 text-blue-600">
          <i className="ri-chat-smile-3-line text-3xl"></i>
        </div>
        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {messageTitle}
          </h1>

          <p className="text-base text-gray-600 leading-relaxed">
            {messageBody}
          </p>
        </div>
        {/* Divider - Smaller */}
        <div className="h-px bg-gray-100 my-6 w-16"></div>
        {/* Contact Section */}
        <div className="space-y-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-2">
              Get in touch
            </span>
            <div className="flex items-center gap-2 text-lg font-medium text-gray-800 break-all">
              <i className="ri-mail-line text-gray-400 flex-shrink-0"></i>
              <a
                href={`mailto:${emailAddress}`}
                className="hover:text-blue-600 transition-colors border-b border-transparent hover:border-blue-600"
              >
                {emailAddress}
              </a>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-500">
              Best regards,
              <br />
              <span className="font-medium text-gray-900">{developerName}</span>
            </p>
          </div>
        </div>
        {/* Back Button - Mobile Friendly */}
        <div className="mt-10 pt-6 border-t border-gray-50">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors"
          >
            <i className="ri-arrow-left-line"></i>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Connect;
