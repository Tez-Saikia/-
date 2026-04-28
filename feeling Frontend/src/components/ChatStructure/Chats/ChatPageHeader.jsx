import React, { useState, useRef } from "react";
import { LogOutIcon, Volume2, VolumeX, Loader2 } from "lucide-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserChatStore } from "@/store/useUserChatStore";
import avatar from "@/assets/pp.png";

const mouseClickSound = new Audio("/mouse-click.mp3");

function ChatPageHeader() {
  const { logout, authUser, updateAvatar, isUpdatingAvatar } = useAuthStore();

  const { onlineUsers, isSoundEnabled, toggleSound } = useUserChatStore();

  const isOnline = onlineUsers?.includes(authUser?._id);

  const [selectedImg, setSelectedImg] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const handleImgUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImg(URL.createObjectURL(file));
    await updateAvatar(file);
    setSelectedImg(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#181716] py-3 px-4 border-b border-slate-700 w-full">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="avatar-online relative">
            <button
              className="custom-xsm:size-[2.3rem] sm:size-[3rem] custom-xxl:size-[5.5rem] 2xl:size-[4rem] rounded-full overflow-hidden relative group"
              onClick={() => !isUpdatingAvatar && fileInputRef.current.click()}
              disabled={isUpdatingAvatar}
            >
              <img
                src={selectedImg || authUser?.avatar || avatar}
                alt="User Image"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.src = avatar;
                }}
                className={`size-full object-cover ${
                  isUpdatingAvatar ? "opacity-50" : ""
                }`}
              />

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImgUpload}
                className="hidden"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-[9px] xl:text-[1.3rem] 2xl:text-base">Change</span>
              </div>

              {/* Loading Overlay */}
              {isUpdatingAvatar && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="animate-spin text-white size-6" />
                </div>
              )}
            </button>

            {/*  Online Status */}
            <div
              className={`absolute top-0 right-0 custom-xsm:w-[.7rem] custom-xsm:h-[.7rem] custom-xxl:w-[1rem] custom-xxl:h-[1rem] 2xl:w-[.7rem] 2xl:h-[.7rem] custom-xxl:top-1  rounded-full border-2 border-[#181716]  ${
                isOnline ? "bg-green-500 " : "bg-red-500"
              }`}
            />
          </div>

          <div className="sm:mt-2"> 
            <h3 className="text-slate-50 font-medium custom-xsm:text-[13px] sm:text-[14px] max-w-[180px] truncate custom-xxl:text-[1.6rem] 2xl:text-[1rem]">
              {authUser?.username || "User"}
            </h3>
            <p className="text-slate-400 custom-xsm:text-[10px] sm:[11px] custom-xxl:text-[1rem] 2xl:text-[.8rem]">
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="relative flex items-center mt-2 sm:mt-4 custom-xxl:mt-6">
          <BsThreeDotsVertical
            className="cursor-pointer sm:text-[1.1rem] custom-xxl:text-[1.9rem] 2xl:text-[1.4rem] text-slate-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />

          {isMenuOpen && (
            <div className="absolute right-0 top-8 bg-[#222] border border-slate-700 rounded-md shadow-lg flex flex-col w-36  custom-xxl:w-52 z-50">
              <button
                className="flex items-center gap-2 px-4 py-2 custom-xxl:py-5  text-sm custom-xxl:text-xl  text-slate-300 hover:bg-[#2d2d2d]"
                onClick={handleLogout}
              >
                <LogOutIcon className="size-4 custom-xxl:size-7" />
                Logout
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 text-sm custom-xxl:text-xl custom-xxl:py-5 text-slate-300 hover:bg-[#2d2d2d]"
                onClick={() => {
                  if (isSoundEnabled) {
                    mouseClickSound.currentTime = 0;
                    mouseClickSound.play().catch(() => {});
                  }
                  toggleSound();
                }}
              >
                {isSoundEnabled ? (
                  <>
                    <Volume2 className="size-4 custom-xxl:size-7" />
                    Sound On
                  </>
                ) : (
                  <>
                    <VolumeX className="size-4 custom-xxl:size-7" />
                    Sound Off
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPageHeader;
