import React from "react";

const PageLoader = () => {
  return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
      
      <div className="flex items-center space-x-2">

        {/* Loading Text */}
        <p className="text-[12px] tracking-[0.4em] uppercase text-white animate-glow">
          Loading....
        </p>

        {/* Small Glowing Spinner */}
        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin-slow glow-dot"></div>

      </div>

      <style>
        {`
          @keyframes glow {
            0%, 100% { 
              opacity: 0.6;
              text-shadow: 0 0 6px rgba(255,255,255,0.4);
            }
            50% { 
              opacity: 1;
              text-shadow: 0 0 16px rgba(255,255,255,0.9);
            }
          }

          @keyframes spinSlow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .animate-glow {
            animation: glow 2.2s ease-in-out infinite;
          }

          .animate-spin-slow {
            animation: spinSlow 1.2s linear infinite;
          }

          .glow-dot {
            box-shadow: 0 0 8px rgba(255,255,255,0.8);
          }
        `}
      </style>

    </div>
  );
};

export default PageLoader;