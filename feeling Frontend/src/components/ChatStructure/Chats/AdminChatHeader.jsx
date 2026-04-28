import React from "react";
import { LogOutIcon } from "lucide-react";
import { useAdminChatStore } from "@/store/useAdminChatStore";
import avatar from "@/assets/pp.png";

function AdminChatHeader() {
  const { selectedUser, onlineUsers, setSelectedUser } = useAdminChatStore();

  const isOnline = onlineUsers?.map(String).includes(String(selectedUser?._id));

  if (!selectedUser) return null;

  return (
    <div className="bg-[#181716] py-3 px-4 border-b border-slate-700 w-full flex items-center justify-between">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={selectedUser?.avatar || avatar}
            alt="User"
            className="w-10 h-10 custom-xxl:w-16 custom-xxl:h-16  rounded-full object-cover"
            onError={(e) => (e.currentTarget.src = avatar)}
          />
          <div
            className={`absolute top-0 custom-xxl:top-1 right-0 w-3 h-3 rounded-full border-2 border-[#181716] ${
              isOnline ? "bg-green-500" : "bg-red-500"
            }`}
          />
        </div>

        <div>
          <h3 className="text-white font-medium custom-xxl:text-xl">
            {selectedUser?.username || "User"}
          </h3>
          <p className="text-gray-400 text-sm custom-xxl:text-lg">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <button
        onClick={() => setSelectedUser(null)}
        className="text-white hover:text-gray-300 transition"
      >
        <LogOutIcon className="w-6 h-6 custom-xxl:w-7 custom-xxl:h-7" />
      </button>
    </div>
  );
}

export default AdminChatHeader;
