"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function MicrosoftButton({ 
  loading = false, 
  onClick, 
  theme = "dark",
  size = "full"
}) {
  const isLight = theme === "light";
  const buttonText = size === "short" ? "Sign in" : "Sign in with Microsoft";
  
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        relative flex items-center justify-center gap-3 
        border border-solid rounded-sm px-4 py-2.5 
        font-segoe text-[14px] font-semibold
        transition-all duration-200
        ${isLight 
          ? 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50' 
          : 'bg-[#2b2b2b] border-gray-600 text-white hover:bg-gray-700'
        }
        disabled:opacity-60 disabled:cursor-not-allowed
        min-h-[41px] w-full
      `}
    >
      {loading ? (
        <>
          <Loader2 className="h-[18px] w-[18px] animate-spin" />
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <div className="flex-shrink-0 w-[18px] h-[18px] relative">
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 23 23" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
              <rect x="12" y="1" width="10" height="10" fill="#7FBA00"/>
              <rect x="1" y="12" width="10" height="10" fill="#00A4EF"/>
              <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
            </svg>
          </div>
          <span className="select-none">
            {buttonText}
          </span>
        </>
      )}
    </button>
  );
}