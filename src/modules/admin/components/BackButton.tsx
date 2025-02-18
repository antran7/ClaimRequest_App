import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton: React.FC<{ to: string }> = ({ to }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-center bg-blue-500 text-white gap-1 px-4 py-2 cursor-pointer text-gray-800 font-semibold tracking-widest rounded-md hover:bg-blue-400 duration-300 hover:gap-2 hover:-translate-x-3"
    >
      <svg
        className="w-5 h-5"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 12l2.731-8.875A59.769 59.769 0 0 0 2.515 12a59.768 59.768 0 0 0 18.216 8.875L18 12Zm0 0h-7.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        ></path>
      </svg>
      Back to Admin page
    </button>
  );
};

export default BackButton;
